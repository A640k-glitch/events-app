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

export interface BookingConfirmationEmailProps {
  to: string;
  visitorName: string;
  productName: string;
  bookingDate: string;
  timeSlot: string;
  ownerName: string;
}

export interface EventTicketEmailProps {
  to: string;
  visitorName: string;
  company: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  ticketTier: string;
  qrPassCode: string;
  qrBadgeDataUrl: string;
}

export interface OtpEmailProps {
  to: string;
  recipientName: string;
  otpCode: string;
  expiresInMinutes?: number;
}

// 📧 1. Send Corporate Security OTP Code
export async function sendOtpVerificationEmail(props: OtpEmailProps): Promise<boolean> {
  const { to, recipientName, otpCode, expiresInMinutes = 10 } = props;
  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || "").trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    console.log(`[EmailService] 🔐 Simulation OTP Code for ${recipientName} (${to}): ${otpCode}`);
    return true;
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #08090b; color: #f5f5f7; margin: 0; padding: 20px;">
        <div style="max-width: 540px; margin: 0 auto; background: #111318; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <div style="background: #000000; padding: 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <span style="color: #06b6d4; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">THE FIFTHLAB CORPORATE SECURITY</span>
          </div>
          <div style="padding: 32px 24px; text-align: center;">
            <span style="display: inline-block; background: rgba(6,182,212,0.15); color: #06b6d4; border: 1px solid rgba(6,182,212,0.3); padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">PERSONNEL AUTHENTICATION</span>
            <h2 style="color: #ffffff; margin-top: 16px; font-size: 22px; font-weight: 600;">Your Corporate Access Code</h2>
            <p style="color: rgba(255,255,255,0.7); font-size: 13px; line-height: 1.5; margin: 0 0 24px 0;">
              Hello <strong>${recipientName}</strong>, enter this single-use verification code to authenticate your session in The FifthLab Command Hub.
            </p>

            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(6,182,212,0.3); border-radius: 12px; padding: 20px; display: inline-block; margin: 0 auto 24px auto;">
              <span style="font-family: monospace, Courier; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #06b6d4;">${otpCode}</span>
            </div>

            <p style="color: rgba(255,255,255,0.5); font-size: 12px; line-height: 1.5; margin: 0;">
              This code will expire in <strong>${expiresInMinutes} minutes</strong>. If you did not request this login, please notify FifthLab Security immediately.
            </p>
          </div>
          <div style="background: #000000; padding: 16px; text-align: center; color: rgba(255,255,255,0.4); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.08);">
            © 2026 The FifthLab Nigeria. All rights reserved. • Corporate Access Control
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"The FifthLab Security" <${user}>`,
      to,
      subject: `🔐 Your FifthLab Access Code: ${otpCode}`,
      html: htmlContent,
    });

    console.log(`[EmailService] ✅ Security OTP delivered to ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[EmailService] ❌ Failed to dispatch OTP to ${to}:`, error);
    return false;
  }
}

// 📧 2. Send Public Event Ticket with Embedded QR Badge
export async function sendEventTicketEmail(props: EventTicketEmailProps): Promise<boolean> {
  const {
    to,
    visitorName,
    company,
    eventTitle,
    eventDate,
    eventTime,
    eventLocation,
    ticketTier,
    qrPassCode,
    qrBadgeDataUrl,
  } = props;

  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || "").trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    console.log(`[EmailService] 🎟️ Event QR Ticket dispatched in simulation for ${visitorName} (${to}) [Pass Code: ${qrPassCode}]`);
    return true;
  }

  try {
    const base64Data = qrBadgeDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(base64Data, "base64");
    const formattedTier = ticketTier.replace(/_/g, " ");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #08090b; color: #f5f5f7; margin: 0; padding: 20px; }
          .ticket-card { max-width: 580px; margin: 0 auto; background: #111318; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
          .header { background: #000000; padding: 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .content { padding: 32px 24px; text-align: center; }
          .tier-badge { display: inline-block; background: rgba(6,182,212,0.15); color: #06b6d4; border: 1px solid rgba(6,182,212,0.3); padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          .event-title { color: #ffffff; font-size: 22px; font-weight: 600; margin: 16px 0 8px 0; line-height: 1.3; }
          .qr-container { background: #ffffff; border-radius: 12px; padding: 16px; display: inline-block; margin: 24px auto; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
          .meta-table { width: 100%; border-collapse: collapse; margin: 24px 0; text-align: left; font-size: 13px; }
          .meta-table td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
          .meta-label { color: rgba(255,255,255,0.4); font-weight: 500; }
          .footer { background: #000000; padding: 16px; text-align: center; color: rgba(255,255,255,0.4); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.08); }
        </style>
      </head>
      <body>
        <div class="ticket-card">
          <div class="header">
            <span style="color: #06b6d4; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">THE FIFTHLAB EVENTS</span>
          </div>
          <div class="content">
            <span class="tier-badge">${formattedTier}</span>
            <h1 class="event-title">${eventTitle}</h1>
            <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 0;">Issued to <strong>${visitorName}</strong> (${company})</p>

            <div class="qr-container">
              <img src="cid:qrBadge" alt="QR Ticket Code" style="width: 180px; height: 180px; display: block;" />
            </div>

            <p style="color: #06b6d4; font-family: monospace; font-size: 14px; font-weight: bold; margin: 4px 0 20px 0;">PASS CODE: ${qrPassCode}</p>

            <table class="meta-table">
              <tr>
                <td class="meta-label">Date</td>
                <td><strong>${eventDate}</strong></td>
              </tr>
              <tr>
                <td class="meta-label">Time</td>
                <td><strong>${eventTime}</strong></td>
              </tr>
              <tr>
                <td class="meta-label">Venue</td>
                <td><strong>${eventLocation}</strong></td>
              </tr>
              <tr>
                <td class="meta-label">Access</td>
                <td><span style="color: #10b981;">● Confirmed Verified Registration</span></td>
              </tr>
            </table>

            <p style="color: rgba(255,255,255,0.5); font-size: 12px; line-height: 1.5; margin-top: 16px;">
              Present this digital QR ticket at the registration desk for instant badge printing and venue check-in.
            </p>
          </div>
          <div class="footer">
            © 2026 The FifthLab Nigeria. All rights reserved. • West Africa Event Operations
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"The FifthLab Events" <${user}>`,
      to,
      subject: `🎟️ Your Event Pass: ${eventTitle}`,
      html: htmlContent,
      attachments: [
        {
          filename: `ticket-${qrPassCode}.png`,
          content: qrBuffer,
          cid: "qrBadge",
        },
      ],
    });

    console.log(`[EmailService] ✅ Real QR Ticket delivered to ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[EmailService] ❌ Failed to dispatch ticket to ${to}:`, error);
    return false;
  }
}

// 📧 3. Send Executive Demo Booking Confirmation
export async function sendBookingConfirmationEmail(props: BookingConfirmationEmailProps): Promise<boolean> {
  const { to, visitorName, productName, bookingDate, timeSlot, ownerName } = props;

  const user = (process.env.SMTP_USER || process.env.GMAIL_USER || "").trim();
  const pass = (process.env.SMTP_PASS || process.env.GMAIL_APP_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    console.log(`[EmailService] 💼 Demo confirmation in simulation for ${to} (${productName})`);
    return true;
  }

  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #08090b; color: #f5f5f7; margin: 0; padding: 20px;">
        <div style="max-width: 580px; margin: 0 auto; background: #111318; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <div style="background: #000000; padding: 24px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <span style="color: #06b6d4; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">THE FIFTHLAB SOLUTIONS</span>
          </div>
          <div style="padding: 32px 24px; text-align: left;">
            <h2 style="color: #ffffff; margin-top: 0; font-size: 20px;">Executive Demo Scheduled</h2>
            <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.5;">
              Hello <strong>${visitorName}</strong>, thank you for scheduling a personalized walkthrough of <strong>${productName}</strong>.
            </p>
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
              <p style="margin: 6px 0; color: rgba(255,255,255,0.8);"><strong>Product:</strong> <span style="color: #06b6d4;">${productName}</span></p>
              <p style="margin: 6px 0; color: rgba(255,255,255,0.8);"><strong>Date:</strong> ${bookingDate}</p>
              <p style="margin: 6px 0; color: rgba(255,255,255,0.8);"><strong>Time:</strong> ${timeSlot} (WAT • West Africa Time)</p>
              <p style="margin: 6px 0; color: rgba(255,255,255,0.8);"><strong>Assigned Specialist:</strong> ${ownerName}</p>
            </div>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px; line-height: 1.5;">
              A calendar invitation has been prepared for your session. If you need to invite additional colleagues, simply reply to this email.
            </p>
          </div>
          <div style="background: #000000; padding: 16px; text-align: center; color: rgba(255,255,255,0.4); font-size: 11px; border-top: 1px solid rgba(255,255,255,0.08);">
            © 2026 The FifthLab Nigeria. All rights reserved. • West Africa Operations
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"The FifthLab Solutions" <${user}>`,
      to,
      subject: `💼 Demo Scheduled: ${productName} Executive Walkthrough`,
      html: htmlContent,
    });

    console.log(`[EmailService] ✅ Real Demo Confirmation delivered to ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`[EmailService] ❌ Failed to dispatch booking confirmation to ${to}:`, error);
    return false;
  }
}
