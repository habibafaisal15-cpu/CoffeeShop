import { getSql } from "./client";

const POS_PRODUCTS_TABLE = "pos_products";

let productsTablePromise: Promise<string> | null = null;

async function detectProductsTable(): Promise<string> {
  const sql = getSql();
  const columns = await sql<{ column_name: string }[]>`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products'
  `;

  if (columns.length === 0) {
    return "products";
  }

  const names = new Set(columns.map((column) => column.column_name));
  const hasCoffeePosSchema =
    names.has("category") && names.has("image") && names.has("available");

  return hasCoffeePosSchema ? "products" : POS_PRODUCTS_TABLE;
}

export async function getProductsTable(): Promise<string> {
  if (!productsTablePromise) {
    productsTablePromise = detectProductsTable();
  }
  return productsTablePromise;
}

export async function createProductsTable(tableName: string) {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS ${sql(tableName)} (
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
}
