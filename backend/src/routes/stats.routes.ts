import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";

export const statsRouter: Router = Router();

// GET /api/stats - 100% Dynamic Telemetry Metrics aggregated from Neon SQL Database
statsRouter.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      eventsCount,
      leadsCount,
      activeStaffCount,
      pendingPitchesCount,
      publicRegistrationsCount,
      upcomingEvents,
      unreadLeadsCount,
    ] = await Promise.all([
      prisma.event.count({ where: { isPublished: true } }),
      prisma.lead.count(),
      prisma.user.count({
        where: {
          role: { in: ["ADMIN", "STAFF", "SALES", "OPS", "PRODUCT_OWNER"] },
        },
      }),
      prisma.eventPitch.count({ where: { status: "SUBMITTED" } }),
      prisma.eventRegistration.count(),
      prisma.event.findMany({
        where: { isPublished: true },
        select: { expectedAttendance: true },
      }),
      prisma.lead.count({ where: { status: "UNREAD" } }),
    ]);

    const totalPipelineAttendance = upcomingEvents.reduce(
      (sum, evt) => sum + (evt.expectedAttendance || 0),
      0
    );

    res.json({
      success: true,
      data: {
        upcomingEventsCount: eventsCount,
        demoRequestsCount: leadsCount,
        unreadLeadsCount,
        activeStaffCount,
        pendingPitchesCount,
        publicRegistrationsCount,
        totalExpectedAttendance: totalPipelineAttendance,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to aggregate live statistics";
    res.status(500).json({ success: false, error: message });
  }
});
