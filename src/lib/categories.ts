import { MenuCategory } from "./types";
import { CATEGORY_IMAGES } from "./data";

export const DEFAULT_CATEGORIES: MenuCategory[] = [
  {
    id: "all",
    label: "All",
    image: CATEGORY_IMAGES.all,
    sortOrder: 0,
    visible: true,
    showInCarousel: true,
    showInNav: true,
  },
  {
    id: "popular",
    label: "Popular",
    image: CATEGORY_IMAGES.popular,
    sortOrder: 1,
    visible: true,
    showInCarousel: true,
    showInNav: false,
  },
  {
    id: "coffee",
    label: "Coffee",
    image: CATEGORY_IMAGES.coffee,
    sortOrder: 2,
    visible: true,
    showInCarousel: false,
    showInNav: true,
  },
  {
    id: "hot-drinks",
    label: "Hot Drinks",
    image: CATEGORY_IMAGES["hot-drinks"],
    sortOrder: 3,
    visible: true,
    showInCarousel: true,
    showInNav: true,
  },
  {
    id: "iced-coffee",
    label: "Iced Coffee",
    image: CATEGORY_IMAGES["iced-coffee"],
    sortOrder: 4,
    visible: true,
    showInCarousel: true,
    showInNav: false,
  },
  {
    id: "non-coffee",
    label: "Non-Coffee",
    image: CATEGORY_IMAGES["non-coffee"],
    sortOrder: 5,
    visible: true,
    showInCarousel: true,
    showInNav: false,
  },
  {
    id: "specials",
    label: "Specials",
    image: CATEGORY_IMAGES.specials,
    sortOrder: 6,
    visible: true,
    showInCarousel: true,
    showInNav: false,
  },
  {
    id: "pastries",
    label: "Pastries",
    image: CATEGORY_IMAGES.pastries,
    sortOrder: 7,
    visible: true,
    showInCarousel: true,
    showInNav: true,
  },
  {
    id: "sandwiches",
    label: "Sandwiches",
    image: CATEGORY_IMAGES.sandwiches,
    sortOrder: 8,
    visible: true,
    showInCarousel: false,
    showInNav: true,
  },
  {
    id: "snacks",
    label: "Snacks",
    image: CATEGORY_IMAGES.snacks,
    sortOrder: 9,
    visible: true,
    showInCarousel: false,
    showInNav: true,
  },
  {
    id: "merchandise",
    label: "Merchandise",
    image: CATEGORY_IMAGES.merchandise,
    sortOrder: 10,
    visible: true,
    showInCarousel: false,
    showInNav: true,
  },
];

export function slugifyCategory(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCategoryLabel(
  categories: MenuCategory[],
  id: string
): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}

export function getCarouselCategories(categories: MenuCategory[]): MenuCategory[] {
  return categories
    .filter((c) => c.visible && c.showInCarousel)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getNavCategories(categories: MenuCategory[]): MenuCategory[] {
  return categories
    .filter((c) => c.visible && c.showInNav)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
