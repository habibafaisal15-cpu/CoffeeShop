import { config } from "dotenv";
import { resolve } from "path";
import { getProducts } from "../src/lib/db";
import { getSql } from "../src/lib/db/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const sql = getSql();
  const cols = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'products'
    ORDER BY ordinal_position
  `;
  console.log("products columns:", cols);

  const catCols = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'categories'
    ORDER BY ordinal_position
  `;
  console.log("categories columns:", catCols);

  const orderCols = await sql`
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'orders'
    ORDER BY ordinal_position
  `;
  console.log("orders columns:", orderCols);

  const products = await getProducts();
  console.log("mapped count:", products.length);
  console.log("sample mapped:", products[0]);

  await sql.end();
}

main().catch(console.error);
