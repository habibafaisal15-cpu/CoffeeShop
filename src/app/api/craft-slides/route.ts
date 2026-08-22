import { NextResponse } from "next/server";

import { DEFAULT_CRAFT_SLIDES } from "@/lib/craft-slides";
import { getCraftSlides } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slides = await getCraftSlides();
    return NextResponse.json(slides.length > 0 ? slides : DEFAULT_CRAFT_SLIDES, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("craft-slides GET failed:", error);
    return NextResponse.json(DEFAULT_CRAFT_SLIDES, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}
