import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/events/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [row] = await sql`
      SELECT * FROM events WHERE id = ${id}
    `;

    if (!row) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    const event = {
      id: row.id,
      title: row.title,
      category: row.category,
      priority: row.priority,
      date: row.date ? new Date(row.date).toISOString() : null,
      time: row.time,
      location: row.location,
      city: row.city,
      country: row.country,
      description: row.description,
      strategicNotes: row.strategicNotes || "",
      boothNumber: row.boothNumber || null,
      imageUrl: row.imageUrl || null,
      isFeatured: Boolean(row.isFeatured),
      isPublished: Boolean(row.isPublished),
      expectedAttendance: row.expectedAttendance || 0,
      isFifthLabAttending: Boolean(row.isFifthLabAttending),
      attendanceManifest: [],
    };

    return NextResponse.json({ success: true, data: event });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/events/[id] - Update all event fields
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      category,
      priority,
      date,
      time,
      location,
      city,
      country,
      description,
      strategicNotes,
      boothNumber,
      imageUrl,
      isFeatured,
      isPublished,
      expectedAttendance,
      isFifthLabAttending,
    } = body;

    const [existing] = await sql`SELECT * FROM events WHERE id = ${id}`;
    if (!existing) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    const normalizedCategory = (category || existing.category).toUpperCase().replace(/\s+/g, "_");
    const normalizedPriority = (priority || existing.priority).toUpperCase();
    const parsedDate = date ? new Date(date).toISOString() : existing.date;

    const [updated] = await sql`
      UPDATE events SET
        title = ${title !== undefined ? title : existing.title},
        category = ${normalizedCategory}::"EventCategory",
        priority = ${normalizedPriority}::"EventPriority",
        date = ${parsedDate}::timestamp,
        time = ${time !== undefined ? time : existing.time},
        location = ${location !== undefined ? location : existing.location},
        city = ${city !== undefined ? city : existing.city},
        country = ${country !== undefined ? country : existing.country},
        description = ${description !== undefined ? description : existing.description},
        "strategicNotes" = ${strategicNotes !== undefined ? strategicNotes : existing.strategicNotes},
        "boothNumber" = ${boothNumber !== undefined ? boothNumber : existing.boothNumber},
        "imageUrl" = ${imageUrl !== undefined ? imageUrl : existing.imageUrl},
        "isFeatured" = ${isFeatured !== undefined ? Boolean(isFeatured) : existing.isFeatured},
        "isPublished" = ${isPublished !== undefined ? Boolean(isPublished) : existing.isPublished},
        "expectedAttendance" = ${expectedAttendance !== undefined ? Number(expectedAttendance) : existing.expectedAttendance},
        "isFifthLabAttending" = ${isFifthLabAttending !== undefined ? Boolean(isFifthLabAttending) : existing.isFifthLabAttending},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/events/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM events WHERE id = ${id}`;
    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
