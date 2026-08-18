import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { UserRole } from "@prisma/client";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "fifthlab-super-secret-production-jwt-key-2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface AuthUserPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Signs a cryptographically secure JWT token for a verified @thefifthlab.com user
 */
export function signAuthToken(user: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}): string {
  const payload: AuthUserPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
    issuer: "fifthlab-events-api",
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Verifies and decodes a signed JWT token
 */
export function verifyAuthToken(token: string): AuthUserPayload {
  const decoded = jwt.verify(token, JWT_SECRET, {
    issuer: "fifthlab-events-api",
  });

  return decoded as AuthUserPayload;
}
