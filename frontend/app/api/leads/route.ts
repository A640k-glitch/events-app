import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/leads
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let rows: any[];

    if (search) {
      const term = `%${search}%`;
      rows = await sql`
        SELECT l.*, u.name as "assignedOwnerName"
        FROM leads l
        LEFT JOIN users u ON l."assignedProductOwnerId" = u.id
        WHERE l."visitorName" ILIKE ${term} OR l.company ILIKE ${term} OR l.email ILIKE ${term} OR l."productInterested" ILIKE ${term}
        ORDER BY l."createdAt" DESC
      `;
    } else if (status && status !== "All") {
      rows = await sql`
        SELECT l.*, u.name as "assignedOwnerName"
        FROM leads l
        LEFT JOIN users u ON l."assignedProductOwnerId" = u.id
        WHERE l.status = ${status.toUpperCase().replace(/\s+/g, "_")}
        ORDER BY l."createdAt" DESC
      `;
    } else {
      rows = await sql`
        SELECT l.*, u.name as "assignedOwnerName"
        FROM leads l
        LEFT JOIN users u ON l."assignedProductOwnerId" = u.id
        ORDER BY l."createdAt" DESC
      `;
    }

    const data = rows.map((l: any) => ({
      id: l.id,
      visitorName: l.visitorName,
      company: l.company,
      email: l.email,
      phone: l.phone,
      productInterested: l.productInterested,
      assignedProductOwner: l.assignedOwnerName || "Unassigned Specialist",
      bookingDate: l.bookingDate ? new Date(l.bookingDate).toISOString().split("T")[0] : "",
      bookingTime: l.bookingTime || "",
      status: l.status === "FOLLOWED_UP" ? "Followed Up" : l.status.charAt(0).toUpperCase() + l.status.slice(1).toLowerCase(),
      notes: l.notes || "",
      createdAt: l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today",
    }));

    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/leads
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      visitorName,
      company,
      email,
      phone,
      productInterested,
      bookingDate,
      bookingTime,
      notes = "",
    } = body;

    if (!visitorName || !email || !productInterested) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: visitorName, email, productInterested" },
        { status: 400 }
      );
    }

    const id = `lead-${Date.now()}`;
    const parsedDate = bookingDate ? new Date(bookingDate).toISOString() : null;

    const [created] = await sql`
      INSERT INTO leads (
        id, "visitorName", company, email, phone, "productInterested", 
        "bookingDate", "bookingTime", status, notes, "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${visitorName}, ${company || ""}, ${email.toLowerCase()}, ${phone || ""}, 
        ${productInterested}, ${parsedDate}::timestamp, ${bookingTime || ""}, 
        'UNREAD'::"LeadStatus", ${notes}, NOW(), NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
