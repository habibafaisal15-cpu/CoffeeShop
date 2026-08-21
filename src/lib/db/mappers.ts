import { MenuCategory, Order, OrderItem, Product } from "../types";
import { resolveMediaUrl } from "../media-url";

export type CategoryRow = {
  id: string;
  label: string;
  image: string;
  sort_order: number;
  visible: boolean;
  show_in_carousel: boolean;
  show_in_nav: boolean;
};

export type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  category?: string;
  image?: string;
  popular?: boolean;
  available?: boolean;
};

export type OrderRow = {
  id: string;
  items: OrderItem[] | string;
  subtotal: number;
  total: number;
  service_type: string;
  status: string;
  delivery_instructions: string | null;
  points_earned: number;
  created_at: Date | string;
  updated_at: Date | string;
};

export function mapCategory(row: CategoryRow): MenuCategory {
  return {
    id: row.id,
    label: row.label,
    image: resolveMediaUrl(row.image),
    sortOrder: row.sort_order,
    visible: row.visible,
    showInCarousel: row.show_in_carousel,
    showInNav: row.show_in_nav,
  };
}

function toPrice(value: ProductRow["price"]): number {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    price: toPrice(row.price),
    category: row.category ?? "coffee",
    image: resolveMediaUrl(row.image ?? ""),
    popular: row.popular ?? false,
    available: row.available ?? true,
  };
}

export function mapOrder(row: OrderRow): Order {
  const items =
    typeof row.items === "string" ? (JSON.parse(row.items) as OrderItem[]) : row.items;

  return {
    id: row.id,
    items,
    subtotal: row.subtotal,
    total: row.total,
    serviceType: row.service_type as Order["serviceType"],
    status: row.status as Order["status"],
    deliveryInstructions: row.delivery_instructions ?? undefined,
    pointsEarned: row.points_earned,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
