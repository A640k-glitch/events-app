import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireSession, ADMIN_ONLY, STAFF_ROLES } from "@/lib/api-auth";

// GET /api/events/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [row] = await sql`SELECT * FROM events WHERE id = ${id}`.catch(() => []);

    if (!row) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    // The attendance manifest holds staff names, emails and RSVP status, so the full list is
    // only attached for an authenticated staff member. A signed-in visitor still needs to see
    // their own RSVP state, so return just their record plus the aggregate count.
    const session = requireSession(request, STAFF_ROLES);
    const isStaff = session.ok;

    const attendanceRows = isStaff
      ? await sql`
          SELECT ar.*, u.name as "userName", u.email as "userEmail", u.role as "userRole", u."avatarUrl"
          FROM attendance_records ar
          LEFT JOIN users u ON ar."userId" = u.id
          WHERE ar."eventId" = ${id}
          ORDER BY ar."confirmedAt" ASC
        `.catch(() => [])
      : [];

    const manifest = (attendanceRows || []).map((ar: any) => {
      const name = ar.userName || "Staff Member";
      return {
        userId: ar.userId,
        userName: name,
        userRole: ar.userRole || "Staff",
        avatarUrl: ar.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0090ad&color=fff&bold=true`,
        confirmedAt: ar.confirmedAt ? new Date(ar.confirmedAt).toISOString() : null,
        status: ar.status === "ATTENDING" ? "Attending" : ar.status === "DECLINED" ? "Declined" : "Maybe",
        user: {
          id: ar.userId,
          name: name,
          role: ar.userRole || "Staff",
          avatarUrl: ar.avatarUrl || null,
          email: ar.userEmail || null,
        },
      };
    });

    // strategicNotes is internal planning data and must not reach public visitors.
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
      strategicNotes: isStaff ? row.strategicNotes || "" : "",
      boothNumber: row.boothNumber || null,
      imageUrl: row.imageUrl || null,
      isFeatured: Boolean(row.isFeatured),
      isPublished: Boolean(row.isPublished),
      expectedAttendance: row.expectedAttendance || 0,
      isFifthLabAttending: Boolean(row.isFifthLabAttending),
      // Delegation size is public; the individual names behind it are not.
      confirmedStaffCount: isStaff
        ? manifest.filter((m: any) => m.status === "Attending").length
        : Number(
            (
              await sql`
                SELECT COUNT(*)::int as count
                FROM attendance_records
                WHERE "eventId" = ${id} AND status = 'ATTENDING'::"AttendanceStatus"
              `.catch(() => [{ count: 0 }])
            )[0]?.count || 0,
          ),
      attendanceManifest: manifest,
      // A signed-in user's own RSVP, so the detail page can show their toggle without
      // exposing anyone else's record.
      currentUserRsvp: session.ok
        ? ((await sql`
              SELECT status
              FROM attendance_records
              WHERE "eventId" = ${id} AND "userId" = ${session.session.userId}
              LIMIT 1
            `.catch(() => []))[0]?.status ?? null)
        : null,
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
    const auth = requireSession(request, ADMIN_ONLY);
    if (!auth.ok) return auth.response;

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
        date = ${parsedDate}::timestamptz,
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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireSession(request, ADMIN_ONLY);
    if (!auth.ok) return auth.response;

    const { id } = await params;
    await sql`DELETE FROM events WHERE id = ${id}`;
    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
