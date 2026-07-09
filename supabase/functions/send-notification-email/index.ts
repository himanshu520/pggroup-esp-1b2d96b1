// Supabase Edge Function: send-notification-email
// Sends workflow notification emails via SMTP using nodemailer.
// Invoked server-side from createServerFn handlers (notify.server.ts).
import nodemailer from "npm:nodemailer@6.9.16";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Payload = {
  to: string | string[];
  subject: string;
  title: string;
  body?: string | null;
  link?: string | null;
  code?: string | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const authHeader = req.headers.get("Authorization") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  try {
    const { to, subject, title, body, link, code } = (await req.json()) as Payload;
    const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
    if (recipients.length === 0) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }

    const host = Deno.env.get("SMTP_HOST") ?? "smtp.office365.com";
    const port = Number(Deno.env.get("SMTP_PORT") ?? "587");
    const user = Deno.env.get("SMTP_USER")!;
    const pass = Deno.env.get("SMTP_PASS")!;
    const fromName = "PG Suggestion Portal";
    const appUrl = Deno.env.get("APP_URL") ?? "";

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: port === 587,
      auth: { user, pass },
    });

    const fullLink = link ? (link.startsWith("http") ? link : `${appUrl}${link}`) : "";
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff;color:#0f172a">
        <h2 style="color:#1e293b;margin:0 0 8px">PG Suggestion Portal</h2>
        <p style="color:#475569;margin:0 0 20px">Suggestion Management System</p>
        <h3 style="margin:0 0 12px;color:#0f172a">${title}</h3>
        ${body ? `<p style="color:#334155;line-height:1.5">${body}</p>` : ""}
        ${code ? `<p style="color:#64748b;font-size:13px">Reference: <strong>${code}</strong></p>` : ""}
        ${fullLink ? `<p style="margin:20px 0"><a href="${fullLink}" style="background:#1d4ed8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;display:inline-block">Open in portal</a></p>` : ""}
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">You are receiving this because notifications are enabled for your account. Manage preferences in the portal.</p>
      </div>`;

    await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to: recipients.join(","),
      subject,
      text: `${title}${body ? `\n\n${body}` : ""}${fullLink ? `\n\n${fullLink}` : ""}`,
      html,
    });

    return new Response(JSON.stringify({ ok: true, count: recipients.length }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-notification-email error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
