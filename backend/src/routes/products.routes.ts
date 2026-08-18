import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

export const productsRouter: Router = Router();

function getParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

// GET /api/products - List all products
productsRouter.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      include: {
        owner: true,
      },
      orderBy: { name: "asc" },
    });

    res.json({ success: true, count: products.length, data: products });
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

      res.json({ success: true, message: "Product deleted from catalog successfully." });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to delete product";
      res.status(400).json({ success: false, error: message });
    }
  }
);
