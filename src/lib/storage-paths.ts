import os from "os";
import path from "path";

/** Writable on Vercel serverless (/tmp); local dev uses project /data */
export function getDataDir() {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "coffee-pos-data");
  }
  return path.join(process.cwd(), "data");
}

/** Writable uploads dir; served via /api/uploads on Vercel */
export function getUploadsDir() {
  if (process.env.VERCEL) {
    return path.join(os.tmpdir(), "coffee-pos-uploads");
  }
  return path.join(process.cwd(), "public", "uploads");
}

export function getPublicUploadUrl(filename: string) {
  if (process.env.VERCEL) {
    return `/api/uploads/${filename}`;
  }
  return `/uploads/${filename}`;
}
