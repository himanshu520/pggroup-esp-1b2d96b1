import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// ---------------------------------------------------------------------------
// OTP helpers
// ---------------------------------------------------------------------------

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "***";
  const head = local.slice(0, Math.min(2, local.length));
  return `${head}${"*".repeat(Math.max(1, local.length - head.length))}@${domain}`;
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/[\s\-\+\(\)]/g, "");
  if (clean.length <= 4) return "****";
  return `+91 ******${clean.slice(-4)}`;
}

/**
 * Server-side existence check. Returns the real email only inside the trusted
 * server runtime — never returned to the client. Generic "not found" errors
 * prevent enumeration.
 */
async function resolveKnownEmail(rawEmail: string): Promise<{ email: string; name?: string | null } | null> {
  const email = rawEmail.trim().toLowerCase();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Allow existing role-bearing users (corporate/super admins provisioned
  // outside the employees table). Look them up via the admin API and confirm
  // they carry at least one user_roles row before sending an OTP.
  try {
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    const authUser = list?.users?.find((u) => (u.email ?? "").toLowerCase() === email);
    if (!authUser) return null;
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", authUser.id)
      .limit(1);
    if (roles && roles.length > 0) return { email, name: null };
  } catch {
    /* fall through */
  }
  return null;
}


async function generateAndSendOtp(email: string, name?: string | null) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendOtpEmail } = await import("./otp.server");
  const { data: link, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (error) throw new Error(error.message);
  const otp = link.properties?.email_otp;
  if (!otp) throw new Error("Failed to generate OTP");
  await sendOtpEmail(email, otp, name ?? undefined);
}

// ---------------------------------------------------------------------------
// Admin flow (email entered directly on /auth)
// ---------------------------------------------------------------------------

/**
 * Admin OTP: caller supplies an email. We only send the OTP if the address
 * already belongs to an active employee or an existing role-bearing user.
 * Unknown emails receive a generic error — no user is auto-created.
 */
export const sendCustomOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; name?: string }) =>
    z.object({ email: z.string().trim().email(), name: z.string().optional() }).parse(d),
  )
  .handler(async ({ data }) => {
    const known = await resolveKnownEmail(data.email);
    if (!known) {
      // Generic error — do not disclose whether the email exists.
      throw new Error("This email is not authorised to sign in");
    }
    // Ensure an auth user exists for the known email so generateLink can mint an OTP.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.auth.admin
      .createUser({ email: known.email, email_confirm: true })
      .catch(() => {});
    await generateAndSendOtp(known.email, known.name ?? data.name ?? null);
    return { sent: true };
  });

// ---------------------------------------------------------------------------
// Employee flow (employee_code entered on /employee/login)
// ---------------------------------------------------------------------------

/**
 * Starts the employee OTP flow. Resolves the employee_code to a mobile phone
 * number and email server-side and sends the OTP via WhatsApp.
 */
export const startEmployeeOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { employee_code: string }) =>
    z.object({ employee_code: z.string().trim().min(1).max(64) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: emp } = await supabaseAdmin
      .from("employees")
      .select("email, name, active, mobile")
      .ilike("employee_code", data.employee_code)
      .maybeSingle();
    if (!emp || !emp.active || !emp.email) {
      throw new Error("Employee ID not found or inactive");
    }
    if (!emp.mobile) {
      throw new Error("WhatsApp mobile number not registered for this Employee ID");
    }

    // Ensure the auth user exists
    await supabaseAdmin.auth.admin
      .createUser({ email: emp.email, email_confirm: true })
      .catch(() => {});

    // Generate native OTP via Supabase
    const { data: link, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: emp.email,
    });
    if (error) throw new Error(error.message);
    const otp = link.properties?.email_otp;
    if (!otp) throw new Error("Failed to generate OTP");

    // Send the OTP via WhatsApp Cloud API / Twilio / Custom gateway
    const { sendOtpWhatsApp } = await import("./whatsapp.server");
    const success = await sendOtpWhatsApp(emp.mobile, otp, emp.name);
    if (!success) {
      throw new Error("Failed to send WhatsApp OTP. Please contact admin.");
    }

    return { maskedPhone: maskPhone(emp.mobile) };
  });

/**
 * Verifies the employee OTP server-side (the real email never touches the
 * browser). Returns session tokens the client hands to
 * `supabase.auth.setSession`.
 */
export const verifyEmployeeOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { employee_code: string; token: string }) =>
    z
      .object({
        employee_code: z.string().trim().min(1).max(64),
        token: z.string().trim().min(6).max(10),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: emp } = await supabaseAdmin
      .from("employees")
      .select("email, active")
      .ilike("employee_code", data.employee_code)
      .maybeSingle();
    if (!emp || !emp.active || !emp.email) {
      throw new Error("Invalid or expired OTP");
    }
    // Use a fresh publishable client so verifyOtp does not persist the session
    // in the server runtime.
    const { createClient } = await import("@supabase/supabase-js");
    const anon = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, storage: undefined } },
    );
    const { data: verified, error } = await anon.auth.verifyOtp({
      email: emp.email,
      token: data.token,
      type: "email",
    });
    if (error || !verified.session) {
      throw new Error("Invalid or expired OTP");
    }
    return {
      access_token: verified.session.access_token,
      refresh_token: verified.session.refresh_token,
    };
  });

// ---------------------------------------------------------------------------
// After sign-in: link auth.users.id back to the employee row (authenticated).
// ---------------------------------------------------------------------------

export const linkAuthUserToEmployee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: user } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    const email = user.user?.email;
    if (!email) return { linked: false };
    const { data: emp } = await supabaseAdmin
      .from("employees")
      .select("id,user_id")
      .ilike("email", email)
      .maybeSingle();
    if (emp && !emp.user_id) {
      await supabaseAdmin.from("employees").update({ user_id: context.userId }).eq("id", emp.id);
    }
    return { linked: true };
  });
