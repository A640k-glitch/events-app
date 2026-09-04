import { Router, Request, Response } from "express";
import { LeadStatus } from "@prisma/client";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { sendBookingConfirmationEmail } from "../services/email.service.js";
import { broadcast } from "../services/realtime.service.js";

export const leadsRouter: Router = Router();

function isLeadStatus(val: string): val is LeadStatus {
  return Object.values(LeadStatus).includes(val as LeadStatus);
}

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

// POST /api/leads - Public Lead / Demo booking submission
leadsRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      visitorName,
      company,
      email,
      phone,
      productInterested,
      bookingDate,
      timeSlot,
      notes,
    } = req.body;

    if (!visitorName || !company || !email || !phone || !productInterested) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: visitorName, company, email, phone, productInterested",
      });
      return;
    }

    // Lookup product to assign owner
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { name: { contains: productInterested, mode: "insensitive" } },
          { slug: { contains: (productInterested as string).toLowerCase() } },
        ],
      },
      include: { owner: true },
    });

    const lead = await prisma.lead.create({
      data: {
        visitorName,
        company,
        email: email.trim().toLowerCase(),
        phone,
        productInterested,
        assignedProductOwnerId: product?.ownerId || null,
        bookingDate: bookingDate ? new Date(bookingDate) : null,
        bookingTime: timeSlot || null,
        notes: notes || null,
        status: LeadStatus.UNREAD,
      },
      include: {
        assignedOwner: true,
      },
    });

    // Send confirmation email asynchronously
    sendBookingConfirmationEmail({
      to: email,
      visitorName,
      productName: product?.name || productInterested,
      bookingDate: bookingDate || new Date().toLocaleDateString(),
      timeSlot: timeSlot || "Pending Assignment",
      ownerName: product?.owner?.name || "Product Operations Team",
    }).catch((err: unknown) => console.error("Booking email dispatch error:", err));

    broadcast("LEAD_CHANGE", { action: "create", leadId: lead.id });

    res.status(201).json({ success: true, data: lead });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create lead";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/leads - List all leads (Protected)
leadsRouter.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, search } = req.query;

    const normalizedStatus =
      typeof status === "string" && status !== "All"
        ? status.toUpperCase().replace(/\s+/g, "_")
        : undefined;

    const statusFilter =
      normalizedStatus && isLeadStatus(normalizedStatus) ? (normalizedStatus as LeadStatus) : undefined;

    const searchFilter = typeof search === "string" && search.trim() !== "" ? search.trim() : undefined;

    const leads = await prisma.lead.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(searchFilter
          ? {
              OR: [
                { visitorName: { contains: searchFilter, mode: "insensitive" } },
                { company: { contains: searchFilter, mode: "insensitive" } },
                { email: { contains: searchFilter, mode: "insensitive" } },
                { productInterested: { contains: searchFilter, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: {
        assignedOwner: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, count: leads.length, data: leads });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch leads";
    res.status(500).json({ success: false, error: message });
  }
});

// PATCH /api/leads/:id - Update lead status / notes (Protected)
leadsRouter.patch("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getParam(req.params.id);
    const { status, notes, assignedProductOwnerId } = req.body;

    const normalizedStatus =
      typeof status === "string" ? status.toUpperCase().replace(/\s+/g, "_") : undefined;

    const statusUpdate =
      normalizedStatus && isLeadStatus(normalizedStatus) ? (normalizedStatus as LeadStatus) : undefined;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(statusUpdate ? { status: statusUpdate } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(assignedProductOwnerId !== undefined ? { assignedProductOwnerId } : {}),
      },
      include: {
        assignedOwner: true,
      },
    });

    broadcast("LEAD_CHANGE", { action: "update", leadId: lead.id });

    res.json({ success: true, data: lead });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update lead";
    res.status(400).json({ success: false, error: message });
  }
});

// GET /api/leads/export - Export filtered leads to RFC 4180 CSV (Protected)
leadsRouter.get("/export", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, product, startDate, endDate, search } = req.query;

    const normalizedStatus =
      typeof status === "string" && status !== "ALL"
        ? status.toUpperCase().replace(/\s+/g, "_")
        : undefined;

    const statusFilter =
      normalizedStatus && isLeadStatus(normalizedStatus) ? (normalizedStatus as LeadStatus) : undefined;

    const productFilter = typeof product === "string" && product.trim() !== "" ? product.trim() : undefined;
    const searchFilter = typeof search === "string" && search.trim() !== "" ? search.trim() : undefined;

    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (typeof startDate === "string" && startDate) dateFilter.gte = new Date(startDate);
    if (typeof endDate === "string" && endDate) dateFilter.lte = new Date(endDate);

    const leads = await prisma.lead.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(productFilter ? { productInterested: { contains: productFilter, mode: "insensitive" } } : {}),
        ...(Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {}),
        ...(searchFilter
          ? {
              OR: [
                { visitorName: { contains: searchFilter, mode: "insensitive" } },
                { company: { contains: searchFilter, mode: "insensitive" } },
                { email: { contains: searchFilter, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { assignedOwner: true },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Lead ID",
      "Visitor Name",
      "Company",
      "Corporate Email",
      "Phone Number",
      "Product Solution",
      "Assigned Specialist",
      "Pipeline Status",
      "Scheduled Demo Date",
      "Scheduled Time Slot",
      "Visitor Notes",
      "Date Ingested",
    ];

    const rows = leads.map((l) => [
      l.id,
      `"${l.visitorName.replace(/"/g, '""')}"`,
      `"${l.company.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.phone.replace(/"/g, '""')}"`,
      `"${l.productInterested.replace(/"/g, '""')}"`,
      `"${(l.assignedOwner?.name || "Unassigned").replace(/"/g, '""')}"`,
      l.status,
      l.bookingDate ? l.bookingDate.toISOString().split("T")[0] : "N/A",
      l.bookingTime || "N/A",
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      l.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="fifthlab-leads-pipeline-${new Date().toISOString().split("T")[0]}.csv"`
    );
    res.send(csvContent);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to export leads";
    res.status(500).json({ success: false, error: message });
  }
});

// DELETE /api/leads/:id - Delete lead record (Protected Admin/Staff)
leadsRouter.delete("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getParam(req.params.id);
    await prisma.lead.delete({
      where: { id },
    });

    broadcast("LEAD_CHANGE", { action: "delete", leadId: id });

    res.json({ success: true, message: "Lead removed from pipeline successfully." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete lead";
    res.status(400).json({ success: false, error: message });
  }
});
