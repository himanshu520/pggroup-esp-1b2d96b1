import nodemailer from "nodemailer";

// Send the OTP email directly over SMTP using nodemailer.
// This runs server-side in our serverless backend (Vercel).
export async function sendOtpEmail(to: string, code: string, name?: string) {
  const host = (process.env.SMTP_HOST || "smtp.office365.com").trim().replace(/^["']|["']$/g, "");
  const port = Number((process.env.SMTP_PORT || "587").toString().trim().replace(/^["']|["']$/g, ""));
  const user = (process.env.SMTP_USER || "verify.software2040@pgel.in").trim().replace(/^["']|["']$/g, "");
  const pass = (process.env.SMTP_PASS || "nsxfmjjkskdrbbtt").trim().replace(/^["']|["']$/g, "");

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

  const mailOptions = {
    from: `"PG Suggestion Portal" <${user}>`,
    to,
    subject: `Your PG Portal OTP: ${code}`,
    text: `Your one-time password is ${code}. It expires in 10 minutes.`,
    html,
  };

  const createTransportForHost = (targetHost: string) => {
    return nodemailer.createTransport({
      host: targetHost,
      port,
      secure: false, // port 587 uses STARTTLS
      requireTLS: true,
      auth: { user, pass },
      tls: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    });
  };

  // Attempt 1: Primary host (smtp.office365.com)
  try {
    const transporter = createTransportForHost(host);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[OTP Email] Delivered to ${to} via ${host} (Message-ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (primaryErr: any) {
    console.warn(`[OTP Email] Delivery failed via ${host}:`, primaryErr?.message || primaryErr);

    // Attempt 2: Alternative host (smtp-mail.outlook.com)
    const secondaryHost = host === "smtp.office365.com" ? "smtp-mail.outlook.com" : "smtp.office365.com";
    try {
      console.log(`[OTP Email] Retrying delivery via ${secondaryHost}...`);
      const fallbackTransporter = createTransportForHost(secondaryHost);
      const info = await fallbackTransporter.sendMail(mailOptions);
      console.log(`[OTP Email] Delivered to ${to} via fallback ${secondaryHost} (Message-ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId };
    } catch (secondaryErr: any) {
      console.error(`[OTP Email] Both SMTP endpoints failed:`, secondaryErr?.message || secondaryErr);
      const finalMsg = secondaryErr?.message || primaryErr?.message || "Office 365 SMTP connection failed";
      throw new Error(`Email delivery error: ${finalMsg}`);
    }
  }
}

