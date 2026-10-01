import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { requireSession, STAFF_ROLES } from "@/lib/api-auth";

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

// SVG is deliberately excluded: it is an executable document format, so allowing it
// here would let an uploader store stored-XSS that runs on the public site origin.
const ALLOWED_MIMES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export async function POST(req: NextRequest) {
  try {
    // Uploads write into the app's public directory, so this is staff-only.
    const auth = requireSession(req, STAFF_ROLES);
    if (!auth.ok) return auth.response;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const mime = file.type.toLowerCase();
    const extension = ALLOWED_MIMES[mime];
    if (!extension) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PNG, JPG, WebP or GIF image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 5 MB." },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
    } catch {
      // Ignored if exists
    }

    // Derive the stored name from the vetted extension and a random suffix rather than
    // trusting the client filename, so traversal and double extensions are impossible.
    const uniqueName = `event_${Date.now()}_${Math.random().toString(36).slice(2, 10)}${extension}`;
    const filePath = path.join(uploadsDir, uniqueName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: uniqueName,
    });
  } catch (err: any) {
    console.error("Image upload failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
