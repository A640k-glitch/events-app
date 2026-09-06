import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// PATCH /api/auth/users/:id/role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    const validRoles = ["ADMIN", "STAFF", "SALES", "OPS", "PRODUCT_OWNER", "VISITOR"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role specified." }, { status: 400 });
    }

    const [updatedUser] = await sql`
      UPDATE users 
      SET role = ${role}::"UserRole", "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING id, name, email, role, "avatarUrl", timezone, "workingHours"
    `;

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User role successfully changed to ${role}`,
      data: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
