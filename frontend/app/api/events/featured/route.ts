import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    let rows = await sql`
      SELECT * FROM events 
      WHERE "isPublished" = true AND "isFeatured" = true
      ORDER BY date ASC 
      LIMIT 6
    `;

    if (rows.length === 0) {
      rows = await sql`
        SELECT * FROM events 
        WHERE "isPublished" = true
        ORDER BY date ASC 
        LIMIT 6
      `;
    }

    const data = rows.map((row: any) => ({
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
    }));

    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
