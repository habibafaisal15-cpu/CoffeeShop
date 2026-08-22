import { NextResponse } from "next/server";

import { getCategories } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("categories GET failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load categories" },
      { status: 503 }
    );
  }
}

