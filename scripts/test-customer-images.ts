/**
 * Verify customer site can load every menu image (direct + proxy).
 * Run: npx tsx scripts/test-customer-images.ts
 */
const CUSTOMER = process.env.CUSTOMER_URL ?? "https://coffee-pos-coral.vercel.app";

type Item = { id: string; name?: string; label?: string; image: string };

async function check(label: string, url: string) {
  const proxy = `${CUSTOMER}/api/image-proxy?url=${encodeURIComponent(url)}`;
  for (const [kind, target] of [
    ["direct", url],
    ["proxy", proxy],
  ] as const) {
    try {
      const res = await fetch(target, { method: "HEAD" });
      const ok = res.ok;
      console.log(`${ok ? "OK" : "FAIL"} ${label} [${kind}] ${res.status} ${target.slice(0, 90)}`);
      if (!ok) return false;
    } catch (e) {
      console.log(`FAIL ${label} [${kind}] ${e instanceof Error ? e.message : e}`);
      return false;
    }
  }
  return true;
}

async function main() {
  console.log("Customer:", CUSTOMER);

  const health = await fetch(`${CUSTOMER}/api/health`).then((r) => r.json());
  console.log("Health:", JSON.stringify(health));

  const [products, categories] = await Promise.all([
    fetch(`${CUSTOMER}/api/products`).then((r) => r.json()) as Promise<Item[]>,
    fetch(`${CUSTOMER}/api/categories`).then((r) => r.json()) as Promise<Item[]>,
  ]);

  let failed = 0;
  for (const item of categories) {
    if (!item.image?.trim()) continue;
    if (!(await check(`category:${item.id}`, item.image))) failed++;
  }
  for (const item of products) {
    if (!item.image?.trim()) continue;
    if (!(await check(`product:${item.id}`, item.image))) failed++;
  }

  const page = await fetch(CUSTOMER).then((r) => r.text());
  const proxyCount = (page.match(/\/api\/image-proxy/g) ?? []).length;
  const supabaseDirect = (page.match(/supabase\.co\/storage/g) ?? []).length;
  console.log(`Page HTML: ${proxyCount} proxied imgs, ${supabaseDirect} direct supabase refs`);
  console.log(failed ? `\n${failed} image(s) FAILED` : "\nAll images OK");
  process.exit(failed ? 1 : 0);
}

main();
