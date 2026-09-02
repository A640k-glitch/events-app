import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { verifyAuthToken, AuthUserPayload } from "../services/jwt.service.js";

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

/**
 * Enforces verified JWT Bearer token authentication.
 * Restricted strictly to verified corporate @thefifthlab.com domains.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
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
    const decodedUser = verifyAuthToken(token);

    if (!decodedUser.email.toLowerCase().endsWith("@thefifthlab.com")) {
      res.status(403).json({
        success: false,
        error: "Forbidden: Only authorized @thefifthlab.com corporate accounts are permitted.",
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
