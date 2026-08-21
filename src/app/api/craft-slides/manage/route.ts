import { NextRequest, NextResponse } from "next/server";

import { getCraftSlides, updateCraftSlide } from "@/lib/db";
import { CraftSlide } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as CraftSlide;

  if (!body.id?.trim()) {
    return NextResponse.json({ error: "Missing slide id" }, { status: 400 });
  }
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.image?.trim()) {
    return NextResponse.json({ error: "Slide image is required" }, { status: 400 });
  }

  const updated = await updateCraftSlide({
    ...body,
    id: body.id.trim(),
    title: body.title.trim(),
    eyebrow: body.eyebrow?.trim() ?? "",
    description: body.description?.trim() ?? "",
    cta: body.cta?.trim() ?? "Explore",
    category: body.category?.trim() || "pastries",
    badge: body.badge?.trim() ?? "",
    sortOrder: body.sortOrder ?? 0,
  });

  if (!updated) {
    return NextResponse.json({ error: "Slide not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function GET() {
  return NextResponse.json(await getCraftSlides());
}
