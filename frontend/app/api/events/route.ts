import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireSession, ADMIN_ONLY, STAFF_ROLES } from "@/lib/api-auth";

// Helper to format event objects from raw DB rows with attendance records
function formatEvent(row: any, attendanceRows: any[] = []) {
  const manifest = attendanceRows
    .filter((ar: any) => ar.eventId === row.id)
    .map((ar: any) => {
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

  return {
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
    confirmedStaffCount: manifest.filter((m: any) => m.status === "Attending").length,
    attendanceManifest: manifest,
  };
}

// GET /api/events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");
    const publishedOnlyParam = searchParams.get("publishedOnly");
    // Default: published events only, for everyone. Staff additionally get unpublished
    // events and the full attendance manifest.
    const session = requireSession(request, STAFF_ROLES);
    const isStaff = session.ok;

    if (publishedOnlyParam === "false" && !isStaff) {
      return NextResponse.json(
        { success: false, error: "Authentication required to view unpublished events." },
        { status: 401 },
      );
    }

    // A signed-in staff member's default view includes unpublished events so the dashboard
    // keeps working without an explicit opt-in. `publishedOnly=true` forces published-only.
    const includeUnpublished = isStaff && publishedOnlyParam !== "true";

    let rows: any[];

    // Only query the manifest when it will actually be returned: an unawaited Neon
    // query promise would otherwise surface as an unhandled rejection.
    const attendancePromise = isStaff
      ? sql`
        SELECT ar.*, u.name as "userName", u.email as "userEmail", u.role as "userRole", u."avatarUrl"
        FROM attendance_records ar
        LEFT JOIN users u ON ar."userId" = u.id
        ORDER BY ar."confirmedAt" ASC
      `
      : null;

    if (search) {
      const term = `%${search}%`;
      rows = await sql`
        SELECT * FROM events
        WHERE (${includeUnpublished} = false OR "isPublished" = true)
        AND (title ILIKE ${term} OR description ILIKE ${term} OR location ILIKE ${term} OR city ILIKE ${term})
        ORDER BY date ASC
      `;
    } else if (category && category !== "All") {
      rows = await sql`
        SELECT * FROM events
        WHERE (${includeUnpublished} = false OR "isPublished" = true)
        AND category = ${category.toUpperCase().replace(/\s+/g, "_")}
        ORDER BY date ASC
      `;
    } else if (priority && priority !== "All") {
      rows = await sql`
        SELECT * FROM events
        WHERE (${includeUnpublished} = false OR "isPublished" = true)
        AND priority = ${priority.toUpperCase()}
        ORDER BY date ASC
      `;
    } else {
      rows = await sql`
        SELECT * FROM events
        WHERE (${includeUnpublished} = false OR "isPublished" = true)
        ORDER BY date ASC
      `;
    }

    // The public catalogue must not expose the internal attendance manifest, which carries
    // staff names, emails and RSVP status. Publish an aggregate count instead so the
    // public event cards can still show delegation size.
    if (!isStaff) {
      const [{ count }] = await sql`
        SELECT COUNT(*)::int as count
        FROM attendance_records
        WHERE status = 'ATTENDING'::"AttendanceStatus"
      `.catch(() => [{ count: 0 }]);
      const data = rows.map((r) => ({
        ...formatEvent(r, []),
        attendanceManifest: [],
        confirmedStaffCount: Number(count) || 0,
      }));
      return NextResponse.json({ success: true, count: data.length, data });
    }

    const attendanceRows = attendancePromise ? await attendancePromise.catch(() => []) : [];
    const data = rows.map((r) => formatEvent(r, attendanceRows));
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request: NextRequest) {
  try {
    const auth = requireSession(request, ADMIN_ONLY);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const {
      title,
      category = "SUMMIT",
      priority = "HIGH",
      date,
      time,
      location,
      city = "Lagos",
      country = "Nigeria",
      description,
      strategicNotes = "",
      boothNumber = null,
      imageUrl = null,
      isFeatured = true,
      isPublished = true,
      expectedAttendance = 1000,
      isFifthLabAttending = true,
    } = body;

    if (!title || !date || !time || !location || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, date, time, location, description" },
        { status: 400 }
      );
    }

    const id = `evt-${Date.now()}`;
    const normalizedCategory = category.toUpperCase().replace(/\s+/g, "_");
    const normalizedPriority = priority.toUpperCase();
    const parsedDate = new Date(date).toISOString();

    const [created] = await sql`
      INSERT INTO events (
        id, title, category, priority, date, time, location, city, country, 
        description, "strategicNotes", "boothNumber", "imageUrl", 
        "isFeatured", "isPublished", "expectedAttendance", "isFifthLabAttending", 
        "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${title}, ${normalizedCategory}::"EventCategory", ${normalizedPriority}::"EventPriority", 
        ${parsedDate}::timestamp, ${time}, ${location}, ${city}, ${country}, 
        ${description}, ${strategicNotes}, ${boothNumber}, ${imageUrl}, 
        ${Boolean(isFeatured)}, ${Boolean(isPublished)}, ${Number(expectedAttendance)}, ${Boolean(isFifthLabAttending)}, 
        NOW(), NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: formatEvent(created) }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
