"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bike, Store, RefreshCw, CheckCircle } from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/types";
import { formatPKR } from "@/lib/store";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminGet } from "@/lib/admin-fetch";

const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "preparing",
  "ready",
  "out-for-delivery",
  "completed",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadOrders = () => {
    setLoading(true);
    adminGet<Order[]>("/api/orders")
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoadError("");
      })
      .catch((e) => {
        setLoadError(e instanceof Error ? e.message : "Could not load orders");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  const getNextStatus = (order: Order): OrderStatus | null => {
    const flow =
      order.serviceType === "delivery"
        ? STATUS_FLOW
        : STATUS_FLOW.filter((s) => s !== "out-for-delivery");
    const idx = flow.indexOf(order.status);
    if (idx === -1 || idx === flow.length - 1) return null;
    return flow[idx + 1];
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Accept, prepare, and complete customer orders"
        action={
          <button onClick={loadOrders} className="admin-btn-secondary flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        }
      />

      {loadError && (
        <div className="admin-card mb-6 border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {pendingCount > 0 && (
        <div className="admin-card mb-6 border-amber-200 bg-amber-50/90 p-4">
          <p className="font-medium text-amber-900">
            {pendingCount} order{pendingCount > 1 ? "s" : ""} need acceptance
          </p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", ...STATUS_FLOW, "cancelled"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              filter === s
                ? "bg-sage-deep text-cream"
                : "border border-linen/50 bg-cream/90 text-coffee-muted hover:bg-cream"
            }`}
          >
            {s === "all" ? "All" : ORDER_STATUS_LABELS[s]}
            {s === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] text-white">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-coffee-muted">No orders found</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((order) => {
            const nextStatus = getNextStatus(order);
            const ServiceIcon =
              order.serviceType === "delivery" ? Bike : Store;
            const isPending = order.status === "pending";

            return (
              <div
                key={order.id}
                className={`admin-card p-5 ${isPending ? "ring-2 ring-amber-300" : ""}`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-coffee">{order.id}</p>
                    <p className="text-xs text-coffee-muted">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 rounded-full bg-cream px-2 py-1 text-xs capitalize text-coffee-muted">
                      <ServiceIcon className="h-3 w-3" />
                      {order.serviceType}
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-2 rounded-lg bg-cream/60 px-2 py-1.5"
                    >
                      <div className="relative h-9 w-9 overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="36px"
                        />
                      </div>
                      <span className="text-sm text-coffee">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="ml-auto text-xs text-coffee-muted">
                        {formatPKR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {order.deliveryInstructions && (
                  <p className="mb-3 rounded-lg bg-cream px-3 py-2 text-xs text-coffee-muted">
                    <span className="font-medium">Note:</span>{" "}
                    {order.deliveryInstructions}
                  </p>
                )}

                <div className="mb-4 flex items-center justify-between border-t border-linen/40 pt-3">
                  <span className="font-serif text-lg font-medium text-coffee">
                    {formatPKR(order.total)}
                  </span>
                  <span className="text-xs text-coffee-muted">
                    +{order.pointsEarned} pts
                  </span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {isPending ? (
                    <button
                      onClick={() => updateStatus(order.id, "preparing")}
                      className="admin-btn-primary flex flex-1 items-center justify-center gap-2 py-2.5"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept Order
                    </button>
                  ) : (
                    nextStatus && (
                      <button
                        onClick={() => updateStatus(order.id, nextStatus)}
                        className="admin-btn-primary flex-1 py-2.5 text-sm"
                      >
                        Mark {ORDER_STATUS_LABELS[nextStatus]}
                      </button>
                    )
                  )}
                  {order.status !== "cancelled" &&
                    order.status !== "completed" && (
                      <button
                        onClick={() => updateStatus(order.id, "cancelled")}
                        className="rounded-xl border border-red-200 px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 sm:py-2"
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
