/**
 * Zero-Trust ESP Employee ID + WhatsApp OTP Login Functions
 *
 * Flow:
 *  1. Employee enters Employee ID (e.g. PG-1042)
 *  2. Server looks up esp_employees table, validates status === 'active'
 *  3. Server calls Central PG GROUP WhatsApp OTP Gateway to send branded OTP
 *  4. Frontend shows masked mobile and OTP input – raw mobile NEVER sent to client
 *  5. Employee enters 6-digit OTP
 *  6. Server verifies OTP with Gateway
 *  7. On success: creates JWT session, returns role-based redirect URL
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mask mobile: +917988404377 → "+91 ••••••4377" */
function maskMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  if (digits.length < 4) return "••••••••••";
  const last4 = digits.slice(-4);
  return `+91 ••••••${last4}`;
}

/** Build role-based redirect URL */
function getRoleRedirect(role: string, department: string): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "hod":
      return `/employee`; // HODs use employee portal; adjust if you have /hod routes
    case "supervisor":
      return "/employee";
    default:
      return "/employee";
  }
}

// ---------------------------------------------------------------------------
// A. POST /api/auth/send-otp  →  sendEspOtp server function
// ---------------------------------------------------------------------------

export const sendEspOtp = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z.object({ employee_id: z.string().trim().min(1).max(32) }).parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const empId = data.employee_id.trim().toUpperCase();

    // 1. Look up employee in esp_employees table
    const { data: emp, error: dbErr } = await supabaseAdmin
      .from("esp_employees" as any)
      .select("employee_id, full_name, mobile, role, department, status")
      .eq("employee_id", empId)
      .maybeSingle();

    if (dbErr) {
      console.error("[ESP Auth] DB error looking up employee:", dbErr);
      throw new Error("Service temporarily unavailable. Please try again.");
    }

    if (!emp) {
      throw new Error(
        "Employee ID not found. Please contact HR / Admin.",
      );
    }

    if ((emp as any).status !== "active") {
      throw new Error(
        "Your employee account is inactive. Please contact HR / Admin.",
      );
    }

    const mobile: string = (emp as any).mobile;
    const employeeName: string = (emp as any).full_name;

    // 2. Call PG GROUP WhatsApp OTP Gateway
    const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;
    const gatewaySecret = process.env.ESP_GATEWAY_SECRET;

    if (!gatewayUrl || !gatewaySecret) {
      throw new Error(
        "WhatsApp Gateway is not configured. Please contact the system administrator.",
      );
    }

    let gatewayResult: any;
    try {
      const res = await fetch(`${gatewayUrl}/api/v1/esp/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-ESP-Secret": gatewaySecret,
        },
        body: JSON.stringify({
          mobile,
          employee_id: empId,
          employee_name: employeeName,
          app_name: "Employee Suggestion Portal",
        }),
      });

      gatewayResult = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Handle rate-limit / cooldown
        if (res.status === 429 || gatewayResult?.retry_after_seconds) {
          const retryAfter =
            gatewayResult?.details?.retry_after_seconds ??
            gatewayResult?.retry_after_seconds ??
            30;
          throw Object.assign(
            new Error(
              gatewayResult?.message ||
                `Please wait ${retryAfter}s before requesting another OTP.`,
            ),
            { retry_after: retryAfter },
          );
        }
        throw new Error(
          gatewayResult?.message ||
            `Gateway error (${res.status}). Please try again.`,
        );
      }
    } catch (err: any) {
      if (err.retry_after !== undefined) throw err; // re-throw rate-limit error
      console.error("[ESP Auth] Gateway send error:", err.message || err);
      throw new Error(
        err.message || "Failed to send WhatsApp OTP. Please try again.",
      );
    }

    console.log(
      `[ESP Auth] OTP sent for ${empId} (${employeeName}) to ${maskMobile(mobile)}`,
    );

    return {
      ok: true,
      masked_mobile: maskMobile(mobile),
      employee_name: employeeName,
    };
  });

// ---------------------------------------------------------------------------
// B. POST /api/auth/verify-otp  →  verifyEspOtp server function
// ---------------------------------------------------------------------------

export const verifyEspOtp = createServerFn({ method: "POST" })
  .validator((d: unknown) =>
    z
      .object({
        employee_id: z.string().trim().min(1).max(32),
        otp: z.string().trim().length(6),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const empId = data.employee_id.trim().toUpperCase();

    // 1. Fetch employee record
    const { data: emp, error: dbErr } = await supabaseAdmin
      .from("esp_employees" as any)
      .select("employee_id, full_name, mobile, role, department, status")
      .eq("employee_id", empId)
      .maybeSingle();

    if (dbErr || !emp) {
      throw new Error("Invalid or expired OTP.");
    }

    if ((emp as any).status !== "active") {
      throw new Error("Your employee account is inactive.");
    }

    const mobile: string = (emp as any).mobile;
    const role: string = (emp as any).role;
    const department: string = (emp as any).department;
    const fullName: string = (emp as any).full_name;

    // 2. Verify OTP with Gateway
    const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL;
    const gatewaySecret = process.env.ESP_GATEWAY_SECRET;

    if (!gatewayUrl || !gatewaySecret) {
      throw new Error("WhatsApp Gateway is not configured.");
    }

    let verifyResult: any;
    try {
      const res = await fetch(`${gatewayUrl}/api/v1/esp/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-ESP-Secret": gatewaySecret,
        },
        body: JSON.stringify({ mobile, otp: data.otp }),
      });

      verifyResult = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          verifyResult?.message || "Invalid or expired OTP. Please try again.",
        );
      }
    } catch (err: any) {
      console.error("[ESP Auth] Gateway verify error:", err.message || err);
      throw new Error(
        err.message || "Invalid or expired OTP. Please try again.",
      );
    }

    // 3. Create / upsert auth user for this employee (deterministic internal email)
    const safeId = empId.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    const authEmail = `${safeId}@esp.internal`;

    await supabaseAdmin.auth.admin
      .createUser({ email: authEmail, email_confirm: true })
      .catch(() => {}); // ignore "already exists"

    // 4. Generate a magic link to get a fresh session
    const { data: link, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: authEmail,
      });

    if (linkErr || !link?.properties?.email_otp) {
      throw new Error("Failed to create session. Please try again.");
    }

    // 5. Exchange magic link OTP for a real session via anon client
    const { createClient } = await import("@supabase/supabase-js");
    const anonClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false, storage: undefined } },
    );

    const { data: verified, error: sessionErr } =
      await anonClient.auth.verifyOtp({
        email: authEmail,
        token: link.properties.email_otp,
        type: "email",
      });

    if (sessionErr || !verified?.session) {
      throw new Error("Failed to establish session. Please try again.");
    }

    // 6. Store esp role + employee_id in user metadata for session context
    await supabaseAdmin.auth.admin.updateUserById(verified.session.user.id, {
      user_metadata: {
        esp_employee_id: empId,
        esp_role: role,
        esp_department: department,
        esp_name: fullName,
      },
    });

    const redirectUrl = getRoleRedirect(role, department);

    console.log(
      `[ESP Auth] Login success for ${empId} (${role}) → ${redirectUrl}`,
    );

    return {
      ok: true,
      access_token: verified.session.access_token,
      refresh_token: verified.session.refresh_token,
      user: {
        employee_id: empId,
        name: fullName,
        role,
        department,
      },
      redirect_url: redirectUrl,
    };
  });
