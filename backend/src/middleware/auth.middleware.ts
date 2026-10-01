import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { verifyAuthToken, AuthUserPayload } from "../services/jwt.service.js";

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

/**
 * Enforces verified JWT Bearer token authentication.
 * Restricted to verified corporate @thefifthlab.com and @cwg-plc.com domains.
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: "Authentication required. Please provide a valid corporate Bearer token.",
    });
    return;
  }

  const token = authHeader.slice(7).trim();

  try {
    // Every token must carry a valid signature. The previous implementation also accepted
    // any string beginning with "jwt-" and looked the user up by id or email, which let an
    // attacker authenticate as any user by guessing their id. Only signed tokens pass.
    const decodedUser: AuthUserPayload = verifyAuthToken(token);

    const email = decodedUser.email.toLowerCase();
    const isAllowedDomain =
      email.endsWith("@thefifthlab.com") ||
      email.endsWith("@cwg-plc.com");

    if (!isAllowedDomain) {
      res.status(403).json({
        success: false,
        error: "Forbidden: Only authorized corporate accounts (@thefifthlab.com or @cwg-plc.com) are permitted.",
      });
      return;
    }

    req.user = decodedUser;
    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid or expired token";
    res.status(401).json({
      success: false,
      error: `Unauthorized: ${message}`,
    });
  }
}

/**
 * Role-Based Access Control (RBAC)
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: Requires one of the following roles [${allowedRoles.join(", ")}]`,
      });
      return;
    }
    next();
  };
}
