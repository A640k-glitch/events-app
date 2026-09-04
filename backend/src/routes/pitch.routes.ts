import { Router, Request, Response } from "express";
import { PitchStatus, EventCategory, EventPriority } from "@prisma/client";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { broadcast } from "../services/realtime.service.js";

export const pitchRouter: Router = Router();

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

// POST /api/pitches - Public Pro Organizer Event Proposal Submission
pitchRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      organizerName,
      organization,
      email,
      phone,
      eventTitle,
      proposedDate,
      proposedCity,
      expectedAudience,
      pitchDescription,
      sponsorshipRequested,
    } = req.body;

    if (!organizerName || !organization || !email || !phone || !eventTitle || !pitchDescription) {
      res.status(400).json({
        success: false,
        error: "Missing required pitch fields: organizerName, organization, email, phone, eventTitle, pitchDescription",
      });
      return;
    }

    const pitch = await prisma.eventPitch.create({
      data: {
        organizerName,
        organization,
        email: email.trim().toLowerCase(),
        phone,
        eventTitle,
        proposedDate: proposedDate ? new Date(proposedDate) : new Date(),
        proposedCity: proposedCity || "Lagos",
        expectedAudience: Number(expectedAudience) || 500,
        pitchDescription,
        sponsorshipRequested: sponsorshipRequested || null,
        status: PitchStatus.SUBMITTED,
      },
    });

    broadcast("PITCH_CHANGE", { action: "create", pitchId: pitch.id });

    res.status(201).json({
      success: true,
      message: "Event proposal submitted to FifthLab Review Board successfully.",
      data: pitch,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Pitch submission failed";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/pitches - Internal Review List of Event Proposals (Protected)
pitchRouter.get("/", requireAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const pitches = await prisma.eventPitch.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: pitches.length, data: pitches });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch event pitches";
    res.status(500).json({ success: false, error: message });
  }
});

// PATCH /api/pitches/:id/status - Approve or Decline Event Proposal (Protected)
pitchRouter.patch("/:id/status", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getParam(req.params.id);
    const { status, adminReviewNotes, autoPublishEvent } = req.body;

    const pitch = await prisma.eventPitch.update({
      where: { id },
      data: {
        ...(status ? { status: status.toUpperCase() as PitchStatus } : {}),
        ...(adminReviewNotes !== undefined ? { adminReviewNotes } : {}),
      },
    });

    // If approved and autoPublishEvent is true, publish directly to Events catalog
    let createdEvent = null;
    if (status === "APPROVED" && autoPublishEvent) {
      createdEvent = await prisma.event.create({
        data: {
          title: pitch.eventTitle,
          category: EventCategory.SUMMIT,
          priority: EventPriority.HIGH,
          date: pitch.proposedDate,
          time: "09:00 AM - 05:00 PM WAT",
          location: `${pitch.organization} Venue`,
          city: pitch.proposedCity,
          country: "Nigeria",
          description: pitch.pitchDescription,
          strategicNotes: `Co-hosted with ${pitch.organization} (${pitch.organizerName} - ${pitch.email}). Sponsorship: ${pitch.sponsorshipRequested || "N/A"}`,
          expectedAttendance: pitch.expectedAudience,
          isFifthLabAttending: true,
          isPublished: true,
          isFeatured: true,
        },
      });
    }

    broadcast("PITCH_CHANGE", { action: "update", pitchId: pitch.id });
    if (createdEvent) {
      broadcast("EVENT_CHANGE", { action: "create", eventId: createdEvent.id });
    }

    res.json({
      success: true,
      message: `Pitch status updated to ${pitch.status}`,
      data: { pitch, createdEvent },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update pitch";
    res.status(400).json({ success: false, error: message });
  }
});

// GET /api/pitches/export - Export Organizer Proposals to CSV (Protected)
pitchRouter.get("/export", requireAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const pitches = await prisma.eventPitch.findMany({
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "ID",
      "Organizer Name",
      "Organization",
      "Email Address",
      "Phone Number",
      "Event Title",
      "Proposed Date",
      "Proposed City",
      "Expected Audience",
      "Sponsorship Requested",
      "Status",
      "Review Notes",
      "Submission Date",
    ];

    const escapeCsv = (val: string | number | null | undefined) => {
      if (val === null || val === undefined) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    };

    const rows = pitches.map((p) => [
      escapeCsv(p.id),
      escapeCsv(p.organizerName),
      escapeCsv(p.organization),
      escapeCsv(p.email),
      escapeCsv(p.phone),
      escapeCsv(p.eventTitle),
      escapeCsv(new Date(p.proposedDate).toISOString().split("T")[0]),
      escapeCsv(p.proposedCity),
      escapeCsv(p.expectedAudience),
      escapeCsv(p.sponsorshipRequested || "None"),
      escapeCsv(p.status),
      escapeCsv(p.adminReviewNotes || "None"),
      escapeCsv(new Date(p.createdAt).toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="proposals-roster.csv"');
    res.status(200).send(csvContent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to export proposals";
    res.status(500).json({ success: false, error: message });
  }
});
