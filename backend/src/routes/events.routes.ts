import { Router, Request, Response } from "express";
import { EventCategory, EventPriority, AttendanceStatus } from "@prisma/client";
import prisma from "../db/prisma.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { generateBadgeQRCode } from "../services/qr.service.js";

export const eventsRouter: Router = Router();

// Type-safe guards
function isEventCategory(val: string): val is EventCategory {
  return Object.values(EventCategory).includes(val as EventCategory);
}

function isEventPriority(val: string): val is EventPriority {
  return Object.values(EventPriority).includes(val as EventPriority);
}

function isAttendanceStatus(val: string): val is AttendanceStatus {
  return Object.values(AttendanceStatus).includes(val as AttendanceStatus);
}

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

// GET /api/events/featured - Homepage Hero Carousel Events (Public)
eventsRouter.get("/featured", async (_req: Request, res: Response): Promise<void> => {
  try {
    const featuredEvents = await prisma.event.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      include: {
        attendanceManifest: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { date: "asc" },
      take: 6,
    });

    // If no featured events, fall back to any upcoming published events
    if (featuredEvents.length === 0) {
      const fallbackEvents = await prisma.event.findMany({
        where: { isPublished: true },
        include: {
          attendanceManifest: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { date: "asc" },
        take: 6,
      });

      res.json({ success: true, count: fallbackEvents.length, data: fallbackEvents });
      return;
    }

    res.json({ success: true, count: featuredEvents.length, data: featuredEvents });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch featured events";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/events - List all events (Public with optional filters)
eventsRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, priority, search, publishedOnly } = req.query;

    const categoryFilter =
      typeof category === "string" && category !== "All" && isEventCategory(category.toUpperCase())
        ? (category.toUpperCase() as EventCategory)
        : undefined;

    const priorityFilter =
      typeof priority === "string" && priority !== "All" && isEventPriority(priority.toUpperCase())
        ? (priority.toUpperCase() as EventPriority)
        : undefined;

    const searchFilter = typeof search === "string" && search.trim() !== "" ? search.trim() : undefined;
    const isPublishedFilter = publishedOnly === "false" ? undefined : true;

    const events = await prisma.event.findMany({
      where: {
        ...(isPublishedFilter !== undefined ? { isPublished: isPublishedFilter } : {}),
        ...(categoryFilter ? { category: categoryFilter } : {}),
        ...(priorityFilter ? { priority: priorityFilter } : {}),
        ...(searchFilter
          ? {
              OR: [
                { title: { contains: searchFilter, mode: "insensitive" } },
                { description: { contains: searchFilter, mode: "insensitive" } },
                { location: { contains: searchFilter, mode: "insensitive" } },
                { city: { contains: searchFilter, mode: "insensitive" } },
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch events";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/events/:id - Single event details
eventsRouter.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getParam(req.params.id);
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
      res.status(404).json({ success: false, error: "Event not found" });
      return;
    }

    res.json({ success: true, data: event });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch event";
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/events - Create new event (Staff / Admin Protected)
eventsRouter.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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
      imageUrl,
      isFeatured,
      isPublished,
      expectedAttendance,
      isFifthLabAttending,
    } = req.body;

    if (!title || !date || !time || !location || !description) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: title, date, time, location, description",
      });
      return;
    }

    const eventCategory: EventCategory =
      typeof category === "string" && isEventCategory(category.toUpperCase().replace(/\s+/g, "_"))
        ? (category.toUpperCase().replace(/\s+/g, "_") as EventCategory)
        : EventCategory.CONFERENCE;

    const eventPriority: EventPriority =
      typeof priority === "string" && isEventPriority(priority.toUpperCase())
        ? (priority.toUpperCase() as EventPriority)
        : EventPriority.MEDIUM;

    const event = await prisma.event.create({
      data: {
        title,
        category: eventCategory,
        priority: eventPriority,
        date: new Date(date),
        time,
        location,
        city: city || "Lagos",
        country: country || "Nigeria",
        description,
        strategicNotes: strategicNotes || null,
        boothNumber: boothNumber || null,
        imageUrl: typeof imageUrl === "string" && imageUrl.trim() !== "" ? imageUrl.trim() : null,
        isFeatured: Boolean(isFeatured),
        isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
        expectedAttendance: Number(expectedAttendance) || 0,
        isFifthLabAttending: Boolean(isFifthLabAttending),
      },
    });

    res.status(201).json({ success: true, data: event });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create event";
    res.status(400).json({ success: false, error: message });
  }
});

// PUT /api/events/:id - Update existing event
eventsRouter.put("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = getParam(req.params.id);
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
      imageUrl,
      isFeatured,
      isPublished,
      expectedAttendance,
      isFifthLabAttending,
    } = req.body;

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title ? { title } : {}),
        ...(category && isEventCategory(category.toUpperCase().replace(/\s+/g, "_"))
          ? { category: category.toUpperCase().replace(/\s+/g, "_") as EventCategory }
          : {}),
        ...(priority && isEventPriority(priority.toUpperCase())
          ? { priority: priority.toUpperCase() as EventPriority }
          : {}),
        ...(date ? { date: new Date(date) } : {}),
        ...(time ? { time } : {}),
        ...(location ? { location } : {}),
        ...(city ? { city } : {}),
        ...(country ? { country } : {}),
        ...(description ? { description } : {}),
        ...(strategicNotes !== undefined ? { strategicNotes } : {}),
        ...(boothNumber !== undefined ? { boothNumber } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(isPublished !== undefined ? { isPublished: Boolean(isPublished) } : {}),
        ...(expectedAttendance !== undefined ? { expectedAttendance: Number(expectedAttendance) } : {}),
        ...(isFifthLabAttending !== undefined ? { isFifthLabAttending: Boolean(isFifthLabAttending) } : {}),
      },
    });

    res.json({ success: true, data: event });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update event";
    res.status(400).json({ success: false, error: message });
  }
});

// DELETE /api/events/:id - Delete event
eventsRouter.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = getParam(req.params.id);
    await prisma.event.delete({ where: { id } });
    res.json({ success: true, message: "Event removed successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete event";
    res.status(400).json({ success: false, error: message });
  }
});

// POST /api/events/:id/rsvp - Staff RSVP to event
eventsRouter.post("/:id/rsvp", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const eventId = getParam(req.params.id);
    const userId = req.user?.id || (typeof req.body.userId === "string" ? req.body.userId : undefined);
    const rawStatus = typeof req.body.status === "string" ? req.body.status.toUpperCase() : "ATTENDING";
    const status: AttendanceStatus = isAttendanceStatus(rawStatus)
      ? (rawStatus as AttendanceStatus)
      : AttendanceStatus.ATTENDING;

    if (!userId) {
      res.status(400).json({ success: false, error: "User ID is required for RSVP" });
      return;
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit RSVP";
    res.status(400).json({ success: false, error: message });
  }
});

// POST /api/events/:id/checkin - Live QR Badge Scanning / Check-in
eventsRouter.post("/:id/checkin", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const eventId = getParam(req.params.id);
    const { userId, qrPayload } = req.body;

    let targetUserId = userId;

    if (qrPayload && typeof qrPayload === "string") {
      try {
        const parsed = JSON.parse(qrPayload);
        if (parsed.uid) targetUserId = parsed.uid;
      } catch {
        // payload might be direct userId string
        targetUserId = qrPayload;
      }
    }

    if (!targetUserId) {
      res.status(400).json({ success: false, error: "Attendee User ID is required for check-in." });
      return;
    }

    const checkinRecord = await prisma.attendanceRecord.upsert({
      where: {
        userId_eventId: {
          userId: targetUserId,
          eventId,
        },
      },
      update: {
        isCheckedIn: true,
        checkedInAt: new Date(),
        status: AttendanceStatus.ATTENDING,
      },
      create: {
        userId: targetUserId,
        eventId,
        status: AttendanceStatus.ATTENDING,
        isCheckedIn: true,
        checkedInAt: new Date(),
      },
      include: {
        user: true,
        event: true,
      },
    });

    res.json({
      success: true,
      message: `Verified check-in for ${checkinRecord.user.name}`,
      data: {
        attendee: checkinRecord.user.name,
        role: checkinRecord.user.role,
        event: checkinRecord.event.title,
        checkedInAt: checkinRecord.checkedInAt,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Check-in validation failed";
    res.status(400).json({ success: false, error: message });
  }
});

// PATCH /api/events/:id - Update Event Details (Protected Admin/Staff)
eventsRouter.patch("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = getParam(req.params.id);
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
      imageUrl,
      isFeatured,
      isPublished,
      expectedAttendance,
      isFifthLabAttending,
    } = req.body;

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...(title ? { title } : {}),
        ...(category && isEventCategory(category) ? { category } : {}),
        ...(priority && isEventPriority(priority) ? { priority } : {}),
        ...(date ? { date: new Date(date) } : {}),
        ...(time ? { time } : {}),
        ...(location ? { location } : {}),
        ...(city ? { city } : {}),
        ...(country ? { country } : {}),
        ...(description ? { description } : {}),
        ...(strategicNotes !== undefined ? { strategicNotes } : {}),
        ...(boothNumber !== undefined ? { boothNumber } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
        ...(isFeatured !== undefined ? { isFeatured } : {}),
        ...(isPublished !== undefined ? { isPublished } : {}),
        ...(expectedAttendance !== undefined ? { expectedAttendance: Number(expectedAttendance) } : {}),
        ...(isFifthLabAttending !== undefined ? { isFifthLabAttending } : {}),
      },
    });

    res.json({ success: true, message: "Event updated successfully", data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update event";
    res.status(400).json({ success: false, error: message });
  }
});

// DELETE /api/events/:id - Delete Event from Catalog (Protected Admin)
eventsRouter.delete("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = getParam(req.params.id);
    await prisma.event.delete({
      where: { id: eventId },
    });

    res.json({ success: true, message: "Event deleted from catalog successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete event";
    res.status(400).json({ success: false, error: message });
  }
});
