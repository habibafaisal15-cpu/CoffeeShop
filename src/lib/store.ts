"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CartItem,
  CustomerProfile,
  Order,
  OrderItem,
  Product,
  ServiceType,
} from "./types";
import { DEFAULT_CUSTOMER } from "./data";

interface CartStore {
  items: CartItem[];
  favorites: string[];
  serviceType: ServiceType | null;
  showServiceModal: boolean;
  placedOrder: Order | null;
  customer: CustomerProfile;
  searchQuery: string;

  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  setServiceType: (type: ServiceType) => void;
  setShowServiceModal: (show: boolean) => void;
  setPlacedOrder: (order: Order | null) => void;
  setSearchQuery: (query: string) => void;
  addPoints: (points: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      favorites: [],
      serviceType: null,
      showServiceModal: true,
      placedOrder: null,
      customer: DEFAULT_CUSTOMER,
      searchQuery: "",

      addItem: (productId) => {
        const items = get().items;
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { productId, quantity: 1 }] });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleFavorite: (productId) => {
        const favorites = get().favorites;
        set({
          favorites: favorites.includes(productId)
            ? favorites.filter((id) => id !== productId)
            : [...favorites, productId],
        });
      },

      setServiceType: (type) =>
        set({ serviceType: type, showServiceModal: false }),

      setShowServiceModal: (show) => set({ showServiceModal: show }),

      setPlacedOrder: (order) => set({ placedOrder: order }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      addPoints: (points) => {
        const customer = get().customer;
        set({ customer: { ...customer, points: customer.points + points } });
      },
    }),
    {
      name: "brewed-cart",
      skipHydration: true,
      partialize: (state) => ({
        favorites: state.favorites,
        customer: state.customer,
        serviceType: state.serviceType,
        placedOrder: state.placedOrder,
      }),
    }
  )
);

export function getCartTotals(items: CartItem[], products: Product[]) {
  let subtotal = 0;
  const orderItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      return {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      };
    })
    .filter((item): item is OrderItem => item !== null);

  return { subtotal, total: subtotal, orderItems };
}

export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

export function calculateOrderPoints(
  total: number,
  serviceType: ServiceType
): number {
  const base = Math.floor(total / 10);
  return serviceType === "delivery" ? base * 2 : base;
}
