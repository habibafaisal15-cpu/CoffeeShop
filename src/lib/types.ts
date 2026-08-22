export type Category =
  | "all"
  | "popular"
  | "coffee"
  | "hot-drinks"
  | "iced-coffee"
  | "non-coffee"
  | "specials"
  | "pastries"
  | "sandwiches"
  | "snacks"
  | "merchandise";

export type NavCategory =
  | "home"
  | "menu"
  | "my-orders"
  | "about"
  | "contact"
  | "branches";

export type ServiceType = "pickup" | "delivery";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "out-for-delivery"
  | "completed"
  | "cancelled";

export interface MenuCategory {
  id: string;
  label: string;
  image: string;
  sortOrder: number;
  visible: boolean;
  showInCarousel: boolean;
  showInNav: boolean;
}

export interface CraftSlide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  category: string;
  image: string;
  badge: string;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  popular?: boolean;
  available: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  serviceType: ServiceType;
  status: OrderStatus;
  deliveryInstructions?: string;
  pointsEarned: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  name: string;
  points: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

export const CATEGORY_LABELS: Record<Category, string> = {
  all: "All",
  popular: "Popular",
  coffee: "Coffee",
  "hot-drinks": "Hot Drinks",
  "iced-coffee": "Iced Coffee",
  "non-coffee": "Non-Coffee",
  specials: "Specials",
  pastries: "Pastries",
  sandwiches: "Sandwiches",
  snacks: "Snacks",
  merchandise: "Merchandise",
};

export const NAV_ITEMS: { id: NavCategory; label: string; icon: string }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "menu", label: "Menu", icon: "menu" },
  { id: "my-orders", label: "My Orders", icon: "orders" },
  { id: "about", label: "About Us", icon: "about" },
  { id: "contact", label: "Contact Us", icon: "contact" },
  { id: "branches", label: "Our Branches", icon: "branches" },
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready for Pickup",
  "out-for-delivery": "Out for Delivery",
  completed: "Completed",
  cancelled: "Cancelled",
};
