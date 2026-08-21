import { NextRequest, NextResponse } from "next/server";
import {
  addCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getProducts,
  updateCategory,
} from "@/lib/db";
import { slugifyCategory } from "@/lib/categories";
import { MenuCategory } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<MenuCategory>;
  if (!body.label?.trim()) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }

  const id = body.id?.trim() || slugifyCategory(body.label);
  if (await getCategoryById(id)) {
    return NextResponse.json({ error: "Category already exists" }, { status: 409 });
  }

  const categories = await getCategories();
  const category: MenuCategory = {
    id,
    label: body.label.trim(),
    image: body.image || "https://img.icons8.com/3d-fluency/94/coffee-to-go.png",
    sortOrder: body.sortOrder ?? categories.length + 1,
    visible: body.visible ?? true,
    showInCarousel: body.showInCarousel ?? true,
    showInNav: body.showInNav ?? false,
  };

  await addCategory(category);
  return NextResponse.json(category, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as MenuCategory;
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const updated = await updateCategory(body.id, {
    label: body.label,
    image: body.image,
    sortOrder: body.sortOrder,
    visible: body.visible,
    showInCarousel: body.showInCarousel,
    showInNav: body.showInNav,
  });

  if (!updated) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (id === "all" || id === "popular") {
    return NextResponse.json(
      { error: "System categories cannot be deleted" },
      { status: 403 }
    );
  }

  const products = (await getProducts()).filter((p) => p.category === id);
  if (products.length > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete — ${products.length} product(s) use this category`,
      },
      { status: 409 }
    );
  }

  const deleted = await deleteCategory(id);
  if (!deleted) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
