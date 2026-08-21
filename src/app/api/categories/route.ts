import { NextResponse } from "next/server";

import { getCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getCategories(), {
    headers: { "Cache-Control": "no-store" },
  });
}

