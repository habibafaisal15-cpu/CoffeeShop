"use client";

import { useEffect, useState } from "react";
import { Category, NavCategory, Product, MenuCategory } from "@/lib/types";
import { DEFAULT_CATEGORIES } from "@/lib/categories";
import { DEFAULT_PRODUCTS } from "@/lib/data";
import { Sidebar } from "@/components/customer/Sidebar";
import { MenuArea } from "@/components/customer/MenuArea";
import { OrderPanel } from "@/components/customer/OrderPanel";
import { ServiceModal } from "@/components/customer/ServiceModal";
import { SceneBackground } from "@/components/customer/SceneBackground";
import { HeroCoffeeDecor } from "@/components/customer/HeroCoffeeDecor";
import { useCartStore } from "@/lib/store";
import { IconBell } from "@/components/icons/BrewedIcons";

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

export function CustomerKiosk() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] =
    useState<MenuCategory[]>(DEFAULT_CATEGORIES);
  const [activeNav, setActiveNav] = useState<NavCategory>("home");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    useCartStore.persist.rehydrate();

    const controller = new AbortController();
    const fetchTimeout = window.setTimeout(() => controller.abort(), 5000);

    Promise.all([
      fetch("/api/products", { signal: controller.signal }),
      fetch("/api/categories", { signal: controller.signal }),
    ])
      .then(async ([productsRes, categoriesRes]) => {
        const [productsData, categoriesData] = await Promise.all([
          productsRes.ok ? productsRes.json() : [],
          categoriesRes.ok ? categoriesRes.json() : [],
        ]);
        if (Array.isArray(productsData) && productsData.length > 0) {
          setProducts(productsData);
        }
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          setCategories(categoriesData);
        }
      })
      .catch(() => {
        /* keep defaults */
      })
      .finally(() => window.clearTimeout(fetchTimeout));

    return () => {
      controller.abort();
      window.clearTimeout(fetchTimeout);
    };
  }, []);

  const handleNavChange = (nav: NavCategory) => {
    setActiveNav(nav);
    const cat = NAV_TO_CATEGORY[nav];
    if (cat) setActiveCategory(cat);
  };

  return (
    <div className="relative min-h-screen">
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
