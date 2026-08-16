import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

export interface BookingConfirmationEmailProps {
  to: string;
  visitorName: string;
  productName: string;
  bookingDate: string;
  timeSlot: string;
  ownerName: string;
}

export async function sendBookingConfirmationEmail(props: BookingConfirmationEmailProps) {
  const { to, visitorName, productName, bookingDate, timeSlot, ownerName } = props;

  // If SMTP not configured in dev, log gracefully
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[EmailService Mock] Booking Confirmation Email sent to ${to}:`, {
      visitorName,
      productName,
      bookingDate,
      timeSlot,
      ownerName,
    });
    return true;
  }

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #00B4D8; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">FifthLab Events & Solutions</h1>
      </div>
      <div style="padding: 32px 24px;">
        <h2 style="color: #0E0E0E; margin-top: 0;">Demo Booking Confirmed</h2>
        <p style="color: #5F5F7A; font-size: 16px; line-height: 1.5;">
          Hello <strong>${visitorName}</strong>,
        </p>
        <p style="color: #5F5F7A; font-size: 16px; line-height: 1.5;">
          Thank you for requesting an executive walkthrough of <strong>${productName}</strong>. Your session has been scheduled with our product specialist.
        </p>
        <div style="background-color: #E6F8FB; border-radius: 8px; padding: 16px; margin: 24px 0;">
          <p style="margin: 4px 0; color: #0090AD; font-size: 14px;"><strong>Product:</strong> ${productName}</p>
          <p style="margin: 4px 0; color: #0090AD; font-size: 14px;"><strong>Date:</strong> ${bookingDate}</p>
          <p style="margin: 4px 0; color: #0090AD; font-size: 14px;"><strong>Time:</strong> ${timeSlot}</p>
          <p style="margin: 4px 0; color: #0090AD; font-size: 14px;"><strong>Specialist:</strong> ${ownerName}</p>
        </div>
        <p style="color: #828282; font-size: 14px;">
          If you need to reschedule or add colleagues to the calendar invite, reply directly to this email.
        </p>
      </div>
      <div style="background-color: #000000; padding: 20px; text-align: center; color: #A19EC2; font-size: 12px;">
        © 2026 The FifthLab. All rights reserved.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"FifthLab Events" <notifications@thefifthlab.com>',
    to,
    subject: `Demo Confirmation: ${productName} Walkthrough`,
    html: htmlContent,
  });

  return true;
}
