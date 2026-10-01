import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireSession, resolveCurrentRole, STAFF_ROLES } from "@/lib/api-auth";

// GET /api/auth/users/:id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireSession(request, STAFF_ROLES);
    if (!auth.ok) return auth.response;

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
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = requireSession(request);
    if (!auth.ok) return auth.response;

    // Re-read the caller's role from the database so a demoted token loses admin rights.
    const callerRole = await resolveCurrentRole(auth.session.userId);
    if (callerRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only administrators may remove staff members." },
        { status: 403 },
      );
    }

    const { id } = await params;

    if (id === auth.session.userId) {
      return NextResponse.json(
        { success: false, error: "You cannot remove your own account." },
        { status: 400 },
      );
    }

    // Removing the last administrator would lock everyone out of staff management.
    const [target] = await sql`SELECT role FROM users WHERE id = ${id}`;
    if (target && String(target.role) === "ADMIN") {
      const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM users WHERE role = 'ADMIN'::"UserRole"`;
      if (Number(count) <= 1) {
        return NextResponse.json(
          { success: false, error: "Cannot remove the last remaining administrator." },
          { status: 400 },
        );
      }
    }

    // 1. Return any assigned leads back to the General Pool (unassigned)
    await sql`
      UPDATE leads
      SET "assignedProductOwnerId" = NULL
      WHERE "assignedProductOwnerId" = ${id}
    `;

    // 2. Unassign any owned corporate products
    await sql`
      UPDATE products
      SET "ownerId" = NULL
      WHERE "ownerId" = ${id}
    `;

    // 3. Remove attendance records
    await sql`
      DELETE FROM attendance_records
      WHERE "userId" = ${id}
    `;

    // 4. Delete the corporate user record
    const [deleted] = await sql`
      DELETE FROM users
      WHERE id = ${id}
      RETURNING id, name, email
    `;

    if (!deleted) {
      return NextResponse.json({ success: false, error: "User not found or already removed" }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Staff member ${deleted.name || deleted.email} removed and all assigned tasks returned to General Pool.` 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
