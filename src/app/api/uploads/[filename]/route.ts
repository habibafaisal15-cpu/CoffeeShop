import { existsSync, readFileSync } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getUploadsDir } from "@/lib/storage-paths";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const safeName = path.basename(filename);
  const filePath = path.join(getUploadsDir(), safeName);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(safeName).toLowerCase();
  const buffer = readFileSync(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
