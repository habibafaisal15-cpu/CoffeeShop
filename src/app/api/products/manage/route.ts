import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProducts } from "@/lib/db";
import { Product } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Omit<Product, "id"> & { id?: string };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!body.price || body.price <= 0) {
    return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
  }
  if (!body.category) {
    return NextResponse.json({ error: "Category is required" }, { status: 400 });
  }

  const products = getProducts();
  const newProduct: Product = {
    ...body,
    id: body.id ?? slugify(body.name),
    name: body.name.trim(),
    description: body.description?.trim() ?? "",
    available: body.available ?? true,
  };
  products.push(newProduct);
  saveProducts(products);
  return NextResponse.json(newProduct, { status: 201 });
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `product-${Date.now()}`
  );
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as Product;
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const products = getProducts();
  const index = products.findIndex((p) => p.id === body.id);
  if (index === -1) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  products[index] = body;
  saveProducts(products);
  return NextResponse.json(body);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  return NextResponse.json({ success: true });
}
