import { createHmac, timingSafeEqual } from "crypto";

/**
 * Signed session tokens for the Next.js API layer.
 *
 * Previously the app issued unsigned tokens of the form `jwt-${userId}-${Date.now()}`
 * and every route simply stripped the prefix to recover the user id. That made every
 * protected endpoint forgeable with a guessed user id, so tokens are now HMAC-signed
 * and carry an expiry.
 */

const SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET;

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SessionPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

function secret(): string {
  if (!SECRET) {
    throw new Error(
      "SESSION_SECRET (or JWT_SECRET) must be set to sign session tokens. Refusing to fall back to a hardcoded key.",
    );
  }
  return SECRET;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

/** Issues a signed, expiring session token for a verified user. */
export function createSessionToken(user: { id: string; email: string; role: string }): string {
  const issuedAt = Date.now();
  const payload: SessionPayload = {
    sub: user.id,
    email: user.email.toLowerCase(),
    role: user.role,
    iat: issuedAt,
    exp: issuedAt + TOKEN_TTL_MS,
  };
  const body = b64url(JSON.stringify(payload));
  return `fifth.${body}.${sign(body)}`;
}

/**
 * Verifies signature and expiry. Returns null for any token that was not minted by
 * this service, so unsigned legacy tokens are rejected rather than trusted.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "fifth") return null;

  const [, body, signature] = parts;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  let payload: SessionPayload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }

  if (!payload?.sub || !payload?.exp) return null;
  if (Date.now() > payload.exp) return null;

  return payload;
}

const ALLOWED_DOMAINS = ["@thefifthlab.com", "@cwg-plc.com"];

export function isCorporateEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_DOMAINS.some((domain) => normalized.endsWith(domain));
}
