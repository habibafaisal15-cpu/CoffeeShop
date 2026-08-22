import { NextResponse } from "next/server";

import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("products GET failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load products" },
      { status: 503 }
    );
  }
}

