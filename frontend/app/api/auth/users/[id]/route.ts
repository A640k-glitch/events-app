import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/auth/users/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [user] = await sql`
      SELECT id, name, email, role, "avatarUrl", timezone, "workingHours", "createdAt"
      FROM users
      WHERE id = ${id}
    `;

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/auth/users/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [deleted] = await sql`
      DELETE FROM users
      WHERE id = ${id}
      RETURNING id, name, email
    `;

    if (!deleted) {
      return NextResponse.json({ success: false, error: "User not found or already removed" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `User ${deleted.email} deleted successfully.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
