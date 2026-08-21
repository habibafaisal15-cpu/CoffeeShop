"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Category, NavCategory, Product, MenuCategory } from "@/lib/types";
import { Sidebar } from "@/components/customer/Sidebar";
import { MenuArea } from "@/components/customer/MenuArea";
import { OrderPanel } from "@/components/customer/OrderPanel";
import { ServiceModal } from "@/components/customer/ServiceModal";
import { SceneBackground } from "@/components/customer/SceneBackground";
import { HeroCoffeeDecor } from "@/components/customer/HeroCoffeeDecor";
import { useCartStore } from "@/lib/store";
import { IconBell } from "@/components/icons/BrewedIcons";
import { getLinkedCustomerUrl } from "@/lib/site-mode";

const PRODUCTION_CUSTOMER_URL =
  getLinkedCustomerUrl() || "https://coffee-pos-coral.vercel.app";

const NAV_TO_CATEGORY: Partial<Record<NavCategory, Category>> = {
  home: "all",
  coffee: "coffee",
  "hot-drinks": "hot-drinks",
  "iced-drinks": "iced-coffee",
  pastries: "pastries",
  sandwiches: "sandwiches",
  snacks: "snacks",
  merchandise: "merchandise",
};

interface CustomerKioskProps {
  initialProducts?: Product[];
  initialCategories?: MenuCategory[];
}

async function fetchKioskData(): Promise<{
  products: Product[];
  categories: MenuCategory[];
}> {
  const bust = Date.now();
  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`/api/products?_=${bust}`, { cache: "no-store" }),
    fetch(`/api/categories?_=${bust}`, { cache: "no-store" }),
  ]);

  const [productsData, categoriesData] = await Promise.all([
    productsRes.ok ? productsRes.json() : [],
    categoriesRes.ok ? categoriesRes.json() : [],
  ]);

  return {
    products: Array.isArray(productsData) ? productsData : [],
    categories: Array.isArray(categoriesData) ? categoriesData : [],
  };
}

export function CustomerKiosk({
  initialProducts,
  initialCategories,
}: CustomerKioskProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [categories, setCategories] = useState<MenuCategory[]>(
    initialCategories ?? []
  );
  const [activeNav, setActiveNav] = useState<NavCategory>("home");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    useCartStore.persist.rehydrate();

    let cancelled = false;

    const refresh = async () => {
      try {
        const data = await fetchKioskData();
        if (cancelled) return;
        setProducts(data.products);
        setCategories(data.categories);
        setRefreshKey((k) => k + 1);
        router.refresh();
      } catch {
        /* keep last loaded data */
      } finally {
        if (!cancelled) setDataLoaded(true);
      }
    };

    void refresh();

    const onRefresh = () => void refresh();
    window.addEventListener("focus", onRefresh);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") onRefresh();
    });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) onRefresh();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onRefresh);
    };
  }, [router]);

  const handleNavChange = (nav: NavCategory) => {
    setActiveNav(nav);
    const cat = NAV_TO_CATEGORY[nav];
    if (cat) setActiveCategory(cat);
  };

  const showDbWarning =
    dataLoaded && products.length === 0 && categories.length === 0;

  return (
    <div className="relative min-h-screen">
      {showDbWarning && (
        <div className="relative z-50 border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
          Menu data could not load. Use the live site:{" "}
          <a href={PRODUCTION_CUSTOMER_URL} className="font-semibold underline">
            {PRODUCTION_CUSTOMER_URL.replace(/^https?:\/\//, "")}
          </a>
        </div>
      )}
      <SceneBackground />

      <div className="relative z-30 flex items-center justify-between px-4 py-3 xl:hidden">
        <p className="font-serif text-lg font-bold text-[#2A1E17]">Brewed</p>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-[#DDD0C2]/90 text-[#2A1E17] shadow-sm backdrop-blur-md"
          aria-label="Notifications"
        >
          <IconBell size={18} />
        </button>
      </div>

      <button
        type="button"
        className="absolute right-5 top-5 z-30 hidden h-10 w-10 items-center justify-center rounded-2xl border border-white/30 bg-[#DDD0C2]/90 text-[#2A1E17] shadow-sm backdrop-blur-md xl:flex"
        aria-label="Notifications"
      >
        <IconBell size={20} />
      </button>

      <div className="relative z-10 flex min-h-[calc(100vh-3.5rem)] flex-col gap-2 px-2 pb-4 xl:min-h-screen xl:flex-row xl:items-stretch xl:gap-0 xl:px-0 xl:py-4">
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
        <MenuArea
          key={refreshKey}
          products={products}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
        <HeroCoffeeDecor />
        <div className="relative z-10 flex w-full shrink-0 flex-col xl:w-[20%] xl:min-w-[14rem] xl:max-w-[18.5rem]">
          <div className="xl:sticky xl:top-4 xl:mt-[calc(19rem-1.75in)] xl:self-start">
            <OrderPanel products={products} />
          </div>
        </div>
      </div>

      <ServiceModal />
    </div>
  );
}
