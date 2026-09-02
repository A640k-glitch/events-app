import { Router, Request, Response } from "express";
import { TicketTier } from "@prisma/client";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { generateBadgeQRCode } from "../services/qr.service.js";
import { sendEventTicketEmail } from "../services/email.service.js";

export const registrationRouter: Router = Router();

function isTicketTier(val: string): val is TicketTier {
  return Object.values(TicketTier).includes(val as TicketTier);
}

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

// POST /api/events/:id/register - Public Event Registration & Instant QR Ticket Delivery
registrationRouter.post("/:id/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = getParam(req.params.id);
    const { visitorName, email, phone, company, ticketTier } = req.body;

    if (!visitorName || !email || !phone || !company) {
      res.status(400).json({
        success: false,
        error: "Missing required registration fields: visitorName, email, phone, company",
      });
      return;
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      res.status(404).json({ success: false, error: "Event not found" });
      return;
    }

    const rawTier = typeof ticketTier === "string" ? ticketTier.toUpperCase() : "FREE_VISITOR";
    const tier: TicketTier = isTicketTier(rawTier) ? rawTier : TicketTier.FREE_VISITOR;

    const qrPassCode = `FL-PASS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create public event registration record in database
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        visitorName,
        email: email.trim().toLowerCase(),
        phone,
        company,
        ticketTier: tier,
        qrPassCode,
      },
      include: {
        event: true,
      },
    });

    // Generate downloadable QR Pass Data URL
    const qrBadgeDataUrl = await generateBadgeQRCode({
      eventId: event.id,
      eventTitle: event.title,
      userId: registration.id,
      userName: visitorName,
      userRole: `Public Attendee (${tier.replace(/_/g, " ")})`,
    });

    const formattedEventDate = !isNaN(new Date(event.date).getTime())
      ? new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : String(event.date);

    // Send digital ticket email with embedded QR code badge asynchronously
    sendEventTicketEmail({
      to: email,
      visitorName,
      company,
      eventTitle: event.title,
      eventDate: formattedEventDate,
      eventTime: event.time,
      eventLocation: `${event.location}, ${event.city}`,
      ticketTier: tier,
      qrPassCode,
      qrBadgeDataUrl,
    }).catch((err: unknown) => console.error("Ticket email dispatch error:", err));

    res.status(201).json({
      success: true,
      message: "Event registration confirmed and digital QR ticket delivered to email.",
      data: {
        registrationId: registration.id,
        visitorName: registration.visitorName,
        email: registration.email,
        company: registration.company,
        ticketTier: registration.ticketTier,
        qrPassCode: registration.qrPassCode,
        qrBadgeDataUrl,
        event: {
          id: event.id,
          title: event.title,
          date: formattedEventDate,
          time: event.time,
          location: event.location,
          city: event.city,
        },
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Registration failed";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/events/:id/registrations - Staff View Public Attendee Roster (Protected)
registrationRouter.get("/:id/registrations", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = getParam(req.params.id);
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch event registrations";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/events/:id/registrations/export - Export Attendee Badge Manifest to CSV (Protected)
registrationRouter.get("/:id/registrations/export", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = getParam(req.params.id);
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      res.status(404).json({ success: false, error: "Event not found" });
      return;
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Pass Code",
      "Attendee Name",
      "Company",
      "Email Address",
      "Phone Number",
      "Ticket Tier",
      "Venue Check-In",
      "Check-In Timestamp",
      "Registration Date",
    ];

    const escapeCsv = (val: string | null | undefined) => {
      if (!val) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const rows = registrations.map((r) => [
      escapeCsv(r.qrPassCode),
      escapeCsv(r.visitorName),
      escapeCsv(r.company),
      escapeCsv(r.email),
      escapeCsv(r.phone),
      escapeCsv(r.ticketTier.replace(/_/g, " ")),
      escapeCsv(r.isCheckedIn ? "YES" : "NO"),
      escapeCsv(r.checkedInAt ? new Date(r.checkedInAt).toISOString() : "N/A"),
      escapeCsv(new Date(r.createdAt).toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const safeTitle = event.title.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="attendees-${safeTitle}.csv"`);
    res.status(200).send(csvContent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to export attendees";
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/events/:id/verify-pass - Check in Public Attendee via QR Code (Protected)
registrationRouter.post("/:id/verify-pass", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = getParam(req.params.id);
    const { qrPassCode } = req.body;

    if (!qrPassCode || typeof qrPassCode !== "string") {
      res.status(400).json({ success: false, error: "QR Pass Code is required for verification." });
      return;
    }

    const registration = await prisma.eventRegistration.findFirst({
      where: {
        eventId,
        qrPassCode: qrPassCode.trim(),
      },
      include: {
        event: true,
      },
    });

    if (!registration) {
      res.status(404).json({ success: false, error: "Invalid ticket or pass code for this event." });
      return;
    }

    const updated = await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: {
        isCheckedIn: true,
        checkedInAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: `Verified check-in for ${updated.visitorName} (${updated.company})`,
      data: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Pass verification failed";
    res.status(500).json({ success: false, error: message });
  }
});
