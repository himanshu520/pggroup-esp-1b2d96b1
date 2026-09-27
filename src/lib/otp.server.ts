import nodemailer from "nodemailer";

// Send the OTP email directly over SMTP using nodemailer.
// This runs server-side in our serverless backend (Vercel).
export async function sendOtpEmail(to: string, code: string, name?: string) {
  const host = (process.env.SMTP_HOST || "smtp.office365.com").trim().replace(/^["']|["']$/g, "");
  const port = Number((process.env.SMTP_PORT || "587").toString().trim().replace(/^["']|["']$/g, ""));
  const user = (process.env.SMTP_USER || "verify.software2040@pgel.in").trim().replace(/^["']|["']$/g, "");
  let pass = (process.env.SMTP_PASS || "fmdrdczrxkpjrbsv").trim().replace(/^["']|["']$/g, "");
  // Safeguard against stale or expired credentials stored in old environment caches
  if (pass === "nsxfmjjkskdrbbtt" || !pass) {
    pass = "fmdrdczrxkpjrbsv";
  }

  const greeting = name ? `Hi ${name},` : "Hello,";
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#ffffff;color:#0f172a;border:1px solid #e2e8f0;border-radius:8px">
      <div style="border-bottom:2px solid #2563eb;padding-bottom:12px;margin-bottom:16px">
        <h2 style="color:#1e293b;margin:0 0 4px;font-size:20px">PG Electroplast Limited</h2>
        <p style="color:#64748b;margin:0;font-size:13px">Employee Suggestion Portal (ESP) &bull; Verification Service</p>
      </div>
      <p style="color:#334155;font-size:15px;margin:0 0 12px">${greeting}</p>
      <p style="color:#475569;font-size:14px;margin:0 0 16px">Use the following One-Time Password (OTP) to sign in. This code is valid for <strong>10 minutes</strong>.</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:16px 24px;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px;text-align:center;margin:20px 0;color:#1e293b">${code}</div>
      <p style="color:#64748b;font-size:13px;margin:0 0 6px">If you did not request this code, you can safely ignore this email.</p>
      <div style="margin-top:24px;padding-top:12px;border-top:1px solid #f1f5f9;color:#94a3b8;font-size:11px">
        PGEL MIS Verification &bull; Automated Message &bull; Please do not reply
      </div>
    </div>`;

  const mailOptions = {
    from: `"PGEL MIS Verification" <${user}>`,
    to,
    subject: `PGEL MIS - Login Verification OTP: ${code}`,
    text: `Your one-time password is ${code}. It expires in 10 minutes.`,
    html,
  };

  const createTransportForHost = (targetHost: string) => {
    return nodemailer.createTransport({
      host: targetHost,
      port,
      secure: false, // port 587 uses STARTTLS
      auth: { user, pass },
      tls: {
        ciphers: "SSLv3",
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

