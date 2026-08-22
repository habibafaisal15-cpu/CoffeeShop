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

  const [productsResult, categoriesResult, craftSlidesResult] =
    await Promise.allSettled([
      getProducts(),
      getCategories(),
      getCraftSlides(),
    ]);

  if (productsResult.status === "fulfilled") {
    products = productsResult.value;
  } else {
    console.error("Failed to load products:", productsResult.reason);
  }

  if (categoriesResult.status === "fulfilled") {
    categories = categoriesResult.value;
  } else {
    console.error("Failed to load categories:", categoriesResult.reason);
  }

  if (craftSlidesResult.status === "fulfilled") {
    craftSlides = craftSlidesResult.value;
  } else {
    console.error("Failed to load craft slides:", craftSlidesResult.reason);
  }

  return (
    <CustomerKiosk
      initialProducts={products}
      initialCategories={categories}
      initialCraftSlides={craftSlides}
    />
  );
}
