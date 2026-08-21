"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  TrendingUp,
  Bike,
  Store,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Order } from "@/lib/types";
import { formatPKR } from "@/lib/store";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { adminGet } from "@/lib/admin-fetch";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadOrders = useCallback(() => {
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
  }, []);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );
  const revenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending");
  const preparing = orders.filter((o) => o.status === "preparing");
  const completed = todayOrders.filter((o) => o.status === "completed").length;

  const acceptOrder = async (id: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "preparing" }),
    });
    loadOrders();
  };

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of today's operations"
        action={
          <button
            onClick={loadOrders}
            className="admin-btn-secondary flex items-center gap-2"
          >
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

      {pending.length > 0 && (
        <div className="admin-card mb-6 flex items-start gap-3 border-amber-200 bg-amber-50/80 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="flex-1">
            <p className="font-medium text-amber-900">
              {pending.length} new order{pending.length > 1 ? "s" : ""} waiting
            </p>
            <p className="text-sm text-amber-800/80">
              Accept orders from the queue or go to{" "}
              <Link href="/admin/orders" className="underline">
                Orders
              </Link>
            </p>
          </div>
        </div>
      )}

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Today's Orders" value={todayOrders.length} icon={ShoppingBag} />
        <StatCard label="Revenue Today" value={formatPKR(revenue)} icon={TrendingUp} />
        <StatCard
          label="Pending"
          value={pending.length}
          icon={Clock}
          accent="bg-amber-100"
        />
        <StatCard label="Completed" value={completed} icon={CheckCircle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-coffee">Active Queue</h2>
            <span className="text-xs text-coffee-muted">
              {pending.length + preparing.length} active
            </span>
          </div>
          {pending.length + preparing.length === 0 ? (
            <p className="text-sm text-coffee-muted">No active orders</p>
          ) : (
            <div className="space-y-2">
              {[...pending, ...preparing].slice(0, 6).map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onAccept={
                    order.status === "pending"
                      ? () => acceptOrder(order.id)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

        <div className="admin-card p-6">
          <h2 className="mb-4 font-serif text-xl text-coffee">Recent Orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-coffee-muted">
              No orders yet. Place one from the customer kiosk.
            </p>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 8).map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderRow({
  order,
  onAccept,
}: {
  order: Order;
  onAccept?: () => void;
}) {
  const ServiceIcon = order.serviceType === "delivery" ? Bike : Store;

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-linen/40 bg-cream/60 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <ServiceIcon className="h-4 w-4 shrink-0 text-coffee-muted" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-coffee">{order.id}</p>
          <p className="truncate text-xs text-coffee-muted">
            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <div className="text-right">
          <p className="text-sm font-semibold text-coffee">
            {formatPKR(order.total)}
          </p>
          <StatusBadge status={order.status} />
        </div>
        {onAccept && (
          <button
            onClick={onAccept}
            className="admin-btn-primary whitespace-nowrap px-3 py-1.5 text-xs"
          >
            Accept
          </button>
        )}
      </div>
    </div>
  );
}
