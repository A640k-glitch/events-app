import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";

export const consentRouter: Router = Router();

// POST /api/consent
consentRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { visitorId, status = "ACCEPTED" } = req.body;

    if (!visitorId || typeof visitorId !== "string") {
      res.status(400).json({ success: false, error: "visitorId is required" });
      return;
    }

    const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || null;
    const userAgent = req.headers["user-agent"] || null;

    const consent = await (prisma as any).privacyConsent.create({
      data: {
        visitorId,
        ipAddress,
        userAgent,
        status,
        acceptedAt: new Date(),
      },
    });

    res.cookie("fifthlab_consent", "accepted", {
      path: "/",
      maxAge: 31536000000,
      sameSite: "lax",
      httpOnly: false,
    });

    res.status(201).json({
      success: true,
      message: "Storage & privacy consent saved to database.",
      data: consent,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Consent logging failed";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/consent?visitorId=...
consentRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const visitorId = req.query.visitorId as string;
    if (!visitorId) {
      res.json({ success: true, accepted: false });
      return;
    }

    const record = await (prisma as any).privacyConsent.findFirst({
      where: { visitorId, status: "ACCEPTED" },
      orderBy: { acceptedAt: "desc" },
    });

    res.json({
      success: true,
      accepted: Boolean(record),
      data: record || null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Consent check failed";
    res.status(500).json({ success: false, error: message });
  }
});
