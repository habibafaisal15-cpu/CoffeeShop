import { NextResponse } from "next/server";

import { getCraftSlides } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCraftSlides(), {
    headers: { "Cache-Control": "no-store" },
  });
}
