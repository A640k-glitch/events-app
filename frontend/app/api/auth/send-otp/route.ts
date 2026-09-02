import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { sendOtpVerificationEmail } from "@/lib/email";

// POST /api/auth/send-otp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Corporate email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const [existing] = await sql`SELECT * FROM users WHERE email = ${cleanEmail}`;

    const defaultName = name?.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ");

    if (existing) {
      await sql`
        UPDATE users 
        SET "otpCode" = ${otp}, "otpExpiresAt" = ${expiresAt}::timestamp, "otpLastSentAt" = NOW()
        WHERE id = ${existing.id}
      `;
    } else {
      const id = `usr-${Date.now()}`;
      await sql`
        INSERT INTO users (
          id, name, email, role, "otpCode", "otpExpiresAt", "otpLastSentAt", "createdAt", "updatedAt"
        ) VALUES (
          ${id}, ${defaultName}, ${cleanEmail}, 'STAFF'::"UserRole", ${otp}, ${expiresAt}::timestamp, NOW(), NOW(), NOW()
        )
      `;
    }

    const recipientName = existing?.name || defaultName;

    // Dispatch real email via Nodemailer (Gmail / SMTP)
    const emailResult = await sendOtpVerificationEmail({
      to: cleanEmail,
      recipientName,
      otpCode: otp,
      expiresInMinutes: 10,
    });

    if (emailResult.simulated) {
      console.warn(`[AUTH] ⚠️ Running in simulation mode (no SMTP configured). Generated OTP for ${cleanEmail}: ${otp}`);
    }

    return NextResponse.json({
      success: true,
      message: `Security passcode dispatched to ${cleanEmail}.`,
      expiresInMinutes: 10,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
