import { config } from "dotenv";
import { resolve } from "path";
import { ensureDb } from "../src/lib/db/init";
import { getProductsTable } from "../src/lib/db/tables";
import { getSql } from "../src/lib/db/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  await ensureDb();
  const sql = getSql();
  const productsTable = await getProductsTable();
  const [{ categories }] = await sql`SELECT COUNT(*)::int AS categories FROM categories`;
  const [{ products }] =
    await sql`SELECT COUNT(*)::int AS products FROM ${sql(productsTable)}`;
  console.log(
    `Database ready — ${categories} categories, ${products} products (table: ${productsTable}).`
  );
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
