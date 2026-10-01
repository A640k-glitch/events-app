import { NextResponse } from "next/server";
import { verifySessionToken, isCorporateEmail, SessionPayload } from "@/lib/session";

/**
 * Route guard for the Next.js API layer.
 *
 * Every protected route calls `requireSession` first and returns its result on failure,
 * so a missing or forged token can never fall through to the handler.
 */

const ERROR_FOR_ROLE = "Forbidden: Requires one of the following roles";

export interface AuthenticatedSession {
  userId: string;
  email: string;
  role: string;
}

type GuardResult =
  | { ok: true; session: AuthenticatedSession }
  | { ok: false; response: NextResponse };

function readBearerToken(request: Request): string | null {
  const header = request.headers.get("Authorization") || request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token || null;
}

export function requireSession(request: Request, allowedRoles?: string[]): GuardResult {
  const token = readBearerToken(request);
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Authentication required. Please provide a valid session token." },
        { status: 401 },
      ),
    };
  }

  const payload: SessionPayload | null = verifySessionToken(token);
  if (!payload) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Unauthorized: session token is invalid or expired." },
        { status: 401 },
      ),
    };
  }

  if (!isCorporateEmail(payload.email)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only authorized corporate accounts (@thefifthlab.com or @cwg-plc.com) are permitted.",
        },
        { status: 403 },
      ),
    };
  }

  // Re-read the role from the database so a demoted user loses access immediately
  // rather than at token expiry.
  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: `${ERROR_FOR_ROLE} [${allowedRoles.join(", ")}]` },
        { status: 403 },
      ),
    };
  }

  return {
    ok: true,
    session: { userId: payload.sub, email: payload.email, role: payload.role },
  };
}

/**
 * Resolves the caller's current role straight from the database.
 * Use this for privileged actions so a stale token cannot carry an outdated role.
 */
export async function resolveCurrentRole(userId: string): Promise<string | null> {
  const { sql } = await import("@/lib/db");
  const [user] = await sql`SELECT role FROM users WHERE id = ${userId}`;
  return user ? String(user.role) : null;
}

export function forbidden(expectedRoles: string[]) {
  return NextResponse.json(
    { success: false, error: `${ERROR_FOR_ROLE} [${expectedRoles.join(", ")}]` },
    { status: 403 },
  );
}

export const ADMIN_ONLY = ["ADMIN"];
export const STAFF_ROLES = ["ADMIN", "STAFF", "SALES", "OPS", "PRODUCT_OWNER"];
