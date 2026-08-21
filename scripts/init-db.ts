import { config } from "dotenv";
import { resolve } from "path";
import { ensureDb } from "../src/lib/db/init";
import { getSql } from "../src/lib/db/client";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  await ensureDb();
  const sql = getSql();
  const [{ categories }] = await sql`SELECT COUNT(*)::int AS categories FROM categories`;
  const [{ products }] = await sql`SELECT COUNT(*)::int AS products FROM products`;
  console.log(`Database ready — ${categories} categories, ${products} products.`);
  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
