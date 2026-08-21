import { CustomerKiosk } from "@/components/customer/CustomerKiosk";
import { getCategories, getProducts } from "@/lib/db";
import { MenuCategory, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: Product[] | undefined;
  let categories: MenuCategory[] | undefined;

  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()]);
  } catch (error) {
    console.error("Failed to load kiosk data:", error);
  }

  return (
    <CustomerKiosk
      initialProducts={products}
      initialCategories={categories}
    />
  );
}
