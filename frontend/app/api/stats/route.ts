import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/stats
export async function GET() {
  try {
    const [eventsCount] = await sql`SELECT COUNT(*)::int as count FROM events WHERE "isPublished" = true`;
    const [leadsCount] = await sql`SELECT COUNT(*)::int as count FROM leads`;
    const [unreadLeads] = await sql`SELECT COUNT(*)::int as count FROM leads WHERE status = 'UNREAD'`;
    const [staffCount] = await sql`SELECT COUNT(*)::int as count FROM users WHERE role IN ('STAFF', 'ADMIN', 'PRODUCT_OWNER', 'OPS', 'SALES')`;
    const [pitchesCount] = await sql`SELECT COUNT(*)::int as count FROM event_pitches WHERE status = 'SUBMITTED'`;
    const [regsCount] = await sql`SELECT COUNT(*)::int as count FROM event_registrations`;
    const [attendanceSum] = await sql`SELECT COALESCE(SUM("expectedAttendance"), 0)::int as sum FROM events WHERE "isPublished" = true`;

    return NextResponse.json({
      success: true,
      data: {
        upcomingEventsCount: eventsCount?.count || 0,
        demoRequestsCount: leadsCount?.count || 0,
        unreadLeadsCount: unreadLeads?.count || 0,
        activeStaffCount: staffCount?.count || 0,
        pendingPitchesCount: pitchesCount?.count || 0,
        publicRegistrationsCount: regsCount?.count || 0,
        totalExpectedAttendance: attendanceSum?.sum || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
