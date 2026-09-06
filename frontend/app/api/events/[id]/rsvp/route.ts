import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/events/[id]/rsvp - Staff / Admin RSVP or Assign to event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { userId, status = "ATTENDING" } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    const rawStatus = typeof status === "string" ? status.toUpperCase() : "ATTENDING";
    const dbStatus = ["ATTENDING", "DECLINED", "MAYBE"].includes(rawStatus) ? rawStatus : "ATTENDING";
    const recordId = `att-${eventId}-${userId}`;

    const [record] = await sql`
      INSERT INTO attendance_records (
        id, "userId", "eventId", status, "isCheckedIn", "confirmedAt"
      ) VALUES (
        ${recordId}, ${userId}, ${eventId}, ${dbStatus}::"AttendanceStatus", false, NOW()
      )
      ON CONFLICT ("userId", "eventId")
      DO UPDATE SET status = ${dbStatus}::"AttendanceStatus", "confirmedAt" = NOW()
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/events/[id]/rsvp - Remove staff from attendance manifest
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    await sql`
      DELETE FROM attendance_records 
      WHERE "eventId" = ${eventId} AND "userId" = ${userId}
    `;

    return NextResponse.json({ success: true, message: "Staff removed from event" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
