/**
 * One-time fix: replace dead Vercel /api/uploads paths with default icons.
 * Run: npx tsx scripts/fix-legacy-images.ts
 */
import "dotenv/config";
import { DEFAULT_CATEGORIES } from "../src/lib/categories";
import { getSql } from "../src/lib/db/client";
import { getProductsTable } from "../src/lib/db/tables";

async function main() {
  const sql = getSql();
  const productsTable = await getProductsTable();

  const defaultById = Object.fromEntries(
    DEFAULT_CATEGORIES.map((c) => [c.id, c.image])
  );

  const deadCategories = await sql<{ id: string; image: string }[]>`
    SELECT id, image FROM categories
    WHERE image LIKE '%/api/uploads/%' OR image LIKE '%/uploads/%'
  `;

  for (const row of deadCategories) {
    const fallback = defaultById[row.id] ?? "";
    await sql`
      UPDATE categories SET image = ${fallback}
      WHERE id = ${row.id}
    `;
    console.log(`category ${row.id}: ${row.image} -> ${fallback}`);
  }

  const deadProducts = await sql<{ id: string; image: string }[]>`
    SELECT id, image FROM ${sql(productsTable)}
    WHERE image LIKE '%/api/uploads/%' OR image LIKE '%/uploads/%'
  `;

  for (const row of deadProducts) {
    await sql`
      UPDATE ${sql(productsTable)} SET image = ${""}
      WHERE id = ${row.id}
    `;
    console.log(`product ${row.id}: cleared dead upload path`);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
