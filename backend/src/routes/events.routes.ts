import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { generateBadgeQRCode } from "../services/qr.service.js";

export const eventsRouter = Router();

// GET /api/events - List all events (Public)
eventsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { category, priority, search } = req.query;

    const events = await prisma.event.findMany({
      where: {
        ...(category && category !== "All"
          ? { category: (category as string).toUpperCase() as any }
          : {}),
        ...(priority && priority !== "All"
          ? { priority: (priority as string).toUpperCase() as any }
          : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search as string, mode: "insensitive" } },
                { description: { contains: search as string, mode: "insensitive" } },
                { location: { contains: search as string, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        attendanceManifest: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { date: "asc" },
    });

    res.json({ success: true, count: events.length, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/events/:id - Get single event details (Public)
eventsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        attendanceManifest: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }

    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/events - Create new event (Staff / Admin Only)
eventsRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      category,
      priority,
      date,
      time,
      location,
      city,
      country,
      description,
      strategicNotes,
      boothNumber,
      expectedAttendance,
      isFifthLabAttending,
    } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        category: (category || "CONFERENCE").toUpperCase() as any,
        priority: (priority || "MEDIUM").toUpperCase() as any,
        date: new Date(date),
        time,
        location,
        city,
        country: country || "Nigeria",
        description,
        strategicNotes,
        boothNumber,
        expectedAttendance: Number(expectedAttendance) || 0,
        isFifthLabAttending: Boolean(isFifthLabAttending),
      },
    });

    res.status(201).json({ success: true, data: event });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// POST /api/events/:id/rsvp - Staff RSVP to event
eventsRouter.post("/:id/rsvp", requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const eventId = req.params.id as string;
    const userId = (req.user?.id || req.body.userId) as string;
    const status = (req.body.status || "ATTENDING").toUpperCase() as any;

    if (!userId) {
      return res.status(400).json({ success: false, error: "User ID is required" });
    }

    const rsvp = await prisma.attendanceRecord.upsert({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      update: {
        status,
        confirmedAt: new Date(),
      },
      create: {
        userId,
        eventId,
        status,
      },
      include: {
        user: true,
      },
    });

    res.json({ success: true, data: rsvp });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/events/:id/badge/:userId - Generate QR code badge
eventsRouter.get("/:id/badge/:userId", async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id as string;
    const userId = req.params.userId as string;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!event || !user) {
      return res.status(404).json({ success: false, error: "Event or User not found" });
    }

    const qrDataUrl = await generateBadgeQRCode({
      eventId: event.id,
      eventTitle: event.title,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
    });

    res.json({
      success: true,
      data: {
        qrCode: qrDataUrl,
        event: { id: event.id, title: event.title, date: event.date },
        user: { id: user.id, name: user.name, role: user.role, avatarUrl: user.avatarUrl },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
