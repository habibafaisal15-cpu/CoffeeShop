"use client";

import { useCallback, useEffect, useState } from "react";
import { Category, NavCategory, Product, MenuCategory, CraftSlide } from "@/lib/types";
import { DEFAULT_CRAFT_SLIDES } from "@/lib/craft-slides";
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

const CATEGORY_TO_NAV: Partial<Record<string, NavCategory>> = {
  all: "home",
  coffee: "coffee",
  "hot-drinks": "hot-drinks",
  "iced-coffee": "iced-drinks",
  pastries: "pastries",
  sandwiches: "sandwiches",
  snacks: "snacks",
  merchandise: "merchandise",
};

interface CustomerKioskProps {
  initialProducts?: Product[];
  initialCategories?: MenuCategory[];
  initialCraftSlides?: CraftSlide[];
}

async function fetchKioskData(): Promise<{
  products: Product[];
  categories: MenuCategory[];
  craftSlides: CraftSlide[];
  ok: boolean;
}> {
  const bust = Date.now();
  const [productsRes, categoriesRes, slidesRes] = await Promise.all([
    fetch(`/api/products?_=${bust}`, { cache: "no-store" }),
    fetch(`/api/categories?_=${bust}`, { cache: "no-store" }),
    fetch(`/api/craft-slides?_=${bust}`, { cache: "no-store" }),
  ]);

  const productsData = productsRes.ok ? await productsRes.json() : null;
  const categoriesData = categoriesRes.ok ? await categoriesRes.json() : null;
  const slidesData = slidesRes.ok ? await slidesRes.json() : null;

  return {
    products: Array.isArray(productsData) ? productsData : [],
    categories: Array.isArray(categoriesData) ? categoriesData : [],
    craftSlides: Array.isArray(slidesData) ? slidesData : [],
    ok: productsRes.ok && categoriesRes.ok && slidesRes.ok,
  };
}

export function CustomerKiosk({
  initialProducts,
  initialCategories,
  initialCraftSlides,
}: CustomerKioskProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [categories, setCategories] = useState<MenuCategory[]>(
    initialCategories ?? []
  );
  const [craftSlides, setCraftSlides] = useState<CraftSlide[]>(
    initialCraftSlides?.length ? initialCraftSlides : DEFAULT_CRAFT_SLIDES
  );
  const [activeNav, setActiveNav] = useState<NavCategory>("home");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loadFailed, setLoadFailed] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchKioskData();

      setProducts((prev) => {
        const nextProducts = data.products.length > 0 ? data.products : prev;
        setCategories((prevCats) => {
          const nextCategories =
            data.categories.length > 0 ? data.categories : prevCats;
          setLoadFailed(nextProducts.length === 0 && nextCategories.length === 0);
          return nextCategories;
        });
        if (data.products.length > 0 || data.categories.length > 0) {
          setRefreshKey((k) => k + 1);
        }
        if (data.craftSlides.length > 0) {
          setCraftSlides(data.craftSlides);
        }
        return nextProducts;
      });
    } catch {
      setProducts((prev) => {
        setCategories((prevCats) => {
          setLoadFailed(prev.length === 0 && prevCats.length === 0);
          return prevCats;
        });
        return prev;
      });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    useCartStore.persist.rehydrate();

    const { serviceType, setShowServiceModal } = useCartStore.getState();
    if (!serviceType) {
      setShowServiceModal(true);
    }

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
      window.removeEventListener("focus", onRefresh);
    };
  }, [refresh]);

  const handleNavChange = (nav: NavCategory) => {
    setActiveNav(nav);
    const cat = NAV_TO_CATEGORY[nav];
    if (cat) setActiveCategory(cat);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const nav = CATEGORY_TO_NAV[cat];
    if (nav) setActiveNav(nav);
  };

  const showDbWarning =
    loadFailed && products.length === 0 && categories.length === 0;

  return (
    <div className="relative min-h-screen">
      {showDbWarning && (
        <div className="relative z-50 border-b border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
          Menu could not load. Check your connection or{" "}
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing}
            className="font-semibold underline disabled:opacity-60"
          >
            {refreshing ? "Retrying…" : "try again"}
          </button>
          .
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
          craftSlides={craftSlides}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
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
