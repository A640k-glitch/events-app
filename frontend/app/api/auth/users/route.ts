import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/auth/users
export async function GET() {
  try {
    const rows = await sql`
      SELECT id, name, email, role, "avatarUrl", timezone, "workingHours" 
      FROM users 
      ORDER BY name ASC
    `;

    return NextResponse.json({ success: true, count: rows.length, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
