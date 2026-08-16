import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Allow development mock auth bypass when configured
  if (process.env.ENABLE_DEV_AUTH_BYPASS === "true") {
    const devRole = (req.headers["x-dev-role"] as string) || "ADMIN";
    req.user = {
      id: "usr_abraham",
      email: "abraham.akinwole@thefifthlab.com",
      name: "Abraham Akinwole",
      role: devRole,
    };
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authentication required. Please provide a valid Bearer token.",
    });
  }

  // Verify @thefifthlab.com restriction
  const userEmail = req.headers["x-user-email"] as string;
  if (userEmail && !userEmail.endsWith("@thefifthlab.com")) {
    return res.status(403).json({
      success: false,
      error: "Access denied. Only @thefifthlab.com corporate accounts are permitted.",
    });
  }

  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Forbidden: Requires one of following roles [${allowedRoles.join(", ")}]`,
      });
    }
    next();
  };
}
