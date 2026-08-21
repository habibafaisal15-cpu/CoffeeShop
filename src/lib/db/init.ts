import { DEFAULT_CATEGORIES } from "../categories";
import { DEFAULT_PRODUCTS } from "../data";
import { getSql } from "./client";

let initPromise: Promise<void> | null = null;

async function runSchema() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      visible BOOLEAN NOT NULL DEFAULT TRUE,
      show_in_carousel BOOLEAN NOT NULL DEFAULT TRUE,
      show_in_nav BOOLEAN NOT NULL DEFAULT FALSE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL DEFAULT '',
      popular BOOLEAN NOT NULL DEFAULT FALSE,
      available BOOLEAN NOT NULL DEFAULT TRUE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      items JSONB NOT NULL,
      subtotal INTEGER NOT NULL,
      total INTEGER NOT NULL,
      service_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      delivery_instructions TEXT,
      points_earned INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function seedDefaults() {
  const sql = getSql();
  const [{ count: categoryCount }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM categories
  `;

  if (Number(categoryCount) === 0) {
    for (const category of DEFAULT_CATEGORIES) {
      await sql`
        INSERT INTO categories (
          id, label, image, sort_order, visible, show_in_carousel, show_in_nav
        ) VALUES (
          ${category.id},
          ${category.label},
          ${category.image},
          ${category.sortOrder},
          ${category.visible},
          ${category.showInCarousel},
          ${category.showInNav}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }

  const [{ count: productCount }] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count FROM products
  `;

  if (Number(productCount) === 0) {
    for (const product of DEFAULT_PRODUCTS) {
      await sql`
        INSERT INTO products (
          id, name, description, price, category, image, popular, available
        ) VALUES (
          ${product.id},
          ${product.name},
          ${product.description},
          ${product.price},
          ${product.category},
          ${product.image},
          ${product.popular ?? false},
          ${product.available}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }
  }
}

export async function ensureDb() {
  if (!initPromise) {
    initPromise = (async () => {
      await runSchema();
      await seedDefaults();
    })().catch((error) => {
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}
