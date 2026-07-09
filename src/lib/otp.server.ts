import nodemailer from "nodemailer";

// Send the OTP email directly over SMTP using nodemailer.
// This runs server-side in our serverless backend (Vercel).
export async function sendOtpEmail(to: string, code: string, name?: string) {
  const host = process.env.SMTP_HOST ?? "smtp.office365.com";
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP credentials (SMTP_USER and SMTP_PASS) are not configured in the environment");
  }

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
    from: `"PG Suggestion Portal" <${user}>`,
    to,
    subject: `Your PG Portal OTP: ${code}`,
    text: `Your one-time password is ${code}. It expires in 10 minutes.`,
    html,
  });
}

