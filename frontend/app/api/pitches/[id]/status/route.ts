import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// PATCH /api/pitches/[id]/status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, adminReviewNotes, autoPublishEvent } = body;

    const [existing] = await sql`SELECT * FROM event_pitches WHERE id = ${id}`;
    if (!existing) {
      return NextResponse.json({ success: false, error: "Proposal pitch not found" }, { status: 404 });
    }

    const normalizedStatus = status.toUpperCase();

    const [updated] = await sql`
      UPDATE event_pitches SET
        status = ${normalizedStatus}::"PitchStatus",
        "adminReviewNotes" = ${adminReviewNotes !== undefined ? adminReviewNotes : existing.adminReviewNotes},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    // Auto publish event if requested on approval
    if (normalizedStatus === "APPROVED" && autoPublishEvent) {
      const newEventId = `evt-${Date.now()}`;
      await sql`
        INSERT INTO events (
          id, title, category, priority, date, time, location, city, country,
          description, "strategicNotes", "isFeatured", "isPublished", "expectedAttendance",
          "isFifthLabAttending", "createdAt", "updatedAt"
        ) VALUES (
          ${newEventId}, ${existing.eventTitle}, 'SUMMIT'::"EventCategory", 'HIGH'::"EventPriority",
          ${existing.proposedDate}, '09:00 AM - 05:00 PM WAT', 'Convention Centre', ${existing.proposedCity}, 'Nigeria',
          ${existing.pitchDescription}, ${`Co-hosted with ${existing.organization}`}, true, true, ${existing.expectedAudience},
          true, NOW(), NOW()
        )
      `;
    }

    return NextResponse.json({ success: true, message: `Pitch updated to ${normalizedStatus}`, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
