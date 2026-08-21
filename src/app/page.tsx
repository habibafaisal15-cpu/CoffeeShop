import { CustomerDbError } from "@/components/customer/CustomerDbError";
import { CustomerKiosk } from "@/components/customer/CustomerKiosk";
import { getCategories, getCraftSlides, getProducts } from "@/lib/db";
import { isDatabaseConfigured } from "@/lib/db/client";
import { isCustomerSite } from "@/lib/site-mode";
import { CraftSlide, MenuCategory, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (isCustomerSite() && !isDatabaseConfigured()) {
    return <CustomerDbError />;
  }
  let products: Product[] | undefined;
  let categories: MenuCategory[] | undefined;
  let craftSlides: CraftSlide[] | undefined;

  try {
    [products, categories, craftSlides] = await Promise.all([
      getProducts(),
      getCategories(),
      getCraftSlides(),
    ]);
  } catch (error) {
    console.error("Failed to load kiosk data:", error);
  }

  return (
    <CustomerKiosk
      initialProducts={products}
      initialCategories={categories}
      initialCraftSlides={craftSlides}
    />
  );
}
