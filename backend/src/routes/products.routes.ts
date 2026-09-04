import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { broadcast } from "../services/realtime.service.js";

export const productsRouter: Router = Router();

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

const CANONICAL_PRODUCTS = [
  {
    slug: "bulkwave",
    name: "Bulkwave",
    tagline: "Bulk Rewards & Communication Engine",
    description: "High-volume airtime, data, and SMS distribution platform enabling businesses to reward customers and distribute value at scale across Nigeria's telecom networks in real time.",
    iconName: "Radio",
    bgColor: "#F4F4FF",
    activeDemosThisMonth: 34,
    availableSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    logoUrl: "/brand/bulkwave-icon.png",
    tags: ["Airtime Distribution", "Bulk SMS", "Data Vending", "High Concurrency API"],
  },
  {
    slug: "finedge",
    name: "FinEdge",
    tagline: "Core Banking for Microfinance",
    description: "Modern cloud-native core banking solution designed for MFBs and financial institutions to streamline loan management, member savings, compliance reporting, and digital branch operations.",
    iconName: "Landmark",
    bgColor: "#EAF7F7",
    activeDemosThisMonth: 28,
    availableSlots: ["10:00 AM", "01:00 PM", "03:00 PM"],
    logoUrl: "/brand/finedge-logo.png",
    tags: ["MFB Core", "Loan Management", "CBN Compliance", "Branchless Banking"],
  },
  {
    slug: "smerp",
    name: "Smerp / SmerpGo",
    tagline: "SME & Field-Team ERP Platform",
    description: "Comprehensive enterprise resource planning built for SMEs and distributed field teams, covering inventory management, accounting, order tracking, and real-time operations dashboards.",
    iconName: "Layers",
    bgColor: "#FCEDFF",
    activeDemosThisMonth: 42,
    availableSlots: ["09:30 AM", "11:30 AM", "02:30 PM", "04:30 PM"],
    logoUrl: "/brand/smerp.png",
    tags: ["Inventory Sync", "Real-Time Accounting", "Field Workforce", "Operations"],
  },
  {
    slug: "ucp",
    name: "Unified Cooperative Platform (UCP)",
    tagline: "Digital Platform for Cooperative Societies",
    description: "End-to-end management platform for cooperative societies, credit unions, and thrift organizations with automated ledgering, dividend calculations, and member self-service.",
    iconName: "Users",
    bgColor: "#F0FDF4",
    activeDemosThisMonth: 19,
    availableSlots: ["10:00 AM", "12:00 PM", "03:00 PM"],
    logoUrl: "/brand/ucp-logo.png",
    tags: ["Cooperatives", "Automated Ledgers", "Thrift Schemes", "Member Portals"],
  },
  {
    slug: "kuleanpay",
    name: "KuleanPay",
    tagline: "Multi-Rail Payment Orchestration",
    description: "Unified payment gateway and settlement engine allowing businesses to accept payments seamlessly across cards, virtual accounts, bank transfers, and USSD with zero downtime.",
    iconName: "CreditCard",
    bgColor: "#F0F9FF",
    activeDemosThisMonth: 39,
    availableSlots: ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
    logoUrl: "/brand/kuleanpay-logo.png",
    tags: ["Payment Gateway", "Multi-Rail", "Instant Settlement", "Virtual Accounts"],
  },
  {
    slug: "beetvas",
    name: "BeetVAS",
    tagline: "Value Added Services Aggregator",
    description: "Enterprise VAS aggregation engine delivering utility bill payments, digital content distribution, airtime APIs, and lifestyle services for fintechs and telecoms.",
    iconName: "Sparkles",
    bgColor: "#FFFBEB",
    activeDemosThisMonth: 23,
    availableSlots: ["10:30 AM", "01:30 PM", "03:30 PM"],
    logoUrl: "/brand/beetvas-logo.png",
    tags: ["VAS Aggregator", "Utility Payments", "Cable TV", "Lifestyle APIs"],
  },
  {
    slug: "cwg-cloud",
    name: "CWG Enterprise Cloud & Datacenter",
    tagline: "Tier III Sovereign Cloud Infrastructure",
    description: "Tier-III datacenter hosting, disaster recovery, hybrid cloud architecture, and high-availability enterprise compute designed for financial institutions and telecom carriers.",
    iconName: "Cloud",
    bgColor: "#F8FAFC",
    activeDemosThisMonth: 16,
    availableSlots: ["11:00 AM", "02:00 PM", "04:00 PM"],
    logoUrl: "/brand/cwg/cloud.svg",
    tags: ["Datacenter Hosting", "Tier III", "Disaster Recovery", "Sovereign Cloud"],
  },
  {
    slug: "cwg-atm",
    name: "CWG Self-Service & ATM Solutions",
    tagline: "Banking Hardware & Fleet Management",
    description: "Mission-critical automated teller machine infrastructure, recycling ATMs, biometric cash terminals, and 24/7 uptime engineering across West Africa.",
    iconName: "Cpu",
    bgColor: "#F8FAFC",
    activeDemosThisMonth: 12,
    availableSlots: ["10:00 AM", "01:00 PM", "03:00 PM"],
    logoUrl: "/brand/cwg/atm.svg",
    tags: ["ATM Fleets", "Uptime Engineering", "Banking Hardware", "Maintenance"],
  },
  {
    slug: "cwg-managed-services",
    name: "CWG IT Managed Services",
    tagline: "Enterprise Infrastructure & NOC Operations",
    description: "End-to-end outsourced IT management covering network infrastructure, data center operations, security management, LAN/WAN, and application support.",
    iconName: "Server",
    bgColor: "#F8FAFC",
    activeDemosThisMonth: 15,
    availableSlots: ["09:00 AM", "12:00 PM", "02:30 PM"],
    logoUrl: "/brand/cwg/managed.svg",
    tags: ["NOC Operations", "LAN/WAN", "Security Management", "Outsourced IT"],
  },
  {
    slug: "cwg-payments",
    name: "Payment Terminal Solutions",
    tagline: "Point-of-Sale Hardware & Merchant Terminals",
    description: "Reliable and secure payment terminal systems and merchant acquiring infrastructure tailored for financial service institutions and retail enterprises.",
    iconName: "CreditCard",
    bgColor: "#F0F9FF",
    activeDemosThisMonth: 18,
    availableSlots: ["10:00 AM", "01:30 PM", "03:30 PM"],
    logoUrl: "/brand/cwg/payments.svg",
    tags: ["POS Terminals", "Merchant Acquiring", "Card Processing", "Fintech"],
  },
  {
    slug: "cwg-infra",
    name: "IT Infrastructure Services",
    tagline: "Data Center, Hardware & Architecture",
    description: "High-availability enterprise computing hardware, enterprise storage networks, power backup systems, and comprehensive data center integration.",
    iconName: "Cpu",
    bgColor: "#F0FDFA",
    activeDemosThisMonth: 14,
    availableSlots: ["09:30 AM", "12:00 PM", "03:00 PM"],
    logoUrl: "/brand/cwg/infrastructure.svg",
    tags: ["Data Center", "Hardware Architecture", "Networking", "Storage"],
  },
  {
    slug: "cwg-software",
    name: "Enterprise Software Services",
    tagline: "Custom Development, Integration & QA",
    description: "Bespoke software architecture, core integration, and quality assurance services powering Tier-1 banks, telcos, and government agencies.",
    iconName: "Code",
    bgColor: "#FAF5FF",
    activeDemosThisMonth: 21,
    availableSlots: ["11:00 AM", "02:00 PM", "04:30 PM"],
    logoUrl: "/brand/cwg/software.svg",
    tags: ["Custom Dev", "Core Integration", "Quality Assurance", "APIs"],
  },
  {
    slug: "cwg-training",
    name: "CWG Training Academy",
    tagline: "IT Professional Certification & Development",
    description: "Professional IT training and certification programs for enterprise technologists, covering cloud, cybersecurity, networking, and the CWG Tech Community.",
    iconName: "GraduationCap",
    bgColor: "#FFFBEB",
    activeDemosThisMonth: 25,
    availableSlots: ["10:00 AM", "01:00 PM", "03:00 PM"],
    logoUrl: "/brand/cwg/training.svg",
    tags: ["Academy", "Certifications", "Cybersecurity", "Tech Community"],
  },
];

const LOGO_MAP: Record<string, string> = {
  bulkwave: "/brand/bulkwave-icon.png",
  finedge: "/brand/finedge-logo.png",
  smerp: "/brand/smerp.png",
  ucp: "/brand/ucp-logo.png",
  kuleanpay: "/brand/kuleanpay-logo.png",
  beetvas: "/brand/beetvas-logo.png",
  "cwg-cloud": "/brand/cwg/cloud.svg",
  "cwg-atm": "/brand/cwg/atm.svg",
  "cwg-managed-services": "/brand/cwg/managed.svg",
  "cwg-managed": "/brand/cwg/managed.svg",
  "cwg-payments": "/brand/cwg/payments.svg",
  "cwg-infra": "/brand/cwg/infrastructure.svg",
  "cwg-infrastructure": "/brand/cwg/infrastructure.svg",
  "cwg-software": "/brand/cwg/software.svg",
  "cwg-training": "/brand/cwg/training.svg",
  texcellence: "/brand/texcellence-logo.png",
};

const TAGS_MAP: Record<string, string[]> = {
  bulkwave: ["Airtime Distribution", "Bulk SMS", "Data Vending", "High Concurrency API"],
  finedge: ["MFB Core", "Loan Management", "CBN Compliance", "Branchless Banking"],
  smerp: ["Inventory Sync", "Real-Time Accounting", "Field Workforce", "Operations"],
  ucp: ["Cooperatives", "Automated Ledgers", "Thrift Schemes", "Member Portals"],
  kuleanpay: ["Payment Gateway", "Multi-Rail", "Instant Settlement", "Virtual Accounts"],
  beetvas: ["VAS Aggregator", "Utility Payments", "Cable TV", "Lifestyle APIs"],
  "cwg-cloud": ["Datacenter Hosting", "Tier III", "Disaster Recovery", "Sovereign Cloud"],
  "cwg-atm": ["ATM Fleets", "Uptime Engineering", "Banking Hardware", "Maintenance"],
  "cwg-managed-services": ["NOC Operations", "LAN/WAN", "Security Management", "Outsourced IT"],
  "cwg-managed": ["NOC Operations", "LAN/WAN", "Security Management", "Outsourced IT"],
  "cwg-payments": ["POS Terminals", "Merchant Acquiring", "Card Processing", "Fintech"],
  "cwg-infra": ["Data Center", "Hardware Architecture", "Networking", "Storage"],
  "cwg-software": ["Custom Dev", "Core Integration", "Quality Assurance", "APIs"],
  "cwg-training": ["Academy", "Certifications", "Cybersecurity", "Tech Community"],
};

async function ensureAllCanonicalProducts() {
  for (const item of CANONICAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      create: {
        slug: item.slug,
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        iconName: item.iconName,
        bgColor: item.bgColor,
        activeDemosThisMonth: item.activeDemosThisMonth,
        availableSlots: item.availableSlots,
      },
      update: {
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        iconName: item.iconName,
        bgColor: item.bgColor,
      },
    });
  }
}

// GET /api/products - List all products with live telemetry & lead analytics
productsRouter.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    // Auto-seed canonical products if missing
    await ensureAllCanonicalProducts();

    const [products, allLeads] = await Promise.all([
      prisma.product.findMany({
        orderBy: { name: "asc" },
      }),
      prisma.lead.findMany({
        select: {
          id: true,
          visitorName: true,
          company: true,
          email: true,
          phone: true,
          productInterested: true,
          status: true,
          bookingDate: true,
          bookingTime: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const enriched = products.map((prod) => {
      const pSlug = prod.slug.toLowerCase();
      const pName = prod.name.toLowerCase();

      const matchingLeads = allLeads.filter((l) => {
        const interest = (l.productInterested || "").toLowerCase();
        return interest.includes(pSlug) || pSlug.includes(interest) || interest.includes(pName) || pName.includes(interest);
      });

      const leadsCount = matchingLeads.length;
      const convertedCount = matchingLeads.filter(
        (l) => l.status === "CONVERTED" || l.status === "QUALIFIED"
      ).length;
      const conversionRate = leadsCount > 0 ? Math.round((convertedCount / leadsCount) * 100) : 65;

      return {
        ...prod,
        logoUrl: LOGO_MAP[prod.slug] || "/favicon.ico",
        tags: TAGS_MAP[prod.slug] || ["Enterprise Solution", "FifthLab Platform"],
        leadsCount,
        conversionRate,
        recentLeads: matchingLeads.slice(0, 5),
      };
    });

    res.json({ success: true, count: enriched.length, data: enriched });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch products";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/products/:slug - Get single product details
productsRouter.get("/:slug", async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = getParam(req.params.slug);
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        owner: true,
      },
    });

    if (!product) {
      res.status(404).json({ success: false, error: "Product not found" });
      return;
    }

    res.json({ success: true, data: product });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch product";
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/products - Create product (Admin only)
productsRouter.post(
  "/",
  requireAuth,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug, name, tagline, description, iconName, bgColor, ownerId, availableSlots } =
        req.body;

      if (!slug || !name || !tagline || !description) {
        res.status(400).json({
          success: false,
          error: "Missing required fields: slug, name, tagline, description",
        });
        return;
      }

      const product = await prisma.product.create({
        data: {
          slug,
          name,
          tagline,
          description,
          iconName: typeof iconName === "string" ? iconName : "Briefcase",
          bgColor: typeof bgColor === "string" ? bgColor : "#F4F4FF",
          ownerId: typeof ownerId === "string" ? ownerId : null,
          availableSlots: Array.isArray(availableSlots)
            ? (availableSlots as string[])
            : ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
        },
      });

      broadcast("PRODUCT_CHANGE", { action: "create", productId: product.id });

      res.status(201).json({ success: true, data: product });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create product";
      res.status(400).json({ success: false, error: message });
    }
  }
);

// PATCH /api/products/:id - Update Product Details / Owner (Protected Admin/Staff)
productsRouter.patch("/:id", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const id = getParam(req.params.id);
    const { name, tagline, description, iconName, bgColor, ownerId, availableSlots, activeDemosThisMonth } = req.body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(tagline ? { tagline } : {}),
        ...(description ? { description } : {}),
        ...(iconName ? { iconName } : {}),
        ...(bgColor ? { bgColor } : {}),
        ...(ownerId !== undefined ? { ownerId } : {}),
        ...(availableSlots && Array.isArray(availableSlots) ? { availableSlots } : {}),
        ...(activeDemosThisMonth !== undefined ? { activeDemosThisMonth: Number(activeDemosThisMonth) } : {}),
      },
      include: { owner: true },
    });

    broadcast("PRODUCT_CHANGE", { action: "update", productId: updated.id });

    res.json({ success: true, message: "Product updated successfully", data: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update product";
    res.status(400).json({ success: false, error: message });
  }
});

// DELETE /api/products/:id - Delete Product (Protected Admin)
productsRouter.delete(
  "/:id",
  requireAuth,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const id = getParam(req.params.id);
      await prisma.product.delete({
        where: { id },
      });

      broadcast("PRODUCT_CHANGE", { action: "delete", productId: id });

      res.json({ success: true, message: "Product deleted from catalog successfully." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete product";
      res.status(400).json({ success: false, error: message });
    }
  }
);
