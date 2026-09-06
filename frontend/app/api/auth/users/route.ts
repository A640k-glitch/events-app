import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/auth/users
export async function GET() {
  try {
    const rows = await sql`
      SELECT 
        u.id, u.name, u.email, u.role, u."avatarUrl", u.timezone, u."workingHours",
        (SELECT COUNT(*)::int FROM leads l WHERE l."assignedProductOwnerId" = u.id) as "assignedLeadsCount",
        (SELECT COUNT(*)::int FROM attendance_records ar WHERE ar."userId" = u.id AND ar.status = 'ATTENDING') as "rsvpsCount"
      FROM users u 
      ORDER BY u.name ASC
    `;

    const data = rows.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatarUrl: u.avatarUrl,
      timezone: u.timezone,
      workingHours: u.workingHours,
      _count: {
        assignedLeads: Number(u.assignedLeadsCount) || 0,
        rsvps: Number(u.rsvpsCount) || 0,
      },
    }));

    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
