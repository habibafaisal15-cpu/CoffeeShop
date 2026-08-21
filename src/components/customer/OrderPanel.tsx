"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Product } from "@/lib/types";
import { Order } from "@/lib/types";
import { formatPKR, getCartTotals, useCartStore, calculateOrderPoints } from "@/lib/store";
import { PRODUCT_IMAGES } from "@/lib/data";
import { resolveCustomerMediaUrl } from "@/lib/media-url";
import { SafeImage } from "@/components/customer/SafeImage";
import {
  IconChat,
  IconCoffeeCup,
  IconMinus,
  IconPlus,
  IconTrackDelivery,
} from "@/components/icons/BrewedIcons";

interface OrderPanelProps {
  products: Product[];
}

const CART_SHELL =
  "glass-cart relative z-10 mx-2 flex h-[62vh] max-h-[62vh] w-full flex-col overflow-hidden rounded-t-[20px] p-4 text-[#2A1E17] sm:h-[68vh] sm:max-h-[68vh] sm:rounded-[20px] sm:p-5 xl:mx-3 xl:mb-8 xl:h-[calc(100vh-2rem)] xl:max-h-[calc(100vh-2rem)] xl:rounded-[20px] xl:p-5";

function cartDisplayImage(productId: string, image: string) {
  if (image?.trim()) return resolveCustomerMediaUrl(image.trim());
  return PRODUCT_IMAGES[productId] ?? "";
}

function CartRow({
  productId,
  image,
  name,
  quantity,
  actions,
}: {
  productId: string;
  image: string;
  name: string;
  quantity: number;
  actions?: ReactNode;
}) {
  const thumb = cartDisplayImage(productId, image);

  return (
    <div className="cart-row flex w-full min-w-0 items-center gap-2.5 rounded-2xl px-2.5 py-2.5">
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/80 bg-[#F7F3EE] shadow-sm">
        <SafeImage
          src={thumb}
          alt={name}
          width={44}
          height={44}
          className="h-9 w-9 object-contain drop-shadow-sm"
          fallback={
            <IconCoffeeCup size={22} className="text-[#C99E92]/70" />
          }
        />
      </div>
      <p className="min-w-0 flex-1 text-sm font-medium leading-snug text-[#2A1E17]">
        {quantity}x {name}
      </p>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

function TrackMyOrderButton({
  children = "Track My Order",
  className = "",
  disabled,
  onClick,
}: {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`btn-track relative flex w-full items-center justify-center rounded-full py-3.5 pl-4 pr-[3.25rem] text-sm font-semibold shadow-sm ${className}`}
    >
      {children}
      <IconTrackDelivery
        size={38}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
      />
    </button>
  );
}

export function OrderPanel({ products }: OrderPanelProps) {
  const {
    items,
    updateQuantity,
    serviceType,
    placedOrder,
    clearCart,
    setPlacedOrder,
    setShowServiceModal,
    addPoints,
  } = useCartStore();

  const [isPlacing, setIsPlacing] = useState(false);

  const { subtotal, total, orderItems } = getCartTotals(items, products);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const finalizeOrder = (order: Order) => {
    addPoints(order.pointsEarned);
    setPlacedOrder(order);
    clearCart();
  };

  const handlePlaceOrder = async () => {
    if (!items.length) return;
    if (!serviceType) {
      setShowServiceModal(true);
      return;
    }
    if (!orderItems.length) {
      alert("Could not place order. Please try adding items again.");
      return;
    }

    setIsPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          subtotal,
          total,
          serviceType,
        }),
      });
      if (res.ok) {
        finalizeOrder(await res.json());
        return;
      }
    } catch {
      /* fall back to local order below */
    } finally {
      setIsPlacing(false);
    }

    const now = new Date().toISOString();
    finalizeOrder({
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      items: orderItems,
      subtotal,
      total,
      serviceType,
      status: "pending",
      pointsEarned: calculateOrderPoints(total, serviceType),
      createdAt: now,
      updatedAt: now,
    });
  };

  const handleNewOrder = () => {
    setPlacedOrder(null);
  };

  const panelHeader = (count: number, showClear: boolean) => (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h2 className="font-serif text-xl font-semibold text-white">
          Cart Panel
        </h2>
        {count > 0 && (
          <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-white/25 px-1.5 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </div>
      {showClear && (
        <button
          onClick={clearCart}
          className="text-xs font-medium text-[#2A1E17] transition hover:text-[#1A120E]"
        >
          Clear
        </button>
      )}
    </div>
  );

  if (placedOrder) {
    const count = placedOrder.items.reduce((s, i) => s + i.quantity, 0);
    return (
      <aside className={CART_SHELL}>
        {panelHeader(count, false)}

        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <div className="space-y-2">
            {placedOrder.items.map((item) => (
              <CartRow
                key={item.productId}
                productId={item.productId}
                image={item.image}
                name={item.name}
                quantity={item.quantity}
              />
            ))}
          </div>

          <div className="mt-4 text-center">
            <h3 className="font-serif text-[1.6rem] font-semibold italic text-[#2A1E17]">
              Order Placed!
            </h3>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2A1E17]">
              Order Total Paid:{" "}
              <span className="font-serif text-[1.35rem] normal-case tracking-normal text-[#2A1E17]">
                {formatPKR(placedOrder.total)}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 shrink-0 space-y-2">
          <TrackMyOrderButton />
          <button
            onClick={handleNewOrder}
            className="w-full rounded-full border border-white/45 py-2 text-sm font-medium text-[#2A1E17] transition hover:bg-white/25"
          >
            Start New Order
          </button>
        </div>

        <button className="btn-chat absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-float xl:bottom-6 xl:right-6">
          <IconChat size={22} />
        </button>
      </aside>
    );
  }

  return (
    <aside className={CART_SHELL}>
      {panelHeader(itemCount, itemCount > 0)}

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-[#2A1E17]">Your cart is empty</p>
            <p className="mt-1 text-xs text-[#2A1E17]/70">Add items from the menu</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <CartRow
                  key={item.productId}
                  productId={item.productId}
                  image={product.image}
                  name={product.name}
                  quantity={item.quantity}
                  actions={
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-[#2A1E17] shadow-sm"
                      >
                        <IconMinus size={12} />
                      </button>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="btn-add flex h-6 w-6 items-center justify-center rounded-full shadow-sm"
                      >
                        <IconPlus size={12} />
                      </button>
                    </div>
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="mt-4 shrink-0 border-t border-white/40 pt-4">
          <div className="mb-3 space-y-1 text-sm">
            <div className="flex justify-between text-[#2A1E17]/80">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#2A1E17]">
              <span>Total</span>
              <span>{formatPKR(total)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacing}
            className="btn-track relative flex w-full items-center justify-center rounded-full py-3.5 pl-4 pr-4 text-sm font-semibold shadow-sm disabled:opacity-50"
          >
            {isPlacing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Placing Order...
              </>
            ) : !serviceType ? (
              "Choose Pickup or Delivery"
            ) : (
              <>Pay {formatPKR(total)}</>
            )}
          </button>
        </div>
      )}

      {items.length === 0 && (
        <TrackMyOrderButton disabled className="mt-4 shrink-0 opacity-40" />
      )}

      <button className="btn-chat absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-float xl:bottom-6 xl:right-6">
        <IconChat size={22} />
      </button>
    </aside>
  );
}
