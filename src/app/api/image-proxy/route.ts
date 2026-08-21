import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "bgupvqeccxztvkfuvefl.supabase.co",
  "images.unsplash.com",
  "img.icons8.com",
  "picsum.photos",
  "coffee-shop-pos-eight.vercel.app",
  "coffee-pos-coral.vercel.app",
];

function isAllowedImageUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    return ALLOWED_HOSTS.some(
      (host) => url.hostname === host || url.hostname.endsWith(".supabase.co")
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url")?.trim();
  if (!raw || !isAllowedImageUrl(raw)) {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  try {
    const upstream = await fetch(raw, { cache: "no-store" });
    if (!upstream.ok) {
      return NextResponse.json({ error: "Image not found" }, { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") ?? "image/jpeg";
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }
}

export const dynamic = "force-dynamic";
