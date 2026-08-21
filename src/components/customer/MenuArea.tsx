"use client";

import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MenuCategory, Product } from "@/lib/types";
import { getCarouselCategories } from "@/lib/categories";
import { PRODUCT_IMAGES } from "@/lib/data";
import { resolveCustomerMediaUrl } from "@/lib/media-url";
import { CategoryImage } from "@/components/customer/CategoryImage";
import { formatPKR, useCartStore } from "@/lib/store";
import {
  IconCoffeeCup,
  IconFilter,
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

const BAKE_CARD_COLORS = ["#8EB67D", "#E8C4BC", "#D5F1D1"] as const;

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
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function MenuArea({
  products,
  categories,
  activeCategory,
  onCategoryChange,
}: MenuAreaProps) {
  const { searchQuery, setSearchQuery, addItem, customer } = useCartStore();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -140 : 140,
      behavior: "smooth",
    });
  };

  const carouselCategories = getCarouselCategories(categories);

  const filtered = products.filter((p) => {
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

  const popularPicks =
    activeCategory === "all"
      ? products.filter((p) => p.available !== false && p.popular)
      : filtered.filter((p) => p.popular);

  const isHomeView = activeCategory === "all" && !searchQuery;
  const homePopularItems = (popularPicks.length ? popularPicks : filtered.slice(0, 6)).slice(
    0,
    6
  );

  const sweetTreats = filtered.filter(
    (p) => p.category === "pastries" || p.category === "snacks"
  );
  const otherItems = filtered.filter(
    (p) => !popularPicks.includes(p) && !sweetTreats.includes(p)
  );

  const sections = [
    {
      title: "Popular Picks",
      icon: true,
      viewAll: true,
      items: popularPicks.length ? popularPicks : filtered.slice(0, 5),
    },
    {
      title: "Sweet Treats",
      icon: true,
      viewAll: false,
      items: sweetTreats.length ? sweetTreats : [],
    },
    {
      title: "More to Explore",
      icon: false,
      viewAll: false,
      items: otherItems,
    },
  ].filter((s) => s.items.length > 0);

  const catalogSections = isHomeView ? [] : sections;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning!" : hour < 17 ? "Good afternoon!" : "Good evening!";

  return (
    <main className="menu-surface relative min-w-0 flex-1 overflow-x-visible px-2 py-2 xl:px-1">
      <div className="hero-panel relative mb-12 mt-4 w-full max-w-[calc(100%-1.25rem)] overflow-visible rounded-[40px] px-5 py-3 shadow-sm sm:max-w-[calc(100%-2rem)] sm:rounded-[44px] sm:px-6 sm:py-4 xl:mt-6 xl:max-w-[calc(100%-4rem)] xl:rounded-[48px]">
        <div className="relative z-10">
        <div className="absolute right-4 top-0 z-20 flex items-center gap-2 rounded-2xl border border-[#DFCFC0] bg-[#DDD0C2]/95 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur-sm sm:px-4">
          <span className="text-sm text-[#C9A84C]">★</span>
          <span className="font-semibold text-[#2A1E17]">{customer.points} Points</span>
          <span className="hidden text-[#3E3027]/70 sm:inline">·</span>
          <span className="hidden text-[#3E3027]/70 sm:inline">{customer.tier} Member</span>
        </div>

        <div className="pl-3 sm:pl-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#3E2723]">
          {greeting}
          <IconSun size={16} className="text-[#C9A84C]" />
        </p>

        <h1 className="max-w-md pr-28 font-serif text-xl font-medium uppercase leading-[1.05] tracking-wide text-[#3E2723] sm:pr-36 md:text-2xl lg:max-w-xl lg:pr-44 lg:text-[1.75rem]">
          Find your perfect
          <br />
          cup of happiness.
        </h1>

        <p className="mt-2 font-serif text-sm italic text-[#7D6B5D]">
          Made with love, just for you.
        </p>
        </div>

        <div className="mt-3 mr-8 max-w-[calc(100%-2rem)] flex items-center gap-2 rounded-[22px] border border-[#F5EAE0] bg-[#FFF8F2] px-4 py-3 shadow-[0_2px_10px_rgba(92,74,62,0.04)] sm:mt-4 sm:mr-12 sm:max-w-[calc(100%-3rem)] sm:px-5 xl:mr-20 xl:max-w-[calc(100%-4.5rem)]">
          <IconSearch size={18} className="shrink-0 text-[#B8956E]/50" />
          <input
            type="text"
            placeholder="Search your favorite..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm text-[#6B5344] outline-none placeholder:text-[#C4A88A]/70"
          />
          <div className="ml-1 flex shrink-0 items-center border-l border-[#F0E4D8]/80 pl-3">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-[14px] bg-[#FFF3EA] px-2.5 py-1.5 text-sm font-medium text-[#6B5344] transition hover:bg-[#FAEDE4]"
            >
              <IconFilter size={18} />
              Filters
            </button>
          </div>
        </div>
        </div>

        {/* Category pills — directly under search; half on box, half on sage bg */}
        <div className="relative z-20 mt-3 -mb-10 px-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCategories("left")}
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
                    onClick={() => onCategoryChange(cat.id)}
                    className={`flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-[24px] px-1.5 py-2 shadow-sm transition ${
                      isActive
                        ? "bg-[#C99E92] text-white"
                        : CATEGORY_PILL_BG[cat.id] ?? "bg-[#F5EDE3] text-[#2A1E17]"
                    }`}
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#F5F0E8] shadow-[inset_0_1px_2px_rgba(62,48,39,0.06)]">
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
              onClick={() => scrollCategories("right")}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/60 bg-white/70 text-[#6E5D4F] shadow-sm backdrop-blur-sm"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 px-0.5">
      {isHomeView ? (
        <>
          {homePopularItems.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="menu-section-title font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#F2DABA]">
                  Popular Picks
                </h2>
                <button
                  type="button"
                  onClick={() => onCategoryChange("popular")}
                  className="menu-section-title text-xs font-semibold text-[#F2DABA]/90 transition hover:text-[#FAE8D0]"
                >
                  View all →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 md:gap-x-5">
                {homePopularItems.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    color={BAKE_CARD_COLORS[index % BAKE_CARD_COLORS.length]}
                    onAdd={() => addItem(product.id)}
                  />
                ))}
              </div>
            </section>
          )}

          <CraftFeatureSection onCategoryChange={onCategoryChange} />
        </>
      ) : (
        catalogSections.map((section) => (
          <section key={section.title} className="mb-8 last:mb-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="menu-section-title font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#F2DABA]">
                {section.title}
              </h2>
              {section.viewAll && (
                <button
                  type="button"
                  onClick={() => onCategoryChange("popular")}
                  className="menu-section-title text-xs font-semibold text-[#F2DABA]/90 transition hover:text-[#FAE8D0]"
                >
                  View all →
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 md:gap-x-5">
              {section.items.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  color={BAKE_CARD_COLORS[index % BAKE_CARD_COLORS.length]}
                  onAdd={() => addItem(product.id)}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {!isHomeView && filtered.length === 0 && (
        <div className="py-12 text-center text-sm text-[#F5EDE4]/80">
          No items found. Try a different search or category.
        </div>
      )}
      </div>
    </main>
  );
}

function menuImageSources(product: Product): string[] {
  if (product.image?.trim()) {
    return [resolveCustomerMediaUrl(product.image.trim())];
  }

  const staticImage = PRODUCT_IMAGES[product.id];
  return staticImage ? [staticImage] : [];
}

const CRAFT_SLIDES = [
  {
    eyebrow: "BREWED COUNTER",
    title: "Fresh from the Oven — Signature Bakes & Cakes",
    description:
      "Handcrafted daily using organic cocoa, fresh espresso, and premium butter with 24 hours' notice for custom orders.",
    cta: "Explore Signature Bakes",
    category: "pastries",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    badge: "SIGNATURE CAKES",
  },
  {
    eyebrow: "BREWED BAR",
    title: "Slow-Brewed Coffees — Rich & Smooth",
    description:
      "Single-origin beans, carefully roasted and brewed to bring out deep aroma, velvety crema, and a perfectly balanced cup.",
    cta: "Explore Brewed Coffees",
    category: "coffee",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
    badge: "BREWED COFFEES",
  },
  {
    eyebrow: "MORNING FLUFF",
    title: "Fluffy Pancakes — Light, Golden & Warm",
    description:
      "Stacked high with maple drizzle, seasonal berries, and whipped butter — the cosiest start to your day.",
    cta: "Explore Pancakes",
    category: "pastries",
    image:
      "https://images.unsplash.com/photo-1528207773046-07fe16dae284?auto=format&fit=crop&w=900&q=80",
    badge: "FLUFFY PANCAKES",
  },
] as const;

function CraftFeatureSection({
  onCategoryChange,
}: {
  onCategoryChange: (cat: string) => void;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % CRAFT_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const slide = CRAFT_SLIDES[active];

  return (
    <>
      <div className="mx-auto mb-6 max-w-xl px-4 text-center">
        <p className="menu-section-title text-xs font-semibold uppercase tracking-[0.22em] text-[#F2DABA]/90">
          OUR CRAFT
        </p>
        <p className="menu-section-title mt-3 font-serif text-xl italic leading-relaxed tracking-[0.02em] text-[#F2DABA] sm:text-2xl">
          Every cup tells a story of carefully sourced beans and fresh bakes.
        </p>
      </div>

      <div className="mx-6 my-8 overflow-hidden rounded-[36px] bg-[#2A1E17] p-8 text-[#FAF7F2] shadow-xl md:p-12">
        <div key={active} className="craft-slide-in flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="w-full md:max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#C99E92]">
              {slide.eyebrow}
            </p>
            <h3 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
              {slide.title}
            </h3>
            <p className="mt-3 max-w-md text-sm text-[#D8C7B5]">{slide.description}</p>

            <div className="my-6 flex gap-2">
              {CRAFT_SLIDES.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === active
                      ? "w-6 bg-[#A1B099]"
                      : "w-2 bg-[#FAF7F2]/25 hover:bg-[#FAF7F2]/45"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => onCategoryChange(slide.category)}
              className="rounded-full bg-[#A1B099] px-6 py-3 text-sm font-semibold text-[#2A1E17] transition-all hover:bg-[#8CA086]"
            >
              {slide.cta}
            </button>
          </div>

          <div className="relative h-72 w-full overflow-hidden rounded-[28px] shadow-md md:h-80 md:w-1/2">
            <img
              src={resolveCustomerMediaUrl(slide.image)}
              alt={slide.badge}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-md">
              {slide.badge}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductCard({
  product,
  color,
  onAdd,
}: {
  product: Product;
  color: string;
  onAdd: () => void;
}) {
  const sources = menuImageSources(product);
  const [sourceIndex, setSourceIndex] = useState(0);
  const imageSrc = sources[sourceIndex];
  const showFallback = sources.length === 0 || sourceIndex >= sources.length;

  return (
    <article className="relative w-full pt-6 sm:pt-7">
      {/* Single colored card — photo inside, thora upar overlap (BakeTime reference) */}
      <div
        className="bake-card relative flex w-full flex-col items-center overflow-visible rounded-[1.85rem] px-3 pb-4 shadow-[0_10px_28px_rgba(34,23,20,0.18)] sm:rounded-[2rem] sm:px-3.5 sm:pb-5"
        style={{ backgroundColor: color }}
      >
        <div className="relative z-10 -mt-9 mb-2 w-[88%] overflow-hidden rounded-[1.1rem] shadow-[0_10px_22px_rgba(34,23,20,0.26)] sm:-mt-10 sm:mb-2.5 sm:w-[86%] sm:rounded-[1.2rem]">
          <div className="aspect-square w-full">
            {showFallback ? (
              <div className="flex h-full w-full items-center justify-center bg-[#e8e0d8]">
                <IconCoffeeCup size={40} className="text-[#221714]/25" />
              </div>
            ) : (
              <img
                src={imageSrc}
                alt={product.name}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
                onError={() => setSourceIndex((i) => i + 1)}
              />
            )}
          </div>
        </div>

        <div className="w-full px-1 text-center">
          <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#221714] sm:text-xs">
            {product.name}
          </h3>
          <p className="mt-1 font-sans text-[11px] font-bold text-[#221714] sm:text-xs">
            {formatPKR(product.price)}
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="bake-card-cta mt-2.5 w-full rounded-full py-2 text-[10px] font-semibold tracking-wide text-[#F5EDE4] sm:mt-3 sm:py-2.5 sm:text-[11px]"
          aria-label={`Add ${product.name} to cart`}
        >
          ADD TO CART
          </button>
        </div>
      </div>
    </article>
  );
}
