import { Category } from "./types";

/** 3D-style transparent PNG icons (Icons8 3D Fluency) */
const icon = (name: string, size = 192) =>
  `https://img.icons8.com/3d-fluency/${size}/${name}.png`;

const catIcon = (name: string) =>
  `https://img.icons8.com/3d-fluency/94/${name}.png`;

export const CATEGORY_PILL_BORDER: Partial<Record<Category, string>> = {
  all: "#E8D8C8",
  popular: "#E2C7C3",
  "hot-drinks": "#C6D5C5",
  "iced-coffee": "#E8D8C8",
  "non-coffee": "#E2C7C3",
  specials: "#C6D5C5",
  pastries: "#E2C7C3",
};

export const CATEGORY_PILL_STYLES: Partial<
  Record<Category, { bg: string; text: string }>
> = {
  all: { bg: "#E8E0D4", text: "#3D2E24" },
  popular: { bg: "#A3B19B", text: "#FFFFFF" },
  "hot-drinks": { bg: "#D2AC9E", text: "#3D2E24" },
  "iced-coffee": { bg: "#E5D8C8", text: "#3D2E24" },
  "non-coffee": { bg: "#E8DFD0", text: "#3D2E24" },
  specials: { bg: "#E5D0B8", text: "#3D2E24" },
  pastries: { bg: "#E8CFC4", text: "#3D2E24" },
};

export const CATEGORY_IMAGES: Record<Category, string> = {
  all: catIcon("coffee-beans"),
  popular: catIcon("star"),
  coffee: catIcon("coffee-to-go"),
  "hot-drinks": catIcon("coffee-mug"),
  "iced-coffee": catIcon("coffee-to-go"),
  "non-coffee": catIcon("tea"),
  specials: catIcon("gift"),
  pastries: catIcon("croissant"),
  sandwiches: catIcon("sandwich"),
  snacks: catIcon("cookie"),
  merchandise: catIcon("shopping-bag"),
};

export const PRODUCT_IMAGES: Record<string, string> = {
  cappuccino:
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80",
  "caramel-latte":
    "https://images.unsplash.com/photo-1571927075597-020fc2cf4036?auto=format&fit=crop&w=600&q=80",
  "chocolate-muffin":
    "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80",
  americano:
    "https://images.unsplash.com/photo-1514432324607-09f976781066?auto=format&fit=crop&w=600&q=80",
  "iced-latte":
    "https://images.unsplash.com/photo-1517701603779-6ce934106591?auto=format&fit=crop&w=600&q=80",
  mocha:
    "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=480&q=85",
  croissant:
    "https://images.unsplash.com/photo-1555507036-ab794f4a5337?w=480&q=85",
  "cold-brew":
    "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=480&q=85",
  "matcha-latte":
    "https://images.unsplash.com/photo-1515823064-d6e0hfe2021b?w=480&q=85",
  "club-sandwich":
    "https://images.unsplash.com/photo-1528735602782-2552fd46c7af?w=480&q=85",
  brownie:
    "https://images.unsplash.com/photo-1606313564200-e75d5e984668?w=480&q=85",
  "brewed-mug": icon("coffee-mug"),
  "pumpkin-spice":
    "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=480&q=85",
  "flat-white":
    "https://images.unsplash.com/photo-1561882468-0890c5517799?w=480&q=85",
  "cinnamon-roll":
    "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=480&q=85",
};

export const DEFAULT_PRODUCTS: import("./types").Product[] = [
  {
    id: "cappuccino",
    name: "Cappuccino",
    description: "Smooth espresso with steamed milk foam",
    price: 350,
    category: "hot-drinks",
    image: PRODUCT_IMAGES.cappuccino,
    popular: true,
    available: true,
  },
  {
    id: "caramel-latte",
    name: "Caramel Latte",
    description: "Rich espresso with velvety caramel and steamed milk",
    price: 400,
    category: "hot-drinks",
    image: PRODUCT_IMAGES["caramel-latte"],
    popular: true,
    available: true,
  },
  {
    id: "chocolate-muffin",
    name: "Chocolate Muffin",
    description: "Freshly baked double chocolate muffin",
    price: 280,
    category: "pastries",
    image: PRODUCT_IMAGES["chocolate-muffin"],
    popular: false,
    available: true,
  },
  {
    id: "americano",
    name: "Americano",
    description: "Bold espresso diluted with hot water",
    price: 300,
    category: "coffee",
    image: PRODUCT_IMAGES.americano,
    popular: false,
    available: true,
  },
  {
    id: "iced-latte",
    name: "Iced Latte",
    description: "Chilled espresso with cold milk over ice",
    price: 300,
    category: "iced-coffee",
    image: PRODUCT_IMAGES["iced-latte"],
    popular: true,
    available: true,
  },
  {
    id: "mocha",
    name: "Mocha",
    description: "Espresso blended with chocolate and steamed milk",
    price: 400,
    category: "hot-drinks",
    image: PRODUCT_IMAGES.mocha,
    popular: true,
    available: true,
  },
  {
    id: "croissant",
    name: "Croissant",
    description: "Flaky, buttery French-style croissant",
    price: 380,
    category: "pastries",
    image: PRODUCT_IMAGES.croissant,
    popular: true,
    available: true,
  },
  {
    id: "cold-brew",
    name: "Cold Brew",
    description: "Slow-steeped for 18 hours, smooth and bold",
    price: 400,
    category: "iced-coffee",
    image: PRODUCT_IMAGES["cold-brew"],
    available: true,
  },
  {
    id: "matcha-latte",
    name: "Matcha Latte",
    description: "Ceremonial grade matcha with steamed milk",
    price: 480,
    category: "non-coffee",
    image: PRODUCT_IMAGES["matcha-latte"],
    available: true,
  },
  {
    id: "club-sandwich",
    name: "Club Sandwich",
    description: "Triple-decker with chicken, bacon, and fresh veggies",
    price: 650,
    category: "sandwiches",
    image: PRODUCT_IMAGES["club-sandwich"],
    available: true,
  },
  {
    id: "brownie",
    name: "Fudge Brownie",
    description: "Decadent chocolate fudge brownie",
    price: 300,
    category: "snacks",
    image: PRODUCT_IMAGES.brownie,
    available: true,
  },
  {
    id: "brewed-mug",
    name: "Brewed House Mug",
    description: "Ceramic mug with Brewed Coffee House logo",
    price: 1200,
    category: "merchandise",
    image: PRODUCT_IMAGES["brewed-mug"],
    available: true,
  },
  {
    id: "pumpkin-spice",
    name: "Pumpkin Spice Latte",
    description: "Seasonal favorite with warm spices",
    price: 520,
    category: "specials",
    image: PRODUCT_IMAGES["pumpkin-spice"],
    available: true,
  },
  {
    id: "flat-white",
    name: "Flat White",
    description: "Microfoam milk over a double ristretto",
    price: 390,
    category: "coffee",
    image: PRODUCT_IMAGES["flat-white"],
    available: true,
  },
  {
    id: "cinnamon-roll",
    name: "Cinnamon Roll",
    description: "Warm roll with cream cheese frosting",
    price: 350,
    category: "pastries",
    image: PRODUCT_IMAGES["cinnamon-roll"],
    available: true,
  },
];

export const DEFAULT_CUSTOMER = {
  name: "Guest",
  points: 120,
  tier: "Silver" as const,
};

export const BRANCH_NAME = "Lahore Branch";
