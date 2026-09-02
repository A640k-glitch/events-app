import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/events/[id]/verify-pass
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { qrPassCode } = body;

    if (!qrPassCode) {
      return NextResponse.json({ success: false, error: "Missing qrPassCode parameter" }, { status: 400 });
    }

    const [registration] = await sql`
      SELECT * FROM event_registrations 
      WHERE "eventId" = ${eventId} AND "qrPassCode" = ${qrPassCode.trim()}
    `;

    if (!registration) {
      return NextResponse.json({
        success: false,
        message: "Invalid or unrecognized door pass code for this summit.",
      }, { status: 404 });
    }

    if (registration.isCheckedIn) {
      return NextResponse.json({
        success: true,
        alreadyCheckedIn: true,
        message: `Pass already scanned at ${registration.checkedInAt ? new Date(registration.checkedInAt).toLocaleTimeString() : "earlier"} for ${registration.visitorName}.`,
        data: registration,
      });
    }

    const [updated] = await sql`
      UPDATE event_registrations 
      SET "isCheckedIn" = true, "checkedInAt" = NOW()
      WHERE id = ${registration.id}
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      alreadyCheckedIn: false,
      message: `Verified! Welcome ${updated.visitorName} (${updated.company || "Delegate"}). Pass authorized.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
