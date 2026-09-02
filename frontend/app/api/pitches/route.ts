import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/pitches
export async function GET() {
  try {
    const rows = await sql`
      SELECT * FROM event_pitches 
      ORDER BY "createdAt" DESC
    `;

    return NextResponse.json({ success: true, count: rows.length, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/pitches
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organizerName,
      organization,
      email,
      phone,
      eventTitle,
      proposedDate,
      proposedCity,
      expectedAudience = 500,
      pitchDescription,
      sponsorshipRequested = "",
    } = body;

    if (!organizerName || !organization || !email || !eventTitle || !pitchDescription) {
      return NextResponse.json({ success: false, error: "Missing required pitch fields" }, { status: 400 });
    }

    const id = `pitch-${Date.now()}`;
    const parsedDate = proposedDate ? new Date(proposedDate).toISOString() : new Date().toISOString();

    const [created] = await sql`
      INSERT INTO event_pitches (
        id, "organizerName", organization, email, phone, "eventTitle", 
        "proposedDate", "proposedCity", "expectedAudience", "pitchDescription", 
        "sponsorshipRequested", status, "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${organizerName}, ${organization}, ${email.toLowerCase()}, ${phone || ""}, ${eventTitle}, 
        ${parsedDate}::timestamp, ${proposedCity || "Lagos"}, ${Number(expectedAudience)}, ${pitchDescription}, 
        ${sponsorshipRequested}, 'SUBMITTED'::"PitchStatus", NOW(), NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: "Your summit co-hosting proposal was submitted for executive committee review.",
      data: created,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
