"use client";

import { useState } from "react";
import { Leaf, Sparkles } from "lucide-react";
import { MenuCategory, Product } from "@/lib/types";
import { getCategoryLabel } from "@/lib/categories";
import { getCategoryStory } from "@/lib/category-stories";
import { resolveCustomerMediaUrl } from "@/lib/media-url";
import { CategoryImage } from "@/components/customer/CategoryImage";
import { formatPKR } from "@/lib/store";
import { IconCoffeeCup } from "@/components/icons/BrewedIcons";

const BAKE_CARD_COLORS = ["#8EB67D", "#E8C4BC", "#D5F1D1", "#C5D4BC", "#E2CFC4", "#D0E8CC"] as const;

const CATEGORY_TAGLINES: Record<string, string> = {
  all: "Every cup, every bite — crafted with care.",
  popular: "The favorites our guests order again and again.",
  coffee: "Rich roasts and signature espresso pours.",
  "hot-drinks": "Steaming comfort in every sip.",
  "iced-coffee": "Chilled, bold, and beautifully balanced.",
  "non-coffee": "Delicious sips without the caffeine kick.",
  specials: "Limited-time creations worth savoring.",
  pastries: "Fresh from the oven, made to delight.",
  sandwiches: "Hearty bites for any time of day.",
  snacks: "Light treats to pair with your drink.",
  merchandise: "Take the Brewed experience home.",
};

interface SearchResultsProps {
  query: string;
  products: Product[];
  onAdd: (productId: string) => void;
}

export function SearchResults({ query, products, onAdd }: SearchResultsProps) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-lg text-[#F2DABA]/90">No matches found</p>
        <p className="mt-2 text-sm text-[#F5EDE4]/70">
          Try a different search term or browse a category.
        </p>
      </div>
    );
  }

  return (
    <section className="category-browse-in pb-6">
      <div className="mb-6">
        <h2 className="menu-section-title font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#F2DABA]">
          Search Results
        </h2>
        <p className="mt-1 font-serif text-sm italic text-[#F2DABA]/75">
          {products.length} {products.length === 1 ? "item" : "items"} for &ldquo;{query}&rdquo;
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 md:gap-x-5">
        {products.map((product, index) => (
          <PremiumProductCard
            key={product.id}
            product={product}
            color={BAKE_CARD_COLORS[index % BAKE_CARD_COLORS.length]}
            onAdd={() => onAdd(product.id)}
          />
        ))}
      </div>
    </section>
  );
}

interface CategoryBrowseViewProps {
  categoryId: string;
  categories: MenuCategory[];
  products: Product[];
  showFullMenu: boolean;
  onViewAll: () => void;
  onAdd: (productId: string) => void;
}

export function CategoryBrowseView({
  categoryId,
  categories,
  products,
  showFullMenu,
  onViewAll,
  onAdd,
}: CategoryBrowseViewProps) {
  const label = getCategoryLabel(categories, categoryId);
  const tagline =
    CATEGORY_TAGLINES[categoryId] ?? "Handpicked favorites from our kitchen.";
  const meta = categories.find((c) => c.id === categoryId);
  const story = getCategoryStory(categoryId);

  const bestSellers = pickBestSellers(products, 6);
  const bestSellerIds = new Set(bestSellers.map((p) => p.id));
  const remaining = products.filter((p) => !bestSellerIds.has(p.id));

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-serif text-lg text-[#F2DABA]/90">Nothing here yet</p>
        <p className="mt-2 text-sm text-[#F5EDE4]/70">
          Try another category or clear your search.
        </p>
      </div>
    );
  }

  return (
    <div className="category-browse-in pb-6">
      <CategoryFancyHeader
        label={label}
        tagline={tagline}
        itemCount={products.length}
        image={meta?.image}
      />

      <div className="mb-8 grid gap-4 xl:grid-cols-2">
        <CategoryStoryCard
          title="How We Make It"
          icon={<Leaf className="h-4 w-4" />}
          body={story.howWeMake}
        />
        <CategoryTasteCard
          headline={story.tasteHeadline}
          taste={story.taste}
        />
      </div>

      <section className="mb-10">
        <SectionHeader
          title="Best Sellers"
          subtitle="Top picks in this collection"
          action={
            !showFullMenu && products.length > bestSellers.length ? (
              <button
                type="button"
                onClick={onViewAll}
                className="menu-section-title text-xs font-semibold text-[#F2DABA]/90 transition hover:text-[#FAE8D0]"
              >
                View all →
              </button>
            ) : null
          }
        />

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 md:gap-x-5">
          {bestSellers.map((product, index) => (
            <PremiumProductCard
              key={product.id}
              product={product}
              color={BAKE_CARD_COLORS[index % BAKE_CARD_COLORS.length]}
              featured={index === 0}
              onAdd={() => onAdd(product.id)}
            />
          ))}
        </div>
      </section>

      {showFullMenu && remaining.length > 0 && (
        <section className="mb-6">
          <SectionHeader
            title="Full Menu"
            subtitle={`Everything in ${label}`}
          />
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 md:gap-x-5">
            {remaining.map((product, index) => (
              <PremiumProductCard
                key={product.id}
                product={product}
                color={BAKE_CARD_COLORS[(index + 2) % BAKE_CARD_COLORS.length]}
                onAdd={() => onAdd(product.id)}
              />
            ))}
          </div>
        </section>
      )}

      {showFullMenu && remaining.length === 0 && products.length > 0 && (
        <section className="mb-6">
          <SectionHeader title="Full Menu" subtitle={`Everything in ${label}`} />
          <p className="text-center text-sm text-[#F5EDE4]/75">
            All items are featured above in Best Sellers.
          </p>
        </section>
      )}
    </div>
  );
}

interface HomeFullMenuProps {
  products: Product[];
  categories: MenuCategory[];
  onAdd: (productId: string) => void;
}

export function HomeFullMenu({ products, categories, onAdd }: HomeFullMenuProps) {
  const groups = categories
    .filter((c) => c.id !== "all" && c.id !== "popular" && c.visible)
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.category === cat.id && p.available !== false),
    }))
    .filter((g) => g.items.length > 0);

  const uncategorized = products.filter(
    (p) =>
      p.available !== false &&
      !groups.some((g) => g.items.some((item) => item.id === p.id))
  );

  if (groups.length === 0 && uncategorized.length === 0) return null;

  return (
    <section className="category-browse-in mb-8 mt-2">
      <SectionHeader
        title="Full Menu"
        subtitle="Browse everything we serve"
      />
      <div className="space-y-10">
        {groups.map(({ category, items }) => (
          <div key={category.id}>
            <h3 className="mb-4 font-serif text-lg italic text-[#F2DABA]">
              {category.label}
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 md:gap-x-5">
              {items.map((product, index) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  color={BAKE_CARD_COLORS[index % BAKE_CARD_COLORS.length]}
                  onAdd={() => onAdd(product.id)}
                />
              ))}
            </div>
          </div>
        ))}
        {uncategorized.length > 0 && (
          <div>
            <h3 className="mb-4 font-serif text-lg italic text-[#F2DABA]">
              More Items
            </h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-9 md:gap-x-5">
              {uncategorized.map((product, index) => (
                <PremiumProductCard
                  key={product.id}
                  product={product}
                  color={BAKE_CARD_COLORS[index % BAKE_CARD_COLORS.length]}
                  onAdd={() => onAdd(product.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryFancyHeader({
  label,
  tagline,
  itemCount,
  image,
}: {
  label: string;
  tagline: string;
  itemCount: number;
  image?: string;
}) {
  return (
    <header className="category-fancy-header relative mb-4 overflow-hidden rounded-[24px] shadow-[0_20px_48px_rgba(34,23,20,0.22)] sm:mb-6 sm:rounded-[32px]">
      {image ? (
        <div className="absolute inset-0">
          <CategoryImage src={resolveCustomerMediaUrl(image)} alt={label} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A1E17]/92 via-[#2A1E17]/78 to-[#3E3027]/55" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#3E4A38] via-[#2A1E17] to-[#3E3027]" />
      )}

      <div className="relative z-10 flex min-h-[150px] flex-col justify-end p-5 sm:min-h-[200px] sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C99E92]">
          Collection
        </p>
        <h1 className="mt-2 font-serif text-2xl leading-tight text-[#FAF7F2] sm:text-4xl md:text-[2.6rem]">
          {label}
        </h1>
        <p className="mt-2 max-w-xl font-serif text-sm italic leading-relaxed text-[#E8DCC8]/95 sm:text-base">
          {tagline}
        </p>
        <span className="mt-4 inline-flex w-fit rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[11px] font-medium text-[#FAF7F2] backdrop-blur-md">
          {itemCount} {itemCount === 1 ? "item" : "items"} in this collection
        </span>
      </div>
    </header>
  );
}

function CategoryStoryCard({
  title,
  icon,
  body,
}: {
  title: string;
  icon: React.ReactNode;
  body: string;
}) {
  return (
    <div className="category-story-panel p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE4D6] text-[#5C4A3D]">
          {icon}
        </span>
        <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#3E2723]">
          {title}
        </h3>
      </div>
      <p className="font-serif text-sm leading-relaxed text-[#5C4A3D] sm:text-[15px]">
        {body}
      </p>
    </div>
  );
}

function CategoryTasteCard({
  headline,
  taste,
}: {
  headline: string;
  taste: {
    aroma: string;
    body: string;
    flavor: string;
    finish: string;
  };
}) {
  const notes = [
    { label: "Aroma", text: taste.aroma, icon: "☁" },
    { label: "Body", text: taste.body, icon: "◉" },
    { label: "Flavor", text: taste.flavor, icon: "✦" },
    { label: "Finish", text: taste.finish, icon: "◎" },
  ];

  return (
    <div className="category-story-panel p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EDE4D6] text-[#5C4A3D]">
          <Sparkles className="h-4 w-4" />
        </span>
        <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#3E2723]">
          How It Tastes
        </h3>
      </div>
      <p className="mb-4 font-serif text-xl italic leading-snug text-[#3E2723] sm:text-2xl">
        {headline}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {notes.map((note) => (
          <div key={note.label} className="rounded-2xl bg-white/45 px-3 py-2.5">
            <span className="text-base text-[#8B7355]">{note.icon}</span>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[#3E2723]">
              {note.label}
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-[#6E5D4F]">
              {note.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="menu-section-title font-sans text-sm font-bold uppercase tracking-[0.14em] text-[#F2DABA]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 font-serif text-sm italic text-[#F2DABA]/75">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function pickBestSellers(products: Product[], limit: number): Product[] {
  const popular = products.filter((p) => p.popular);
  const source = popular.length > 0 ? popular : products;
  return source.slice(0, limit);
}

function PremiumProductCard({
  product,
  color,
  featured = false,
  onAdd,
}: {
  product: Product;
  color: string;
  featured?: boolean;
  onAdd: () => void;
}) {
  const [failed, setFailed] = useState(false);
  const imageUrl = product.image?.trim()
    ? resolveCustomerMediaUrl(product.image.trim())
    : "";

  return (
    <article className={`relative w-full ${featured ? "sm:col-span-1" : ""}`}>
      <div
        className={`premium-product-card bake-card relative flex w-full flex-col overflow-hidden rounded-[1.85rem] shadow-[0_12px_32px_rgba(34,23,20,0.2)] sm:rounded-[2rem] ${
          featured ? "ring-2 ring-[#F2DABA]/30" : ""
        }`}
        style={{ backgroundColor: color }}
      >
        {featured && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-[#2A1E17]/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#F2DABA] backdrop-blur-sm">
            #1 Best Seller
          </span>
        )}

        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {!imageUrl || failed ? (
            <div className="flex h-full w-full items-center justify-center bg-[#e8e0d8]">
              <IconCoffeeCup size={featured ? 48 : 36} className="text-[#221714]/25" />
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
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3 sm:px-4 sm:pb-5">
          <h3 className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#221714] sm:text-xs">
            {product.name}
          </h3>
          {product.description && (
            <p className="mt-1 line-clamp-2 text-[10px] leading-snug text-[#221714]/65 sm:text-[11px]">
              {product.description}
            </p>
          )}
          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <p className="font-serif text-sm font-bold text-[#221714] sm:text-base">
              {formatPKR(product.price)}
            </p>
            <button
              type="button"
              onClick={onAdd}
              className="bake-card-cta shrink-0 rounded-full px-3.5 py-2 text-[10px] font-semibold tracking-wide text-[#F5EDE4] sm:px-4 sm:text-[11px]"
              aria-label={`Add ${product.name} to cart`}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
