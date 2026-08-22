"use client";

import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MenuCategory, Product, CraftSlide } from "@/lib/types";
import { getCarouselCategories } from "@/lib/categories";
import { DEFAULT_CRAFT_SLIDES } from "@/lib/craft-slides";
import { resolveCustomerMediaUrl } from "@/lib/media-url";
import { CategoryImage } from "@/components/customer/CategoryImage";
import {
  CategoryBrowseView,
  HomeFullMenu,
  SearchResults,
} from "@/components/customer/CategoryBrowseView";
import { HomePremiumView } from "@/components/customer/HomePremiumView";
import { useCartStore } from "@/lib/store";
import {
  IconCoffeeCup,
  IconHotDrink,
  IconIcedDrink,
  IconMerchandise,
  IconPastry,
  IconSandwich,
  IconSearch,
  IconSnack,
  IconSparkle,
  IconSun,
} from "@/components/icons/BrewedIcons";

const CATEGORY_FALLBACK: Record<
  string,
  ComponentType<{ size?: number; className?: string }>
> = {
  all: IconCoffeeCup,
  popular: IconSparkle,
  "hot-drinks": IconHotDrink,
  "iced-coffee": IconIcedDrink,
  "non-coffee": IconHotDrink,
  specials: IconSparkle,
  pastries: IconPastry,
  sandwiches: IconSandwich,
  snacks: IconSnack,
  merchandise: IconMerchandise,
};

const CATEGORY_PILL_BG: Record<string, string> = {
  all: "bg-[#D8E8D4]",
  popular: "bg-[#EDE4D6]",
  "hot-drinks": "bg-[#E8D0C8]",
  "iced-coffee": "bg-[#DCE8EF]",
  "non-coffee": "bg-[#EDE4D6]",
  specials: "bg-[#EDE4D6]",
  pastries: "bg-[#EDE4D6]",
};

interface MenuAreaProps {
  products: Product[];
  categories: MenuCategory[];
  craftSlides?: CraftSlide[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function MenuArea({
  products,
  categories,
  craftSlides = DEFAULT_CRAFT_SLIDES,
  activeCategory,
  onCategoryChange,
}: MenuAreaProps) {
  const { searchQuery, setSearchQuery, addItem, customer } = useCartStore();
  const [showFullMenu, setShowFullMenu] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowFullMenu(false);
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    if (activeCategory !== "all" || showFullMenu) {
      contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeCategory, showFullMenu]);

  const handleCategorySelect = (catId: string) => {
    onCategoryChange(catId);
  };

  const scrollCategories = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -140 : 140,
      behavior: "smooth",
    });
  };

  const carouselCategories = getCarouselCategories(categories);

  const categoryProducts = products.filter((p) => {
    if (p.available === false) return false;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeCategory === "all") return true;
    if (activeCategory === "popular") return p.popular;
    return p.category === activeCategory;
  });

  const isHomeView =
    activeCategory === "all" && !searchQuery && !showFullMenu;

  const showHomeHero = activeCategory === "all" && !searchQuery;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning!" : hour < 17 ? "Good afternoon!" : "Good evening!";

  return (
    <main className="menu-surface relative min-w-0 flex-1 overflow-x-visible px-2 py-2 xl:px-1">
      {showHomeHero && (
      <div className="premium-home-hero relative mb-8 mt-3 w-full px-1 sm:mt-4 xl:mt-5">
        <div className="relative z-10 px-2 sm:px-3">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="max-w-xl">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#F2DABA]">
                {greeting}
                <IconSun size={16} className="text-[#C9A84C]" />
              </p>
              <h1 className="font-serif text-2xl leading-[1.15] text-[#FAF7F2] sm:text-3xl md:text-[2rem] lg:text-[2.25rem]">
                Handcrafted Moments,
                <br />
                <span className="italic">Made for You.</span>
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#E8DCC8]/90">
                Discover premium coffee and cozy bites, crafted with care and
                served with warmth.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur-md sm:px-4">
              <span className="text-sm text-[#C9A84C]">★</span>
              <span className="font-semibold text-[#FAF7F2]">{customer.points} Points</span>
              <span className="hidden text-[#FAF7F2]/70 sm:inline">·</span>
              <span className="hidden text-[#FAF7F2]/70 sm:inline">{customer.tier}</span>
            </div>
          </div>

          <div className="premium-search mr-0 flex max-w-xl items-center gap-2 rounded-[22px] px-4 py-3 sm:mr-8">
            <IconSearch size={18} className="shrink-0 text-[#8B7355]/60" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#3E2723] outline-none placeholder:text-[#8B7355]/55"
            />
          </div>
        </div>

        <div className="relative z-20 mt-5 px-1">
          <CategoryPillsRow
            carouselCategories={carouselCategories}
            activeCategory={activeCategory}
            scrollRef={scrollRef}
            onScroll={scrollCategories}
            onSelect={handleCategorySelect}
          />
        </div>
      </div>
      )}

      {!showHomeHero && (
        <div className="relative z-20 mb-6 mt-4 px-1 sm:mt-6">
          <CategoryPillsRow
            carouselCategories={carouselCategories}
            activeCategory={activeCategory}
            scrollRef={scrollRef}
            onScroll={scrollCategories}
            onSelect={handleCategorySelect}
          />
        </div>
      )}

      <div ref={contentRef} className={`px-0.5 ${showHomeHero ? "mt-3" : "mt-0"}`}>
      {searchQuery ? (
        <SearchResults
          query={searchQuery}
          products={categoryProducts}
          onAdd={addItem}
        />
      ) : isHomeView ? (
        <HomePremiumView
          products={products}
          craftSlides={craftSlides}
          onAdd={addItem}
          onViewAll={() => setShowFullMenu(true)}
          onCategoryChange={handleCategorySelect}
        />
      ) : activeCategory === "all" && showFullMenu ? (
        <HomeFullMenu
          products={products.filter((p) => p.available !== false)}
          categories={categories}
          onAdd={addItem}
        />
      ) : (
        <CategoryBrowseView
          categoryId={activeCategory}
          categories={categories}
          products={categoryProducts}
          showFullMenu={showFullMenu}
          onViewAll={() => setShowFullMenu(true)}
          onAdd={addItem}
        />
      )}
      </div>
    </main>
  );
}

function CategoryPillsRow({
  carouselCategories,
  activeCategory,
  scrollRef,
  onScroll,
  onSelect,
}: {
  carouselCategories: MenuCategory[];
  activeCategory: string;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  onScroll: (direction: "left" | "right") => void;
  onSelect: (catId: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onScroll("left")}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#6E5D4F] shadow-sm backdrop-blur-sm"
        aria-label="Scroll categories left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div className="flex min-w-0 flex-1 justify-center overflow-hidden">
        <div
          ref={scrollRef}
          className="flex max-w-full justify-center gap-2.5 overflow-x-auto scrollbar-hide py-1"
        >
          {carouselCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const FallbackIcon = CATEGORY_FALLBACK[cat.id] ?? IconCoffeeCup;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelect(cat.id)}
                className={`category-pill flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-[24px] px-1.5 py-2 shadow-sm ${
                  isActive
                    ? "bg-[#C99E92] text-white"
                    : CATEGORY_PILL_BG[cat.id] ?? "bg-[#F5EDE3] text-[#2A1E17]"
                }`}
              >
                <div className="category-pill-icon relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#F5F0E8] shadow-[inset_0_1px_2px_rgba(62,48,39,0.06)]">
                  {cat.image ? (
                    <CategoryImage
                      src={resolveCustomerMediaUrl(cat.image)}
                      alt={cat.label}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FallbackIcon
                        size={20}
                        className={isActive ? "text-white" : "text-[#6E5D4F]"}
                      />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-medium leading-tight">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onScroll("right")}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#6E5D4F] shadow-sm backdrop-blur-sm"
        aria-label="Scroll categories right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
