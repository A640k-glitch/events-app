import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";

export const authRouter = Router();

// GET /api/auth/me - Current user session info
authRouter.get("/me", async (req: Request, res: Response) => {
  try {
    const userEmail = (req.headers["x-user-email"] as string) || "abraham.akinwole@thefifthlab.com";

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        ownedProducts: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User profile not found" });
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/auth/users - List staff members for assignments (Internal)
authRouter.get("/users", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
    });

    res.json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});
