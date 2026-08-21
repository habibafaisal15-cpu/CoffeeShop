import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { DEFAULT_CATEGORIES } from "./categories";
import { DEFAULT_PRODUCTS } from "./data";
import { getDataDir } from "./storage-paths";
import { MenuCategory, Order, Product } from "./types";

const DATA_DIR = getDataDir();
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(filePath: string, fallback: T): T {
  if (!existsSync(filePath)) {
    return fallback;
  }
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(filePath: string, data: T) {
  ensureDataDir();
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function getProducts(): Product[] {
  return readJson<Product[]>(PRODUCTS_FILE, DEFAULT_PRODUCTS);
}

export function saveProducts(products: Product[]) {
  writeJson(PRODUCTS_FILE, products);
}

export function getCategories(): MenuCategory[] {
  const stored = readJson<MenuCategory[]>(CATEGORIES_FILE, DEFAULT_CATEGORIES);
  const byId = new Map(stored.map((c) => [c.id, c]));

  for (const def of DEFAULT_CATEGORIES) {
    if (!byId.has(def.id)) byId.set(def.id, def);
  }

  return Array.from(byId.values()).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function saveCategories(categories: MenuCategory[]) {
  writeJson(CATEGORIES_FILE, categories);
}

export function getCategoryById(id: string): MenuCategory | null {
  return getCategories().find((c) => c.id === id) ?? null;
}

export function addCategory(category: MenuCategory): MenuCategory {
  const categories = getCategories();
  categories.push(category);
  saveCategories(categories);
  return category;
}

export function updateCategory(
  id: string,
  updates: Partial<MenuCategory>
): MenuCategory | null {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...updates };
  saveCategories(categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const products = getProducts();
  if (products.some((p) => p.category === id)) return false;
  const categories = getCategories().filter((c) => c.id !== id);
  if (categories.length === getCategories().length) return false;
  saveCategories(categories);
  return true;
}

export function getOrders(): Order[] {
  return readJson<Order[]>(ORDERS_FILE, []);
}

export function saveOrders(orders: Order[]) {
  writeJson(ORDERS_FILE, orders);
}

export function addOrder(order: Order): Order {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

export function updateOrder(
  id: string,
  updates: Partial<Order>
): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index] = {
    ...orders[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveOrders(orders);
  return orders[index];
}

export function getOrderById(id: string): Order | null {
  return getOrders().find((o) => o.id === id) ?? null;
}

export function generateOrderId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${num}`;
}

export function calculatePoints(total: number, serviceType: "pickup" | "delivery"): number {
  const base = Math.floor(total / 10);
  return serviceType === "delivery" ? base * 2 : base;
}
