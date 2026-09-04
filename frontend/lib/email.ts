import nodemailer from "nodemailer";

function getTransporter() {
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || "").trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");

  if (host.includes("gmail") || user.includes("gmail")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: user && pass ? { user, pass } : undefined,
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: user && pass ? { user, pass } : undefined,
  });
}

export interface OtpEmailProps {
  to: string;
  recipientName: string;
  otpCode: string;
  expiresInMinutes?: number;
}

export interface BookingEmailProps {
  to: string;
  visitorName: string;
  productName: string;
  bookingDate: string;
  timeSlot: string;
  ownerName?: string;
}

/**
 * Dispatches a 6-digit corporate verification passcode to the user's email.
 */
export async function sendOtpVerificationEmail(props: OtpEmailProps): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const { to, recipientName, otpCode, expiresInMinutes = 10 } = props;
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || "").trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    console.warn(`[EmailService] ⚠️ SMTP credentials not detected in environment. Simulated OTP for ${recipientName} (${to}): ${otpCode}`);
    return { success: true, simulated: true };
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08090b; color: #f5f5f7; margin: 0; padding: 24px 12px;">
        <div style="max-width: 520px; margin: 0 auto; background: #111318; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <div style="background: #000000; padding: 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <span style="color: #00B4D8; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">THE FIFTHLAB CORPORATE SECURITY</span>
          </div>
          <div style="padding: 36px 24px; text-align: center;">
            <span style="display: inline-block; background: rgba(0,180,216,0.12); color: #00B4D8; border: 1px solid rgba(0,180,216,0.3); padding: 4px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">PERSONNEL AUTHENTICATION</span>
            <h2 style="color: #ffffff; margin-top: 18px; margin-bottom: 8px; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">Your Single-Use Access Code</h2>
            <p style="color: rgba(255,255,255,0.7); font-size: 13px; line-height: 1.6; margin: 0 0 28px 0;">
              Hello <strong style="color: #ffffff;">${recipientName}</strong>, enter this single-use verification code to authenticate your session in The FifthLab Dashboard.
            </p>

            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(0,180,216,0.35); border-radius: 14px; padding: 20px 28px; display: inline-block; margin: 0 auto 28px auto;">
              <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #00B4D8; text-shadow: 0 0 20px rgba(0,180,216,0.3);">${otpCode}</span>
            </div>

            <p style="color: rgba(255,255,255,0.5); font-size: 12px; line-height: 1.6; margin: 0;">
              This code will expire in <strong style="color: rgba(255,255,255,0.85);">${expiresInMinutes} minutes</strong>.<br>If you did not request this login, please disregard or report to FifthLab Security immediately.
            </p>
          </div>
          <div style="background: #000000; padding: 18px 24px; text-align: center; color: rgba(255,255,255,0.4); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.08); line-height: 1.5;">
            © 2026 The FifthLab Nigeria. All rights reserved.<br>Corporate Access Control & Dashboard
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = getTransporter();
    const fromAddress = process.env.SMTP_FROM || `"The FifthLab Security" <${user}>`;

    const info = await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `🔐 Your FifthLab Access Code: ${otpCode}`,
      html: htmlContent,
    });

    console.log(`[EmailService] ✅ Security OTP successfully sent to ${to} (MessageId: ${info.messageId})`);
    return { success: true };
  } catch (error: any) {
    console.error(`[EmailService] ❌ Failed to dispatch OTP email to ${to}:`, error);
    return { success: false, error: error.message || "Failed to dispatch email" };
  }
}
