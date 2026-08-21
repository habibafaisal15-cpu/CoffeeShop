import { config } from "dotenv";
import { resolve } from "path";
import { getSql } from "../src/lib/db/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const sql = getSql();
  const categories = await sql`SELECT id, image FROM categories ORDER BY sort_order`;
  const products = await sql`SELECT id, name, image FROM pos_products ORDER BY name`;
  console.log("categories:", categories);
  console.log("products:", products);
  await sql.end();
}

main().catch(console.error);
