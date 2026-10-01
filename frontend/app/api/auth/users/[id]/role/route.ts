import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireSession, resolveCurrentRole } from "@/lib/api-auth";

// PATCH /api/auth/users/:id/role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireSession(request);
    if (!auth.ok) return auth.response;

    // Re-read the caller's role from the database: a token minted before a demotion
    // must not retain admin rights.
    const callerRole = await resolveCurrentRole(auth.session.userId);
    if (callerRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only administrators may change user roles." },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    const validRoles = ["ADMIN", "STAFF", "SALES", "OPS", "PRODUCT_OWNER", "VISITOR"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role specified." }, { status: 400 });
    }

    // Guard against an admin removing the last admin and locking everyone out.
    if (role !== "ADMIN" && id === auth.session.userId) {
      return NextResponse.json(
        { success: false, error: "You cannot remove your own administrator role." },
        { status: 400 },
      );
    }

    if (role !== "ADMIN") {
      const [target] = await sql`SELECT role FROM users WHERE id = ${id}`;
      if (target && String(target.role) === "ADMIN") {
        const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM users WHERE role = 'ADMIN'::"UserRole"`;
        if (Number(count) <= 1) {
          return NextResponse.json(
            { success: false, error: "Cannot demote the last remaining administrator." },
            { status: 400 },
          );
        }
      }
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
