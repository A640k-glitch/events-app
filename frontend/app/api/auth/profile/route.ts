import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

function extractUserId(token: string): string | null {
  if (!token) return null;
  const match = token.match(/^jwt-(.+)-(\d+)$/);
  if (match) return match[1];
  return token.replace(/^jwt-/, "");
}

// GET /api/auth/profile
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const userId = extractUserId(token);

    if (!userId) {
      return NextResponse.json({ success: false, error: "Invalid session token" }, { status: 401 });
    }

    const [user] = await sql`
      SELECT id, name, email, role, "avatarUrl", timezone, "workingHours" 
      FROM users 
      WHERE id = ${userId} OR email = ${userId}
    `;

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/auth/profile
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthenticated" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const userId = extractUserId(token);

    if (!userId) {
      return NextResponse.json({ success: false, error: "Invalid session token" }, { status: 401 });
    }

    const body = await request.json();
    const { name, timezone, workingHours, avatarUrl, role } = body;

    const validRoles = ["ADMIN", "STAFF", "SALES", "OPS", "PRODUCT_OWNER", "VISITOR"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ success: false, error: "Invalid role specified" }, { status: 400 });
    }

    const [updatedUser] = await sql`
      UPDATE users
      SET 
        name = COALESCE(${name !== undefined && name !== null ? name.trim() : null}, name),
        timezone = COALESCE(${timezone !== undefined && timezone !== null ? timezone : null}, timezone),
        "workingHours" = COALESCE(${workingHours !== undefined && workingHours !== null ? workingHours : null}, "workingHours"),
        role = COALESCE(${role !== undefined && role !== null ? role : null}::"UserRole", role),
        "avatarUrl" = COALESCE(${avatarUrl !== undefined && avatarUrl !== null ? avatarUrl : null}, "avatarUrl"),
        "updatedAt" = NOW()
      WHERE id = ${userId} OR email = ${userId}
      RETURNING id, name, email, role, "avatarUrl", timezone, "workingHours"
    `;

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully", data: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
