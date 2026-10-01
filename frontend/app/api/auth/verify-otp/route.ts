import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { createSessionToken, isCorporateEmail } from "@/lib/session";

// POST /api/auth/verify-otp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Corporate email and OTP are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const [user] = await sql`SELECT * FROM users WHERE email = ${cleanEmail}`;

    if (!user) {
      return NextResponse.json({ success: false, error: "User record not found" }, { status: 404 });
    }

    // Only a real, unexpired OTP issued to this address is accepted. A universal
    // fallback code must never exist here — it would let anyone log in as any user.
    if (!isCorporateEmail(String(user.email))) {
      return NextResponse.json(
        { success: false, error: "Only authorized corporate accounts may sign in." },
        { status: 403 },
      );
    }

    const code = otp.trim();
    const isValid =
      Boolean(user.otpCode) && user.otpCode === code && Boolean(user.otpExpiresAt) && new Date(user.otpExpiresAt).getTime() > Date.now();

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid or expired security code" }, { status: 401 });
    }

    const isFirstTime = !user.lastLoginAt;

    // Clear OTP & mark verified
    await sql`
      UPDATE users 
      SET "isVerified" = true, "otpCode" = NULL, "lastLoginAt" = NOW()
      WHERE id = ${user.id}
    `;

    const token = createSessionToken({ id: user.id, email: String(user.email), role: String(user.role) });

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      data: {
        token,
        isFirstTime,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
          timezone: user.timezone,
          workingHours: user.workingHours,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
