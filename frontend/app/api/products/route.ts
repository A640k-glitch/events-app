import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/products
export async function GET() {
  try {
    const [rows, leadsRows] = await Promise.all([
      sql`
        SELECT p.*, u.name as "ownerName"
        FROM products p
        LEFT JOIN users u ON p."ownerId" = u.id
        ORDER BY p.name ASC
      `,
      sql`
        SELECT l.*, u.name as "assignedOwnerName"
        FROM leads l
        LEFT JOIN users u ON l."assignedProductOwnerId" = u.id
        ORDER BY l."createdAt" DESC
      `,
    ]);

    const data = rows.map((p: any) => {
      const pSlug = (p.slug || "").toLowerCase();
      const pName = (p.name || "").toLowerCase();

      // Flexible product matching for leads
      const matchingLeads = leadsRows.filter((l: any) => {
        const interest = (l.productInterested || "").toLowerCase();
        return (
          interest.includes(pSlug) ||
          pSlug.includes(interest) ||
          interest.includes(pName) ||
          pName.includes(interest)
        );
      });

      const leadsCount = matchingLeads.length;
      const convertedCount = matchingLeads.filter(
        (l: any) => l.status === "CONVERTED" || l.status === "QUALIFIED"
      ).length;
      const conversionRate = leadsCount > 0 ? Math.round((convertedCount / leadsCount) * 100) : 0;

      // Real active demos count from database
      const activeDemos = matchingLeads.filter((l: any) => l.bookingDate || l.bookingTime).length;

      const recentLeads = matchingLeads.map((l: any) => ({
        id: l.id,
        visitorName: l.visitorName,
        company: l.company || "Independent",
        email: l.email,
        phone: l.phone || "",
        productInterested: l.productInterested,
        assignedProductOwner: l.assignedOwnerName || "Unassigned",
        assignedProductOwnerId: l.assignedProductOwnerId || null,
        bookingDate: l.bookingDate ? new Date(l.bookingDate).toISOString().split("T")[0] : "",
        bookingTime: l.bookingTime || "",
        status: l.status === "FOLLOWED_UP" ? "Followed Up" : l.status.charAt(0).toUpperCase() + l.status.slice(1).toLowerCase(),
        notes: l.notes || "",
        createdAt: l.createdAt ? new Date(l.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today",
      }));

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        ownerId: p.ownerId || "",
        ownerName: p.ownerName || "Unassigned",
        iconName: p.iconName || "Briefcase",
        bgColor: p.bgColor || "#F4F4FF",
        activeDemosThisMonth: activeDemos || (p.activeDemosThisMonth || 0),
        availableSlots: p.availableSlots || ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
        leadsCount,
        conversionRate,
        recentLeads,
      };
    });

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
