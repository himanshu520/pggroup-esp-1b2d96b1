// Supabase Edge Function: send-otp
// Sends OTP emails via SMTP using nodemailer (loaded via Deno npm compat).
import nodemailer from "npm:nodemailer@6.9.16";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  // Require the caller to present the service role key. This function is only
  // meant to be invoked server-side by our own createServerFn handlers.
  const authHeader = req.headers.get("Authorization") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }


  try {
    const { to, code, name } = await req.json();
    if (!to || !code) {
      return new Response(JSON.stringify({ error: "Missing to/code" }), {
        status: 400, headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const host = Deno.env.get("SMTP_HOST") ?? "smtp.office365.com";
    const port = Number(Deno.env.get("SMTP_PORT") ?? "587");
    const user = Deno.env.get("SMTP_USER")!;
    const pass = Deno.env.get("SMTP_PASS")!;
    const fromName = "PG Suggestion Portal";

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user, pass },
    });

    const greeting = name ? `Hi ${name},` : "Hello,";
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#ffffff;color:#0f172a">
        <h2 style="color:#1e293b;margin:0 0 8px">PG Suggestion Portal</h2>
        <p style="color:#475569;margin:0 0 20px">Suggestion Management System</p>
        <p>${greeting}</p>
        <p>Use the following One-Time Password (OTP) to sign in. This code expires in 10 minutes.</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 24px;background:#f1f5f9;border-radius:8px;text-align:center;margin:20px 0;color:#0f172a">${code}</div>
        <p style="color:#64748b;font-size:13px">If you did not request this code, you can safely ignore this email.</p>
      </div>`;

    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to,
      subject: `Your PG Portal OTP: ${code}`,
      text: `Your one-time password is ${code}. It expires in 10 minutes.`,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-otp error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
