import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// POST /api/events/[id]/register
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();
    const { visitorName, email, phone, company, ticketTier = "FREE_VISITOR" } = body;

    if (!visitorName || !email || !phone || !company) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: visitorName, email, phone, company" },
        { status: 400 }
      );
    }

    const regId = `reg-${Date.now()}`;
    const qrPassCode = `PASS-${eventId.slice(0, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const [registration] = await sql`
      INSERT INTO event_registrations (
        id, "eventId", "visitorName", email, phone, company, "ticketTier", "qrPassCode", "isCheckedIn", "createdAt"
      ) VALUES (
        ${regId}, ${eventId}, ${visitorName}, ${email.toLowerCase()}, ${phone}, ${company}, 
        ${ticketTier}::"TicketTier", ${qrPassCode}, false, NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: "Registration confirmed. Your cryptographic door badge is ready.",
      data: registration,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
