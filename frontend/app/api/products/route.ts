import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/products
export async function GET() {
  try {
    const rows = await sql`
      SELECT p.*, u.name as "ownerName"
      FROM products p
      LEFT JOIN users u ON p."ownerId" = u.id
      ORDER BY p.name ASC
    `;

    const data = rows.map((p: any) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      ownerId: p.ownerId || "",
      ownerName: p.ownerName || "Specialist Architect",
      iconName: p.iconName || "Briefcase",
      bgColor: p.bgColor || "#F4F4FF",
      activeDemosThisMonth: p.activeDemosThisMonth || 0,
      availableSlots: p.availableSlots || ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    }));

    return NextResponse.json({ success: true, count: data.length, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, name, tagline, description, iconName = "Briefcase", ownerId } = body;

    if (!slug || !name || !tagline || !description) {
      return NextResponse.json({ success: false, error: "Missing required product fields" }, { status: 400 });
    }

    const id = `prod-${slug.toLowerCase()}`;
    const [created] = await sql`
      INSERT INTO products (
        id, slug, name, tagline, description, "iconName", "bgColor", "ownerId", "activeDemosThisMonth", "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${slug.toLowerCase()}, ${name}, ${tagline}, ${description}, ${iconName}, '#F4F4FF', ${ownerId || null}, 0, NOW(), NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
