import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { sendBookingConfirmationEmail } from "../services/email.service.js";

export const leadsRouter = Router();

// POST /api/leads - Public Lead / Demo booking submission
leadsRouter.post("/", async (req: Request, res: Response) => {
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
      return res.status(400).json({
        success: false,
        error: "Missing required fields: visitorName, company, email, phone, productInterested",
      });
    }

    // Lookup product to assign owner
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { name: { contains: productInterested, mode: "insensitive" } },
          { slug: { contains: productInterested.toLowerCase() } },
        ],
      },
      include: { owner: true },
    });

    const lead = await prisma.lead.create({
      data: {
        visitorName,
        company,
        email,
        phone,
        productInterested,
        assignedProductOwnerId: product?.ownerId || null,
        bookingDate: bookingDate ? new Date(bookingDate) : null,
        bookingTime: timeSlot || null,
        notes: notes || null,
        status: "UNREAD",
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
    }).catch((err) => console.error("Email send failed:", err));

    res.status(201).json({ success: true, data: lead });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/leads - List all leads (Protected)
leadsRouter.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { status, search, productId } = req.query;

    const leads = await prisma.lead.findMany({
      where: {
        ...(status && status !== "All"
          ? { status: (status as string).toUpperCase().replace(" ", "_") as any }
          : {}),
        ...(search
          ? {
              OR: [
                { visitorName: { contains: search as string, mode: "insensitive" } },
                { company: { contains: search as string, mode: "insensitive" } },
                { email: { contains: search as string, mode: "insensitive" } },
                { productInterested: { contains: search as string, mode: "insensitive" } },
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PATCH /api/leads/:id - Update lead status / notes (Protected)
leadsRouter.patch("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, notes, assignedProductOwnerId } = req.body;

    const lead = await prisma.lead.update({
      where: { id },
      data: {
        ...(status ? { status: status.toUpperCase().replace(" ", "_") as any } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(assignedProductOwnerId !== undefined ? { assignedProductOwnerId } : {}),
      },
      include: {
        assignedOwner: true,
      },
    });

    res.json({ success: true, data: lead });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// GET /api/leads/export - Export leads to CSV (Protected)
leadsRouter.get("/export", requireAuth, async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      include: { assignedOwner: true },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "ID",
      "Visitor Name",
      "Company",
      "Email",
      "Phone",
      "Product Interested",
      "Assigned Owner",
      "Status",
      "Booking Date",
      "Created At",
    ];

    const rows = leads.map((l: any) => [
      l.id,
      `"${l.visitorName}"`,
      `"${l.company}"`,
      l.email,
      `"${l.phone}"`,
      `"${l.productInterested}"`,
      `"${l.assignedOwner?.name || "Unassigned"}"`,
      l.status,
      l.bookingDate ? l.bookingDate.toISOString() : "",
      l.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="fifthlab-leads-${new Date().toISOString().split("T")[0]}.csv"`
    );
    res.send(csvContent);
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
