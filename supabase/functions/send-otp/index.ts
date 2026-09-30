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

    const host = (Deno.env.get("SMTP_HOST") ?? "smtp.office365.com").trim().replace(/^["']|["']$/g, "");
    const port = Number((Deno.env.get("SMTP_PORT") ?? "587").toString().trim().replace(/^["']|["']$/g, ""));
    const user = (Deno.env.get("SMTP_USER") ?? "verify.software2040@pgel.in").trim().replace(/^["']|["']$/g, "");
    let pass = (Deno.env.get("SMTP_PASS") ?? "fmdrdczrxkpjrbsv").trim().replace(/^["']|["']$/g, "");
    if (pass === "nsxfmjjkskdrbbtt" || !pass) {
      pass = "fmdrdczrxkpjrbsv";
    }
    const fromName = "PG Group ESP";

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false, // port 587 uses STARTTLS
      auth: { user, pass },
      tls: {
        ciphers: "SSLv3",
        rejectUnauthorized: false,
      },
    });

    const greeting = name ? `Hi ${name},` : "Hello,";
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#ffffff;color:#0f172a;border:1px solid #e2e8f0;border-radius:8px">
        <div style="border-bottom:2px solid #2563eb;padding-bottom:12px;margin-bottom:16px">
          <h2 style="color:#1e293b;margin:0 0 4px;font-size:20px">PG Group</h2>
          <p style="color:#64748b;margin:0;font-size:13px">Employee Suggestion Portal (ESP) &bull; Verification Service</p>
        </div>
        <p style="color:#334155;font-size:15px;margin:0 0 12px">${greeting}</p>
        <p style="color:#475569;font-size:14px;margin:0 0 16px">Use the following One-Time Password (OTP) to sign in. This code is valid for <strong>10 minutes</strong>.</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 24px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px;text-align:center;margin:20px 0;color:#1e293b">${code}</div>
        <p style="color:#64748b;font-size:13px;margin:0 0 6px">If you did not request this code, you can safely ignore this email.</p>
        <div style="margin-top:24px;padding-top:12px;border-top:1px solid #f1f5f9;color:#94a3b8;font-size:11px">
          PG Group ESP &bull; Automated Message &bull; Please do not reply
        </div>
      </div>`;

    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to,
      subject: `PG Group ESP - Login Verification OTP: ${code}`,
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
