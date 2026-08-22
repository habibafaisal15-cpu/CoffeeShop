"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Minus,
  Plus,
  Search,
  Trash2,
  Printer,
  ShoppingCart,
  CheckCircle,
  RotateCcw,
  Banknote,
  CreditCard,
} from "lucide-react";
import { CartItem, MenuCategory, Order, Product } from "@/lib/types";
import { getCategoryLabel } from "@/lib/categories";
import { formatPKR, getCartTotals } from "@/lib/store";
import { adminGet, adminMutate } from "@/lib/admin-fetch";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  PosReceipt,
  PosReceiptMeta,
  printPosReceipt,
} from "@/components/admin/PosReceipt";

type PaymentMethod = "cash" | "card";

export function PosTerminal() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [receiptMeta, setReceiptMeta] = useState<PosReceiptMeta>({});
  const [cartOpen, setCartOpen] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      adminGet<Product[]>("/api/products"),
      adminGet<MenuCategory[]>("/api/categories"),
    ])
      .then(([prods, cats]) => {
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setLoadError("");
      })
      .catch((e) => {
        setLoadError(e instanceof Error ? e.message : "Could not load menu");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableProducts = useMemo(
    () => products.filter((p) => p.available !== false),
    [products]
  );

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.visible && c.id !== "popular"),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCat =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [availableProducts, search, categoryFilter]);

  const { subtotal, total, orderItems } = getCartTotals(cart, products);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
  };

  const updateQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const resetSale = () => {
    setCompletedOrder(null);
    setReceiptMeta({});
    setCustomerName("");
    setPaymentMethod("cash");
    clearCart();
  };

  const completeSale = async () => {
    if (!orderItems.length || processing) return;

    setProcessing(true);
    try {
      const order = await adminMutate<Order>("/api/orders", "POST", {
        items: orderItems,
        subtotal,
        total,
        serviceType: "pickup",
      });

      const completed = await adminMutate<Order>(
        `/api/orders/${order.id}`,
        "PATCH",
        { status: "completed" }
      );

      setReceiptMeta({
        customerName: customerName.trim() || undefined,
        paymentMethod,
      });
      setCompletedOrder(completed);
      clearCart();
      setCartOpen(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not complete sale");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-card flex min-h-[420px] items-center justify-center p-8">
        <p className="text-sm text-coffee-muted">Loading POS menu…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="admin-card p-8 text-center">
        <p className="text-sm text-red-700">{loadError}</p>
        <button type="button" onClick={loadData} className="admin-btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className={`pos-terminal grid gap-4 lg:grid-cols-[1fr_340px] ${
          cartCount > 0 ? "pb-24 lg:pb-0" : ""
        }`}
      >
        <section className="admin-card flex min-h-[420px] flex-col overflow-hidden sm:min-h-[480px] lg:min-h-[560px]">
          <div className="border-b border-linen/50 p-3 sm:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search menu items…"
                className="admin-input pl-9"
              />
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
              <CategoryChip
                label="All"
                active={categoryFilter === "all"}
                onClick={() => setCategoryFilter("all")}
              />
              {visibleCategories
                .filter((c) => c.id !== "all")
                .map((cat) => (
                  <CategoryChip
                    key={cat.id}
                    label={cat.label}
                    active={categoryFilter === cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                  />
                ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4">
            {filteredProducts.length === 0 ? (
              <p className="py-12 text-center text-sm text-coffee-muted">
                No items found
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addToCart(product.id)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-linen/60 bg-cream/80 text-left transition hover:border-sage-light hover:shadow-md"
                  >
                    <div className="relative aspect-square bg-linen/30">
                      {product.image ? (
                        <Image
                          src={resolveMediaUrl(product.image)}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="160px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-coffee-muted">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <p className="line-clamp-2 text-xs font-semibold text-coffee">
                        {product.name}
                      </p>
                      <p className="mt-1 text-[10px] text-coffee-muted">
                        {getCategoryLabel(categories, product.category)}
                      </p>
                      <p className="mt-auto pt-2 text-sm font-bold text-sage-deep">
                        {formatPKR(product.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <PosCartPanel
          className="hidden lg:flex"
          cart={cart}
          products={products}
          cartCount={cartCount}
          total={total}
          orderItems={orderItems}
          customerName={customerName}
          paymentMethod={paymentMethod}
          processing={processing}
          onCustomerNameChange={setCustomerName}
          onPaymentMethodChange={setPaymentMethod}
          onUpdateQty={updateQty}
          onClearCart={clearCart}
          onCompleteSale={() => void completeSale()}
        />
      </div>

      {cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-linen/60 bg-cream/95 p-3 shadow-[0_-8px_24px_rgba(34,23,20,0.12)] backdrop-blur-md lg:hidden pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="admin-btn-primary flex w-full items-center justify-between gap-3 py-3"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              View Cart ({cartCount})
            </span>
            <span className="font-serif text-lg">{formatPKR(total)}</span>
          </button>
        </div>
      )}

      {cartOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[88vh] overflow-hidden rounded-t-[24px] bg-cream shadow-2xl lg:hidden">
            <div className="flex justify-center py-2">
              <span className="h-1 w-10 rounded-full bg-linen" />
            </div>
            <PosCartPanel
              className="flex max-h-[calc(88vh-1rem)] flex-col border-0 shadow-none"
              cart={cart}
              products={products}
              cartCount={cartCount}
              total={total}
              orderItems={orderItems}
              customerName={customerName}
              paymentMethod={paymentMethod}
              processing={processing}
              onCustomerNameChange={setCustomerName}
              onPaymentMethodChange={setPaymentMethod}
              onUpdateQty={updateQty}
              onClearCart={clearCart}
              onCompleteSale={() => void completeSale()}
              onClose={() => setCartOpen(false)}
              mobile
            />
          </div>
        </>
      )}

      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
          <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-cream p-4 shadow-2xl sm:max-w-md sm:rounded-2xl sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-800">
              <CheckCircle className="h-5 w-5" />
              <h3 className="font-serif text-xl font-bold text-coffee">
                Sale Complete
              </h3>
            </div>

            <div className="rounded-xl border border-linen bg-white p-4">
              <PosReceipt order={completedOrder} meta={receiptMeta} />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={printPosReceipt}
                className="admin-btn-primary flex items-center justify-center gap-2 py-2.5"
              >
                <Printer className="h-4 w-4" />
                Print Receipt
              </button>
              <button
                type="button"
                onClick={resetSale}
                className="admin-btn-secondary flex items-center justify-center gap-2 py-2.5"
              >
                <RotateCcw className="h-4 w-4" />
                New Sale
              </button>
            </div>
          </div>
        </div>
      )}

      {completedOrder && (
        <div id="pos-print-area" className="pos-print-only">
          <PosReceipt order={completedOrder} meta={receiptMeta} />
        </div>
      )}
    </>
  );
}

function PosCartPanel({
  className = "",
  cart,
  products,
  cartCount,
  total,
  orderItems,
  customerName,
  paymentMethod,
  processing,
  onCustomerNameChange,
  onPaymentMethodChange,
  onUpdateQty,
  onClearCart,
  onCompleteSale,
  onClose,
  mobile = false,
}: {
  className?: string;
  cart: CartItem[];
  products: Product[];
  cartCount: number;
  total: number;
  orderItems: ReturnType<typeof getCartTotals>["orderItems"];
  customerName: string;
  paymentMethod: PaymentMethod;
  processing: boolean;
  onCustomerNameChange: (value: string) => void;
  onPaymentMethodChange: (value: PaymentMethod) => void;
  onUpdateQty: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  onCompleteSale: () => void;
  onClose?: () => void;
  mobile?: boolean;
}) {
  return (
    <aside className={`admin-card flex flex-col ${className}`}>
      <div className="flex items-center justify-between border-b border-linen/50 p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-sage-deep" />
          <h2 className="font-serif text-lg font-bold text-coffee">Cart</h2>
          {cartCount > 0 && (
            <span className="rounded-full bg-sage-deep px-2 py-0.5 text-[10px] font-bold text-cream">
              {cartCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {cart.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="flex items-center gap-1 text-xs text-coffee-muted hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
          {mobile && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-2 py-1 text-xs font-medium text-coffee-muted hover:bg-cream"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3 sm:p-4">
        {cart.length === 0 ? (
          <p className="py-8 text-center text-sm text-coffee-muted">
            Tap items to add to cart
          </p>
        ) : (
          cart.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return (
              <div
                key={item.productId}
                className="flex items-center gap-2 rounded-xl border border-linen/50 bg-cream/60 p-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-coffee">
                    {product.name}
                  </p>
                  <p className="text-[11px] text-coffee-muted">
                    {formatPKR(product.price)}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.productId, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-linen bg-cream text-coffee"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQty(item.productId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-linen bg-cream text-coffee"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="space-y-3 border-t border-linen/50 p-3 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <input
          type="text"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          placeholder="Customer name (optional)"
          className="admin-input"
        />

        <div className="grid grid-cols-2 gap-2">
          <PaymentButton
            label="Cash"
            icon={Banknote}
            active={paymentMethod === "cash"}
            onClick={() => onPaymentMethodChange("cash")}
          />
          <PaymentButton
            label="Card"
            icon={CreditCard}
            active={paymentMethod === "card"}
            onClick={() => onPaymentMethodChange("card")}
          />
        </div>

        <div className="flex items-center justify-between rounded-xl bg-sage-light/20 px-3 py-2">
          <span className="text-sm font-medium text-coffee">Total</span>
          <span className="font-serif text-xl font-bold text-coffee">
            {formatPKR(total)}
          </span>
        </div>

        <button
          type="button"
          disabled={!orderItems.length || processing}
          onClick={onCompleteSale}
          className="admin-btn-primary flex w-full items-center justify-center gap-2 py-3 disabled:opacity-50"
        >
          <CheckCircle className="h-4 w-4" />
          {processing ? "Processing…" : "Complete Sale"}
        </button>
      </div>
    </aside>
  );
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "bg-sage-deep text-cream"
          : "border border-linen bg-cream/80 text-coffee hover:bg-cream"
      }`}
    >
      {label}
    </button>
  );
}

function PaymentButton({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon: typeof Banknote;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition ${
        active
          ? "border-sage-deep bg-sage-deep text-cream"
          : "border-linen bg-cream/80 text-coffee hover:bg-cream"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
