import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

// GET /api/consent?visitorId=...
export async function GET(request: NextRequest) {
  try {
    const visitorId = request.nextUrl.searchParams.get("visitorId");
    if (!visitorId) {
      return NextResponse.json({ success: true, accepted: false });
    }

    const [record] = await sql`
      SELECT id, "visitorId", status, "acceptedAt"
      FROM privacy_consents
      WHERE "visitorId" = ${visitorId} AND status = 'ACCEPTED'
      LIMIT 1
    `;

    return NextResponse.json({
      success: true,
      accepted: Boolean(record),
      data: record || null,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/consent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { visitorId, status = "ACCEPTED" } = body;

    if (!visitorId) {
      return NextResponse.json(
        { success: false, error: "visitorId is required" },
        { status: 400 }
      );
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;
    const id = `consent-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const [consent] = await sql`
      INSERT INTO privacy_consents (id, "visitorId", "ipAddress", "userAgent", status, "acceptedAt", "createdAt")
      VALUES (${id}, ${visitorId}, ${ipAddress}, ${userAgent}, ${status}, NOW(), NOW())
      RETURNING *
    `;

    const response = NextResponse.json({
      success: true,
      message: "Storage & privacy consent saved to database.",
      data: consent,
    });

    response.cookies.set("fifthlab_consent", "accepted", {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
