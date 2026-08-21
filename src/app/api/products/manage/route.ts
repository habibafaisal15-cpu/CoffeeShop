import { NextRequest, NextResponse } from "next/server";

import { createProduct, deleteProduct, getProducts, updateProduct } from "@/lib/db";

import { Product } from "@/lib/types";

export const dynamic = "force-dynamic";



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



  const products = await getProducts();

  let id = body.id ?? slugify(body.name);
  if (products.some((p) => p.id === id)) {
    id = `${id}-${Date.now()}`;
  }

  const newProduct: Product = {
    ...body,
    id,

    name: body.name.trim(),

    description: body.description?.trim() ?? "",

    available: body.available ?? true,

  };


  await createProduct(newProduct);

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



  const updated = await updateProduct(body);

  if (!updated) {

    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  }



  return NextResponse.json(updated);

}



export async function DELETE(request: NextRequest) {

  const { searchParams } = new URL(request.url);

  const id = searchParams.get("id");

  if (!id) {

    return NextResponse.json({ error: "Missing id" }, { status: 400 });

  }



  const deleted = await deleteProduct(id);

  if (!deleted) {

    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  }



  return NextResponse.json({ success: true });

}

