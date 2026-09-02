import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/events/[id]/registrations
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
