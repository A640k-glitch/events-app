import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const result = await sql`SELECT NOW() as now`;
    return NextResponse.json({
      status: "healthy",
      service: "FifthLab Events Platform API (Next.js Serverless)",
      database: "Neon PostgreSQL",
      dbTimestamp: result[0]?.now,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "unhealthy", error: error.message },
      { status: 500 }
    );
  }
}
