import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-session";
import { getPublicUploadUrl, getUploadsDir } from "@/lib/storage-paths";
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized — sign in again" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File must be under 5MB" },
        { status: 400 }
      );
    }

    const uploadsDir = getUploadsDir();
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(file.name) || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(
      ext.toLowerCase()
    )
      ? ext.toLowerCase()
      : ".jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${safeExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    writeFileSync(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({ url: getPublicUploadUrl(filename) });  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
