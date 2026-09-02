import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const newsletterRouter: Router = Router();

// POST /api/newsletter/subscribe - Public Visitor Newsletter Subscription
newsletterRouter.post("/subscribe", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, source } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).json({ success: false, error: "Valid email address is required." });
      return;
    }

    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email: email.trim().toLowerCase() },
      update: {
        source: source || "HOMEPAGE",
      },
      create: {
        email: email.trim().toLowerCase(),
        source: source || "HOMEPAGE",
      },
    });

    res.status(201).json({
      success: true,
      message: "Subscribed to FifthLab event alerts and updates successfully.",
      data: subscription,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Subscription failed";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/newsletter/subscribers - Internal Subscriber List (Protected)
newsletterRouter.get("/subscribers", requireAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch subscribers";
    res.status(500).json({ success: false, error: message });
  }
});
