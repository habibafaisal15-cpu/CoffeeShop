import { NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/lib/db/client";
import { getCategories, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const database = isDatabaseConfigured();

  if (!database) {
    return NextResponse.json(
      {
        ok: false,
        database: false,
        error: "DATABASE_URL is not configured",
        vercelEnv: process.env.VERCEL_ENV ?? "development",
      },
      { status: 503 }
    );
  }

  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    return NextResponse.json(
      {
        ok: true,
        database: true,
        products: products.length,
        categories: categories.length,
        vercelEnv: process.env.VERCEL_ENV ?? "development",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        database: true,
        error: error instanceof Error ? error.message : "Database error",
        vercelEnv: process.env.VERCEL_ENV ?? "development",
      },
      { status: 500 }
    );
  }
}
