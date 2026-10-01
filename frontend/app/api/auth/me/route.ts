import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireSession, resolveCurrentRole } from "@/lib/api-auth";

// GET /api/auth/me
export async function GET(request: NextRequest) {
  try {
    const auth = requireSession(request);
    if (!auth.ok) return auth.response;

    const { userId } = auth.session;

    const [user] = await sql`
      SELECT id, name, email, role, "avatarUrl", timezone, "workingHours"
      FROM users
      WHERE id = ${userId}
    `;

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/auth/me
export async function PATCH(request: NextRequest) {
  try {
    const auth = requireSession(request);
    if (!auth.ok) return auth.response;

    const { userId } = auth.session;

    // Read the live role rather than trusting the token, so a demotion takes effect now.
    const currentRole = await resolveCurrentRole(userId);
    if (!currentRole) {
      return NextResponse.json({ success: false, error: "User record not found." }, { status: 404 });
    }

    const body = await request.json();
    const { name, timezone, workingHours, avatarUrl, role } = body;

    // Self-service profile edits can never change a role. Promotion is an ADMIN-only
    // action performed through /api/auth/users/:id/role.
    if (role !== undefined && role !== null && String(role) !== currentRole) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Roles can only be changed by an administrator." },
        { status: 403 },
      );
    }

    const [updatedUser] = await sql`
      UPDATE users
      SET
        name = COALESCE(${name !== undefined && name !== null ? name.trim() : null}, name),
        timezone = COALESCE(${timezone !== undefined && timezone !== null ? timezone : null}, timezone),
        "workingHours" = COALESCE(${workingHours !== undefined && workingHours !== null ? workingHours : null}, "workingHours"),
        "avatarUrl" = COALESCE(${avatarUrl !== undefined && avatarUrl !== null ? avatarUrl : null}, "avatarUrl"),
        "updatedAt" = NOW()
      WHERE id = ${userId}
      RETURNING id, name, email, role, "avatarUrl", timezone, "workingHours"
    `;

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile and roles updated", data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

