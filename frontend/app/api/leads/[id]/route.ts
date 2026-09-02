import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// PATCH /api/leads/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, assignedProductOwnerId } = body;

    const [existing] = await sql`SELECT * FROM leads WHERE id = ${id}`;
    if (!existing) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const normalizedStatus = status ? status.toUpperCase().replace(/\s+/g, "_") : existing.status;

    const [updated] = await sql`
      UPDATE leads SET
        status = ${normalizedStatus}::"LeadStatus",
        notes = ${notes !== undefined ? notes : existing.notes},
        "assignedProductOwnerId" = ${assignedProductOwnerId !== undefined ? assignedProductOwnerId : existing.assignedProductOwnerId},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
