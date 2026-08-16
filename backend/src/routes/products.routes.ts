import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

export const productsRouter = Router();

// GET /api/products - List all products
productsRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        owner: true,
      },
      orderBy: { name: "asc" },
    });

    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/products/:slug - Get single product details
productsRouter.get("/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        owner: true,
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found" });
    }

    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/products - Create product (Admin only)
productsRouter.post(
  "/",
  requireAuth,
  requireRole(["ADMIN"]),
  async (req: Request, res: Response) => {
    try {
      const { slug, name, tagline, description, iconName, bgColor, ownerId, availableSlots } =
        req.body;

      const product = await prisma.product.create({
        data: {
          slug,
          name,
          tagline,
          description,
          iconName: iconName || "Briefcase",
          bgColor: bgColor || "#F4F4FF",
          ownerId: ownerId || null,
          availableSlots: availableSlots || ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
        },
      });

      res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
);
