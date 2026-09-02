import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/auth/me
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const parts = token.split("-");
    const userId = parts[1];

    if (!userId) {
      return NextResponse.json({ success: false, error: "Invalid session token" }, { status: 401 });
    }

    const [user] = await sql`SELECT id, name, email, role, "avatarUrl", timezone, "workingHours" FROM users WHERE id = ${userId}`;

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
