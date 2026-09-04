import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { generateBadgeQRCode } from "@/lib/qr";
import { sendEventTicketEmail } from "@/lib/email";

// POST /api/events/[id]/register - Public Event Registration with QR Door Badge & Email Delivery
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

    if (!eventId || eventId === "undefined" || eventId.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Valid event ID is required for registration." },
        { status: 400 }
      );
    }

    // 1. Verify that event exists
    const [event] = await sql`
      SELECT id, title, date, time, location, city 
      FROM events 
      WHERE id = ${eventId}
    `;

    if (!event) {
      return NextResponse.json(
        { success: false, error: "The requested event could not be found." },
        { status: 404 }
      );
    }

    const regId = `reg-${Date.now()}`;
    const qrPassCode = `PASS-${eventId.slice(0, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 2. Insert event registration record
    const [registration] = await sql`
      INSERT INTO event_registrations (
        id, "eventId", "visitorName", email, phone, company, "ticketTier", "qrPassCode", "isCheckedIn", "createdAt"
      ) VALUES (
        ${regId}, ${eventId}, ${visitorName.trim()}, ${email.trim().toLowerCase()}, ${phone.trim()}, ${company.trim()}, 
        ${ticketTier}::"TicketTier", ${qrPassCode}, false, NOW()
      )
      RETURNING *
    `;

    // 3. Generate high-resolution cryptographic QR Badge Data URL
    const qrBadgeDataUrl = await generateBadgeQRCode({
      eventId: event.id,
      eventTitle: event.title,
      userId: registration.id,
      userName: visitorName.trim(),
      userRole: `Public Attendee (${ticketTier.replace(/_/g, " ")})`,
      qrPassCode,
    });

    const formattedEventDate = event.date && !isNaN(new Date(event.date).getTime())
      ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : String(event.date || "");

    // 4. Send official digital ticket email asynchronously
    sendEventTicketEmail({
      to: email.trim().toLowerCase(),
      visitorName: visitorName.trim(),
      company: company.trim(),
      eventTitle: event.title,
      eventDate: formattedEventDate,
      eventTime: event.time,
      eventLocation: `${event.location}, ${event.city}`,
      ticketTier,
      qrPassCode,
      qrBadgeDataUrl,
    }).catch((err) => console.error("[RegistrationRoute] Ticket email delivery error:", err));

    // 5. Return complete ticket payload matching TicketPassModal expectations
    return NextResponse.json({
      success: true,
      message: "Registration confirmed. Your cryptographic door badge is ready.",
      data: {
        registrationId: registration.id,
        visitorName: registration.visitorName,
        email: registration.email,
        phone: registration.phone,
        company: registration.company,
        ticketTier: registration.ticketTier,
        qrPassCode: registration.qrPassCode,
        qrBadgeDataUrl,
        event: {
          id: event.id,
          title: event.title,
          date: formattedEventDate,
          time: event.time,
          location: event.location,
          city: event.city,
        },
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error("[RegistrationRoute] Error during event registration:", error);
    return NextResponse.json({ success: false, error: error.message || "Event registration failed" }, { status: 500 });
  }
}
