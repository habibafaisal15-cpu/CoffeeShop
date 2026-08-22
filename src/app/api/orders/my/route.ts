import { NextRequest, NextResponse } from "next/server";

import { getOrdersByIds } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids")?.trim() ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const orders = await getOrdersByIds(ids);
    return NextResponse.json(orders, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("orders/my GET failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load orders" },
      { status: 503 }
    );
  }
}
