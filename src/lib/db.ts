import { DEFAULT_CATEGORIES } from "./categories";
import { getSql } from "./db/client";
import { ensureDb } from "./db/init";
import { getProductsTable } from "./db/tables";
import {
  mapCategory,
  mapCraftSlide,
  mapOrder,
  mapProduct,
  type CategoryRow,
  type CraftSlideRow,
  type OrderRow,
  type ProductRow,
} from "./db/mappers";
import { CraftSlide, MenuCategory, Order, Product } from "./types";
import { trimMediaUrl } from "./media-url";

export { ensureDb };

export async function getProducts(): Promise<Product[]> {
  await ensureDb();
  const sql = getSql();
  const productsTable = await getProductsTable();
  const rows = await sql<ProductRow[]>`
    SELECT * FROM ${sql(productsTable)} ORDER BY name ASC
  `;
  return rows.map(mapProduct);
}

export async function createProduct(product: Product): Promise<Product> {
  await ensureDb();
  const sql = getSql();
  const productsTable = await getProductsTable();
  await sql`
    INSERT INTO ${sql(productsTable)} (
      id, name, description, price, category, image, popular, available
    ) VALUES (
      ${product.id},
      ${product.name},
      ${product.description},
      ${product.price},
      ${product.category},
      ${trimMediaUrl(product.image)},
      ${product.popular ?? false},
      ${product.available}
    )
  `;
  return product;
}

export async function updateProduct(product: Product): Promise<Product | null> {
  await ensureDb();
  const sql = getSql();
  const productsTable = await getProductsTable();
  const rows = await sql<ProductRow[]>`
    UPDATE ${sql(productsTable)} SET
      name = ${product.name},
      description = ${product.description},
      price = ${product.price},
      category = ${product.category},
      image = ${trimMediaUrl(product.image)},
      popular = ${product.popular ?? false},
      available = ${product.available}
    WHERE id = ${product.id}
    RETURNING *
  `;
  const row = rows[0] as ProductRow | undefined;
  return row ? mapProduct(row) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  await ensureDb();
  const sql = getSql();
  const productsTable = await getProductsTable();
  const rows = await sql`
    DELETE FROM ${sql(productsTable)} WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}

export async function getCategories(): Promise<MenuCategory[]> {
  await ensureDb();
  const rows = await getSql()<CategoryRow[]>`
    SELECT * FROM categories ORDER BY sort_order ASC
  `;
  const byId = new Map(rows.map((row) => [row.id, mapCategory(row)]));

  for (const def of DEFAULT_CATEGORIES) {
    if (!byId.has(def.id)) {
      byId.set(def.id, def);
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getCategoryById(id: string): Promise<MenuCategory | null> {
  const categories = await getCategories();
  return categories.find((c) => c.id === id) ?? null;
}

export async function addCategory(category: MenuCategory): Promise<MenuCategory> {
  await ensureDb();
  const sql = getSql();
  await sql`
    INSERT INTO categories (
      id, label, image, sort_order, visible, show_in_carousel, show_in_nav
    ) VALUES (
      ${category.id},
      ${category.label},
      ${trimMediaUrl(category.image)},
      ${category.sortOrder},
      ${category.visible},
      ${category.showInCarousel},
      ${category.showInNav}
    )
  `;
  return category;
}

export async function updateCategory(
  id: string,
  updates: Partial<MenuCategory>
): Promise<MenuCategory | null> {
  await ensureDb();
  const existing = await getCategoryById(id);
  if (!existing) return null;

  const next: MenuCategory = {
    ...existing,
    ...updates,
    image: updates.image !== undefined ? trimMediaUrl(updates.image) : existing.image,
  };
  const sql = getSql();
  const rows = await sql<CategoryRow[]>`
    UPDATE categories SET
      label = ${next.label},
      image = ${next.image},
      sort_order = ${next.sortOrder},
      visible = ${next.visible},
      show_in_carousel = ${next.showInCarousel},
      show_in_nav = ${next.showInNav}
    WHERE id = ${id}
    RETURNING *
  `;
  const row = rows[0] as CategoryRow | undefined;
  return row ? mapCategory(row) : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await ensureDb();
  const sql = getSql();
  const rows = await sql`DELETE FROM categories WHERE id = ${id} RETURNING id`;
  return rows.length > 0;
}

export async function getCraftSlides(): Promise<CraftSlide[]> {
  await ensureDb();
  const rows = await getSql()<CraftSlideRow[]>`
    SELECT * FROM craft_slides ORDER BY sort_order ASC, id ASC
  `;
  return rows.map(mapCraftSlide);
}

export async function updateCraftSlide(
  slide: CraftSlide
): Promise<CraftSlide | null> {
  await ensureDb();
  const sql = getSql();
  const rows = await sql<CraftSlideRow[]>`
    UPDATE craft_slides SET
      eyebrow = ${slide.eyebrow},
      title = ${slide.title},
      description = ${slide.description},
      cta = ${slide.cta},
      category = ${slide.category},
      image = ${trimMediaUrl(slide.image)},
      badge = ${slide.badge},
      sort_order = ${slide.sortOrder}
    WHERE id = ${slide.id}
    RETURNING *
  `;
  const row = rows[0] as CraftSlideRow | undefined;
  return row ? mapCraftSlide(row) : null;
}

export async function getOrders(): Promise<Order[]> {
  await ensureDb();
  const rows = await getSql()<OrderRow[]>`
    SELECT * FROM orders ORDER BY created_at DESC
  `;
  return rows.map(mapOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  await ensureDb();
  const sql = getSql();
  const rows = await sql<OrderRow[]>`
    SELECT * FROM orders WHERE id = ${id} LIMIT 1
  `;
  const row = rows[0] as OrderRow | undefined;
  return row ? mapOrder(row) : null;
}

export async function addOrder(order: Order): Promise<Order> {
  await ensureDb();
  const sql = getSql();
  await sql`
    INSERT INTO orders (
      id,
      items,
      subtotal,
      total,
      service_type,
      status,
      delivery_instructions,
      points_earned,
      created_at,
      updated_at
    ) VALUES (
      ${order.id},
      ${sql.json(order.items as unknown as import("postgres").JSONValue)},
      ${order.subtotal},
      ${order.total},
      ${order.serviceType},
      ${order.status},
      ${order.deliveryInstructions ?? null},
      ${order.pointsEarned},
      ${order.createdAt},
      ${order.updatedAt}
    )
  `;
  return order;
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  await ensureDb();
  const existing = await getOrderById(id);
  if (!existing) return null;

  const next: Order = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const sql = getSql();
  const rows = await sql<OrderRow[]>`
    UPDATE orders SET
      items = ${sql.json(next.items as unknown as import("postgres").JSONValue)},
      subtotal = ${next.subtotal},
      total = ${next.total},
      service_type = ${next.serviceType},
      status = ${next.status},
      delivery_instructions = ${next.deliveryInstructions ?? null},
      points_earned = ${next.pointsEarned},
      updated_at = ${next.updatedAt}
    WHERE id = ${id}
    RETURNING *
  `;
  const row = rows[0] as OrderRow | undefined;
  return row ? mapOrder(row) : null;
}

export async function generateOrderId(): Promise<string> {
  await ensureDb();
  const sql = getSql();

  for (let attempt = 0; attempt < 10; attempt++) {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const rows = await sql`SELECT id FROM orders WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return id;
  }

  return `ORD-${Date.now()}`;
}

export function calculatePoints(
  total: number,
  serviceType: "pickup" | "delivery"
): number {
  const base = Math.floor(total / 10);
  return serviceType === "delivery" ? base * 2 : base;
}
