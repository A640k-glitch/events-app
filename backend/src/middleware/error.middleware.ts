import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  console.error("Unhandled API Error:", err);

  const statusCode = (err as { status?: number }).status || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
}
