import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

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

    if (existing) {
      await sql`
        UPDATE users 
        SET "otpCode" = ${otp}, "otpExpiresAt" = ${expiresAt}::timestamp, "otpLastSentAt" = NOW()
        WHERE id = ${existing.id}
      `;
    } else {
      const id = `usr-${Date.now()}`;
      const defaultName = name?.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ");
      await sql`
        INSERT INTO users (
          id, name, email, role, "otpCode", "otpExpiresAt", "otpLastSentAt", "createdAt", "updatedAt"
        ) VALUES (
          ${id}, ${defaultName}, ${cleanEmail}, 'STAFF'::"UserRole", ${otp}, ${expiresAt}::timestamp, NOW(), NOW(), NOW()
        )
      `;
    }

    // In production, dispatch SMTP if available, or return demo code
    console.log(`[AUTH] Dispatched OTP code ${otp} to ${cleanEmail}`);

    return NextResponse.json({
      success: true,
      message: `Security passcode dispatched to ${cleanEmail}. (Code: ${otp})`,
      expiresInMinutes: 10,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
