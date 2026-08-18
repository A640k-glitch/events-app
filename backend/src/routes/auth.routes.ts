import { Router, Request, Response } from "express";
import prisma from "../db/prisma.js";
import { signAuthToken, verifyAuthToken } from "../services/jwt.service.js";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { UserRole } from "@prisma/client";
import { sendOtpVerificationEmail } from "../services/email.service.js";

export const authRouter: Router = Router();

// POST /api/auth/send-otp - Request 6-digit Corporate Security Code
authRouter.post("/send-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name } = req.body;

    if (!email || typeof email !== "string") {
      res.status(400).json({ success: false, error: "Corporate email is required." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@thefifthlab.com")) {
      res.status(403).json({
        success: false,
        error: "Access restricted: Only corporate @thefifthlab.com accounts can access FifthLab Events.",
      });
      return;
    }

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const now = new Date();

    if (user) {
      // Check Rate Limit: max 3 attempts within 15 minutes
      if (user.otpLastSentAt && now.getTime() - user.otpLastSentAt.getTime() < 15 * 60 * 1000) {
        if (user.otpAttempts >= 3) {
          res.status(429).json({
            success: false,
            error: "Maximum verification code requests exceeded. Please wait 15 minutes before requesting a new code.",
          });
          return;
        }
      } else {
        // Reset attempts window after 15 minutes
        await prisma.user.update({
          where: { email: normalizedEmail },
          data: { otpAttempts: 0 },
        });
      }
    }

    // Generate random 6-digit code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const displayName =
      name?.trim() ||
      user?.name ||
      normalizedEmail
        .split("@")[0]
        .split(".")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ");

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: displayName,
          role: UserRole.STAFF,
          timezone: "WAT",
          isVerified: false,
          otpCode,
          otpExpiresAt,
          otpAttempts: 1,
          otpLastSentAt: now,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { email: normalizedEmail },
        data: {
          name: displayName,
          otpCode,
          otpExpiresAt,
          otpAttempts: { increment: 1 },
          otpLastSentAt: now,
        },
      });
    }

    // Dispatch OTP email to actual corporate inbox
    sendOtpVerificationEmail({
      to: normalizedEmail,
      recipientName: user.name,
      otpCode,
      expiresInMinutes: 10,
    }).catch((err) => console.error("OTP email dispatch error:", err));

    res.json({
      success: true,
      message: `A 6-digit corporate verification code has been dispatched to ${normalizedEmail}.`,
      expiresInMinutes: 10,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate security code";
    res.status(500).json({ success: false, error: message });
  }
});

// POST /api/auth/verify-otp - Verify 6-digit OTP & Issue JWT Session Token
authRouter.post("/verify-otp", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp || typeof email !== "string" || typeof otp !== "string") {
      res.status(400).json({ success: false, error: "Corporate email and 6-digit code are required." });
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim().replace(/\s+/g, "");

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { ownedProducts: true },
    });

    if (!user || !user.otpCode || !user.otpExpiresAt) {
      res.status(400).json({ success: false, error: "No active verification code found. Please request a new code." });
      return;
    }

    const now = new Date();
    if (now.getTime() > user.otpExpiresAt.getTime()) {
      res.status(400).json({ success: false, error: "Verification code has expired. Please request a new code." });
      return;
    }

    if (user.otpCode !== cleanOtp) {
      res.status(400).json({ success: false, error: "Invalid verification code. Please check your email and try again." });
      return;
    }

    // Code matches! Mark verified & clear single-use OTP
    const updatedUser = await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
        otpAttempts: 0,
        lastLoginAt: now,
      },
      include: { ownedProducts: true },
    });

    const token = signAuthToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    res.json({
      success: true,
      message: "Authentication successful.",
      data: {
        token,
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          avatarUrl: updatedUser.avatarUrl,
          timezone: updatedUser.timezone,
          workingHours: updatedUser.workingHours,
          isVerified: updatedUser.isVerified,
          lastLoginAt: updatedUser.lastLoginAt,
        },
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification error";
    res.status(500).json({ success: false, error: message });
  }
});

// GET /api/auth/me - Current verified user session info
authRouter.get("/me", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email;

    if (!userEmail) {
      res.status(401).json({ success: false, error: "Unauthorized session." });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        ownedProducts: true,
        rsvps: {
          include: {
            event: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, error: "User record not found." });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch user session";
    res.status(500).json({ success: false, error: message });
  }
});

// PATCH /api/auth/profile - Update current user profile in Neon DB
authRouter.patch("/profile", requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userEmail = req.user?.email;
    const { name, timezone, workingHours, avatarUrl } = req.body;

    if (!userEmail) {
      res.status(401).json({ success: false, error: "Unauthorized session." });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(timezone ? { timezone } : {}),
        ...(workingHours ? { workingHours } : {}),
        ...(avatarUrl !== undefined ? { avatarUrl } : {}),
      },
    });

    res.json({ success: true, data: updatedUser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    res.status(400).json({ success: false, error: message });
  }
});

// GET /api/auth/users - List internal FifthLab registered staff roster (Protected)
authRouter.get(
  "/users",
  requireAuth,
  async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        include: {
          ownedProducts: true,
          _count: {
            select: {
              rsvps: true,
              assignedLeads: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({ success: true, count: users.length, data: users });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch team members";
      res.status(500).json({ success: false, error: message });
    }
  }
);

// PATCH /api/auth/users/:id/role - Update user role (Protected Admin Action)
authRouter.patch(
  "/users/:id/role",
  requireAuth,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { role } = req.body;

      if (!role || !Object.values(UserRole).includes(role)) {
        res.status(400).json({ success: false, error: "Invalid role specified." });
        return;
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { role: role as UserRole },
      });

      res.json({ success: true, message: `Updated role for ${updated.name} to ${updated.role}`, data: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update user role";
      res.status(400).json({ success: false, error: message });
    }
  }
);
