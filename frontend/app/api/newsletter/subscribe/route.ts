import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/newsletter/subscribe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source = "HOMEPAGE" } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const id = `sub-${Date.now()}`;

    const [sub] = await sql`
      INSERT INTO newsletter_subscriptions (id, email, source, "createdAt")
      VALUES (${id}, ${cleanEmail}, ${source}, NOW())
      ON CONFLICT (email) DO UPDATE SET "createdAt" = NOW()
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully to FifthEvents updates.",
      data: sub,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
