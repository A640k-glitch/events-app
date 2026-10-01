import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireSession, STAFF_ROLES } from "@/lib/api-auth";

// GET /api/events/[id]/registrations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // The registration list holds attendee names and emails: staff-only.
    const auth = requireSession(request, STAFF_ROLES);
    if (!auth.ok) return auth.response;

    const { id: eventId } = await params;
    const rows = await sql`
      SELECT * FROM event_registrations 
      WHERE "eventId" = ${eventId}
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({ success: true, count: rows.length, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
