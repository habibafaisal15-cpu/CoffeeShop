"use client";

import { useRef, useState } from "react";
import { Crown, Leaf, Plus, Sparkles, Truck } from "lucide-react";
import { CraftSlide, Product } from "@/lib/types";
import { PRODUCT_IMAGES } from "@/lib/data";
import { resolveCustomerMediaUrl } from "@/lib/media-url";
import { formatPKR } from "@/lib/store";
import { IconCoffeeCup } from "@/components/icons/BrewedIcons";

const EXPERIENCE_IMAGE =
  "https://images.unsplash.com/photo-1461023058943-07fbe6c704ea?auto=format&fit=crop&w=800&q=80";
const BEANS_IMAGE =
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=400&q=80";

interface HomePremiumViewProps {
  products: Product[];
  craftSlides: CraftSlide[];
  onAdd: (productId: string) => void;
  onViewAll: () => void;
  onCategoryChange: (cat: string) => void;
}

export function HomePremiumView({
  products,
  craftSlides,
  onAdd,
  onViewAll,
  onCategoryChange,
}: HomePremiumViewProps) {
  const bestSellers = products
    .filter((p) => p.available !== false && p.popular)
    .slice(0, 6);
  const displayItems =
    bestSellers.length > 0
      ? bestSellers
      : products.filter((p) => p.available !== false).slice(0, 6);

  const featuredSlide = craftSlides[0];

  return (
    <div className="premium-home pb-8">
      <div className="xl:grid xl:grid-cols-[1fr_min(340px,32%)] xl:items-start xl:gap-5">
        <section className="premium-panel mb-5 p-4 sm:p-5 xl:mb-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-[#C9A84C]" strokeWidth={2.2} />
              <h2 className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-[#3E2723]">
                Our Best Sellers
              </h2>
            </div>
            <button
              type="button"
              onClick={onViewAll}
              className="text-[11px] font-semibold text-[#5C4A3D]/80 transition hover:text-[#3E2723]"
            >
              View all →
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">
            {displayItems.map((product, index) => (
              <BestSellerCard
                key={product.id}
                product={product}
                featured={index === 0}
                onAdd={() => onAdd(product.id)}
              />
            ))}
          </div>
        </section>

        <BrewedExperiencePanel
          slide={featuredSlide}
          onExplore={() => onCategoryChange(featuredSlide?.category ?? "coffee")}
        />
      </div>

      <TasteProfileBar />

      {craftSlides.length > 1 && (
        <CraftHighlights
          slides={craftSlides.slice(1)}
          onCategoryChange={onCategoryChange}
        />
      )}
    </div>
  );
}

function BestSellerCard({
  product,
  featured,
  onAdd,
}: {
  product: Product;
  featured?: boolean;
  onAdd: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const imageUrl = product.image?.trim()
    ? resolveCustomerMediaUrl(product.image.trim())
    : PRODUCT_IMAGES[product.id] ?? "";

  return (
    <article className="best-seller-card group relative min-w-[168px] shrink-0 sm:min-w-0">
      {featured && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-[#3E4A38] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#F2DABA]">
          #1 Best Seller
        </span>
      )}
      <div className="overflow-hidden rounded-[20px] bg-[#F5F0E8] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="aspect-square w-full overflow-hidden bg-[#EDE4D6]">
          {!imageUrl || failed ? (
            <div className="flex h-full w-full items-center justify-center">
              <IconCoffeeCup size={36} className="text-[#5C4A3D]/25" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setFailed(true)}
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-[#3E2723] sm:text-[11px]">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-[#6E5D4F]">
            {product.description || "Freshly prepared with care."}
          </p>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className="font-serif text-sm font-bold text-[#3E2723]">
              {formatPKR(product.price)}
            </span>
            <button
              type="button"
              onClick={onAdd}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6B7F63] text-white shadow-sm transition hover:bg-[#5A6D53] active:scale-95"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function BrewedExperiencePanel({
  slide,
  onExplore,
}: {
  slide?: CraftSlide;
  onExplore: () => void;
}) {
  const image = slide?.image
    ? resolveCustomerMediaUrl(slide.image)
    : EXPERIENCE_IMAGE;

  return (
    <section className="premium-panel overflow-hidden p-4 sm:p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8B7355]">
        The Brewed Experience
      </p>
      <h3 className="mt-1 font-serif text-xl leading-snug text-[#3E2723] sm:text-2xl">
        Thoughtfully Delivered,
        <br />
        Perfectly Yours.
      </h3>

      <div className="relative mt-4 overflow-hidden rounded-[22px] shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt="Brewed experience"
          loading="lazy"
          decoding="async"
          className="aspect-[4/3] w-full object-cover"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[#E8DDD0] pt-4">
        <ExperiencePillar
          icon={<Leaf className="h-4 w-4" />}
          title="Sourced with Care"
          text="Ethically chosen beans & fresh ingredients."
        />
        <ExperiencePillar
          icon={<Sparkles className="h-4 w-4" />}
          title="Brewed to Perfection"
          text="Crafted by skilled baristas."
        />
        <ExperiencePillar
          icon={<Truck className="h-4 w-4" />}
          title="Delivered with Love"
          text="Pickup or delivery, always warm."
        />
      </div>

      {slide && (
        <button
          type="button"
          onClick={onExplore}
          className="mt-4 w-full rounded-full bg-[#6B7F63] py-2.5 text-xs font-semibold text-white transition hover:bg-[#5A6D53]"
        >
          {slide.cta}
        </button>
      )}
    </section>
  );
}

function ExperiencePillar({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE4D6]/80 text-[#5C4A3D]">
        {icon}
      </div>
      <p className="text-[9px] font-bold uppercase tracking-wide text-[#3E2723]">
        {title}
      </p>
      <p className="mt-0.5 text-[8px] leading-snug text-[#6E5D4F]">{text}</p>
    </div>
  );
}

function TasteProfileBar() {
  const items = [
    {
      label: "Aroma",
      text: "Rich & inviting fragrance",
      icon: "☁",
    },
    {
      label: "Body",
      text: "Smooth, velvety texture",
      icon: "◉",
    },
    {
      label: "Flavor",
      text: "Balanced & bold notes",
      icon: "✦",
    },
    {
      label: "Finish",
      text: "Clean, lasting warmth",
      icon: "◎",
    },
  ];

  return (
    <section className="premium-panel mt-5 overflow-hidden p-4 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="shrink-0 lg:max-w-[200px]">
          <p className="font-serif text-2xl italic leading-tight text-[#3E2723] sm:text-3xl">
            Rich. Smooth.
            <br />
            Unforgettable.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <span className="text-lg text-[#8B7355]">{item.icon}</span>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#3E2723]">
                {item.label}
              </p>
              <p className="mt-0.5 text-[10px] text-[#6E5D4F]">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="hidden h-20 w-20 shrink-0 overflow-hidden rounded-2xl shadow-md lg:block xl:h-24 xl:w-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BEANS_IMAGE}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function CraftHighlights({
  slides,
  onCategoryChange,
}: {
  slides: CraftSlide[];
  onCategoryChange: (cat: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="mt-5">
      <p className="mb-3 text-center font-serif text-sm italic text-[#F2DABA]/90">
        Every cup tells a story of carefully sourced beans and fresh bakes.
      </p>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        {slides.map((slide) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => onCategoryChange(slide.category)}
            className="group relative min-w-[220px] shrink-0 overflow-hidden rounded-[24px] shadow-lg sm:min-w-[260px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveCustomerMediaUrl(slide.image)}
              alt={slide.badge}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E17]/90 via-[#2A1E17]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <p className="text-[9px] font-semibold uppercase tracking-wider text-[#C99E92]">
                {slide.eyebrow}
              </p>
              <p className="mt-1 font-serif text-base text-[#FAF7F2]">
                {slide.badge}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
