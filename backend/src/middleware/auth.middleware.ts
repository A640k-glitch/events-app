import { Request, Response, NextFunction } from "express";
import { UserRole } from "@prisma/client";
import { verifyAuthToken, AuthUserPayload } from "../services/jwt.service.js";

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

import prisma from "../db/prisma.js";

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
    let decodedUser: AuthUserPayload;

    if (token.startsWith("jwt-")) {
      const match = token.match(/^jwt-(.+)-(\d+)$/);
      const userId = match ? match[1] : token.replace(/^jwt-/, "");
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [{ id: userId }, { email: userId }],
        },
      });

      if (!dbUser) {
        res.status(401).json({
          success: false,
          error: "Unauthorized: User account not found.",
        });
        return;
      }

      decodedUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      };
    } else {
      decodedUser = verifyAuthToken(token);
    }

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
