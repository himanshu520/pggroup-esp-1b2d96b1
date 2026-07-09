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

  // Ensure the auth user exists
  let { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
  });

  if (createError) {
    const { data: list, error: getError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (getError) {
      throw new Error(getError.message || "Failed to resolve user");
    }
    const existing = list?.users?.find((u) => (u.email ?? "").toLowerCase() === email.toLowerCase());
    if (!existing) {
      throw new Error("Failed to resolve user");
    }
    user = { user: existing };
  }

  const userId = user?.user?.id;
  if (!userId) throw new Error("Failed to resolve user");

  // Generate a custom 6-digit OTP
  const customOtp = Math.floor(100000 + Math.random() * 900000).toString();

  // Generate native OTP via Supabase
  const { data: link, error } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });
  if (error) throw new Error(error.message);
  const supabaseOtp = link.properties?.email_otp;
  if (!supabaseOtp) throw new Error("Failed to generate OTP");

  // Store mapping in user metadata
  const mapping = {
    custom_otp: customOtp,
    supabase_otp: supabaseOtp,
    expires_at: Date.now() + 10 * 60 * 1000 // 10 minutes
  };

  await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...user.user?.user_metadata,
      otp_mapping: mapping
    }
  });

  // Send the custom 6-digit OTP to the admin
  await sendOtpEmail(email, customOtp, name ?? undefined);
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
    await generateAndSendOtp(known.email, known.name ?? data.name ?? null);
    return { sent: true };
  });

/**
 * Verifies the admin OTP server-side using the 6-to-8 digit mapping in user metadata.
 */
export const verifyAdminOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; token: string }) =>
    z.object({
      email: z.string().trim().email(),
      token: z.string().trim().min(6).max(10),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: user } = await supabaseAdmin.auth.admin.getUserByEmail(data.email);
    if (!user || !user.user) {
      throw new Error("Invalid or expired OTP");
    }

    const mapping = user.user.user_metadata?.otp_mapping;
    if (!mapping || mapping.custom_otp !== data.token || mapping.expires_at < Date.now()) {
      throw new Error("Invalid or expired OTP");
    }

    const supabaseOtp = mapping.supabase_otp;

    // Clear mapping from user metadata
    const updatedMetadata = { ...user.user.user_metadata };
    delete updatedMetadata.otp_mapping;
    await supabaseAdmin.auth.admin.updateUserById(user.user.id, {
      user_metadata: updatedMetadata
    });

    // Use a fresh publishable client so verifyOtp does not persist the session
    // in the server runtime.
    const { createClient } = await import("@supabase/supabase-js");
    const anon = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, storage: undefined } },
    );
    const { data: verified, error } = await anon.auth.verifyOtp({
      email: data.email,
      token: supabaseOtp,
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
// Employee flow (employee_code entered on /employee/login)
// ---------------------------------------------------------------------------

/**
 * Starts the employee OTP flow. Resolves the employee_code to a mobile phone
 * number and email server-side and sends the OTP via WhatsApp or Email.
 */
export const startEmployeeOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { employee_code: string; send_via?: "email" | "whatsapp" }) =>
    z.object({
      employee_code: z.string().trim().min(1).max(64),
      send_via: z.enum(["email", "whatsapp"]).default("email"),
    }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: emp } = await supabaseAdmin
      .from("employees")
      .select("id, email, name, active, mobile")
      .ilike("employee_code", data.employee_code)
      .maybeSingle();
    if (!emp || !emp.active || !emp.email) {
      throw new Error("Employee ID not found or inactive");
    }

    // Ensure the auth user exists
    await supabaseAdmin.auth.admin
      .createUser({ email: emp.email, email_confirm: true })
      .catch(() => {});

    // Generate a 6-digit custom OTP code
    const customOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Generate native OTP via Supabase
    const { data: link, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: emp.email,
    });
    if (error) throw new Error(error.message);
    const supabaseOtp = link.properties?.email_otp;
    if (!supabaseOtp) throw new Error("Failed to generate OTP");

    // Store mapping in reporting_manager column
    const mapping = JSON.stringify({
      custom_otp: customOtp,
      supabase_otp: supabaseOtp,
      expires_at: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    await supabaseAdmin
      .from("employees")
      .update({ reporting_manager: mapping })
      .eq("id", emp.id);

    if (data.send_via === "whatsapp") {
      if (!emp.mobile) {
        throw new Error("WhatsApp mobile number not registered for this Employee ID");
      }
      // Send the custom 6-digit OTP via WhatsApp
      const { sendOtpWhatsApp } = await import("./whatsapp.server");
      const success = await sendOtpWhatsApp(emp.mobile, customOtp, emp.name);
      if (!success) {
        throw new Error("Failed to send WhatsApp OTP. Please contact admin.");
      }
      return { send_via: "whatsapp", maskedContact: maskPhone(emp.mobile) };
    } else {
      // Default: Send the custom 6-digit OTP via Email
      const { sendOtpEmail } = await import("./otp.server");
      await sendOtpEmail(emp.email, customOtp, emp.name ?? undefined);
      return { send_via: "email", maskedContact: maskEmail(emp.email) };
    }
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
      .select("id, email, active, reporting_manager")
      .ilike("employee_code", data.employee_code)
      .maybeSingle();
    if (!emp || !emp.active || !emp.email || !emp.reporting_manager) {
      throw new Error("Invalid or expired OTP");
    }

    let mapping;
    try {
      mapping = JSON.parse(emp.reporting_manager);
    } catch {
      throw new Error("Invalid or expired OTP");
    }

    if (mapping.custom_otp !== data.token || mapping.expires_at < Date.now()) {
      throw new Error("Invalid or expired OTP");
    }

    const supabaseOtp = mapping.supabase_otp;

    // Clear mapping from employee table
    await supabaseAdmin
      .from("employees")
      .update({ reporting_manager: null })
      .eq("id", emp.id);

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
      token: supabaseOtp,
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
