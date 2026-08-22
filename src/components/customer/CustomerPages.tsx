"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { MapPin, Mail, Phone, Clock } from "lucide-react";
import { Order, ORDER_STATUS_LABELS } from "@/lib/types";
import { formatPKR, useCartStore } from "@/lib/store";

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-900",
  preparing: "bg-blue-100 text-blue-900",
  ready: "bg-emerald-100 text-emerald-900",
  "out-for-delivery": "bg-violet-100 text-violet-900",
  completed: "bg-[#EDE4D6] text-[#3E2723]",
  cancelled: "bg-red-100 text-red-900",
};

export function MyOrdersPage() {
  const orderHistoryIds = useCartStore((s) => s.orderHistoryIds);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    if (orderHistoryIds.length === 0) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/orders/my?ids=${encodeURIComponent(orderHistoryIds.join(","))}`,
        { cache: "no-store" }
      );
      const data = res.ok ? await res.json() : [];
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [orderHistoryIds]);

  useEffect(() => {
    void loadOrders();
    const timer = window.setInterval(() => void loadOrders(), 30000);
    return () => window.clearInterval(timer);
  }, [loadOrders]);

  return (
    <div className="category-browse-in pb-8">
      <PageHero
        eyebrow="Your orders"
        title="My Orders"
        subtitle="Track every order you have placed from this device."
      />

      {loading ? (
        <p className="text-center text-sm text-[#F5EDE4]/80">Loading orders…</p>
      ) : orders.length === 0 ? (
        <div className="category-story-panel mx-1 p-8 text-center">
          <p className="font-serif text-lg text-[#3E2723]">No orders yet</p>
          <p className="mt-2 text-sm text-[#6E5D4F]">
            Place an order from the menu and it will appear here with live status.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="category-story-panel overflow-hidden p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8B7355]">
                    {order.id}
                  </p>
                  <p className="mt-1 text-xs text-[#6E5D4F]">
                    {new Date(order.createdAt).toLocaleString("en-PK", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${STATUS_COLORS[order.status]}`}
                >
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#E8DDD0] pt-4">
                {order.items.map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-[#3E2723]">
                      {item.quantity}× {item.name}
                    </span>
                    <span className="font-medium text-[#5C4A3D]">
                      {formatPKR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#E8DDD0] pt-4 text-sm">
                <span className="capitalize text-[#6E5D4F]">
                  {order.serviceType}
                </span>
                <span className="font-serif text-lg font-bold text-[#3E2723]">
                  {formatPKR(order.total)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export function AboutUsPage() {
  return (
    <div className="category-browse-in pb-8">
      <PageHero
        eyebrow="Our story"
        title="About Brewed"
        subtitle="A cosy coffee house where every cup is crafted with warmth, quality, and care."
      />

      <div className="space-y-4">
        <div className="category-story-panel overflow-hidden">
          <div className="relative h-48 sm:h-56">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
              alt="Brewed coffee house"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E17]/80 to-transparent" />
          </div>
          <div className="p-6 sm:p-8">
            <h3 className="font-serif text-2xl text-[#3E2723]">
              Handcrafted Moments, Made for You
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5C4A3D] sm:text-base">
              Brewed Coffee House began with a simple idea — create a space where
              premium coffee meets genuine hospitality. From our single-origin
              espresso to fresh oven bakes, everything is prepared with intention
              and served with a smile.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Quality First",
              text: "We source the finest beans and ingredients for every cup and bite.",
            },
            {
              title: "Craft & Care",
              text: "Skilled baristas and bakers prepare everything fresh daily.",
            },
            {
              title: "Community",
              text: "A welcoming space for friends, families, and coffee lovers.",
            },
          ].map((item) => (
            <div key={item.title} className="category-story-panel p-5">
              <h4 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#8B7355]">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-[#5C4A3D]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactUsPage() {
  return (
    <div className="category-browse-in pb-8">
      <PageHero
        eyebrow="Get in touch"
        title="Contact Us"
        subtitle="We would love to hear from you — questions, feedback, or catering enquiries."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="category-story-panel space-y-5 p-6 sm:p-8">
          <ContactRow
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value="+92 300 1234567"
            href="tel:+923001234567"
          />
          <ContactRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value="hello@brewedcoffee.pk"
            href="mailto:hello@brewedcoffee.pk"
          />
          <ContactRow
            icon={<Clock className="h-4 w-4" />}
            label="Hours"
            value="Mon – Sun · 7:00 AM – 11:00 PM"
          />
          <ContactRow
            icon={<MapPin className="h-4 w-4" />}
            label="Main Location"
            value="DHA Phase 6, Lahore"
          />
        </div>

        <div className="category-story-panel p-6 sm:p-8">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#8B7355]">
            Send a message
          </h3>
          <form className="mt-4 space-y-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl border border-[#E8DDD0] bg-white/60 px-4 py-3 text-sm text-[#3E2723] outline-none focus:border-[#8B7355]"
            />
            <input
              type="email"
              placeholder="Email address"
              className="w-full rounded-xl border border-[#E8DDD0] bg-white/60 px-4 py-3 text-sm text-[#3E2723] outline-none focus:border-[#8B7355]"
            />
            <textarea
              placeholder="How can we help?"
              rows={4}
              className="w-full resize-y rounded-xl border border-[#E8DDD0] bg-white/60 px-4 py-3 text-sm text-[#3E2723] outline-none focus:border-[#8B7355]"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[#6B7F63] py-3 text-sm font-semibold text-white transition hover:bg-[#5A6D53]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const BRANCHES = [
  {
    name: "Brewed DHA Flagship",
    address: "Plot 12, Main Boulevard, DHA Phase 6, Lahore",
    hours: "7:00 AM – 11:00 PM",
    phone: "+92 300 1234567",
  },
  {
    name: "Brewed Gulberg",
    address: "MM Alam Road, Gulberg III, Lahore",
    hours: "8:00 AM – 10:00 PM",
    phone: "+92 321 7654321",
  },
  {
    name: "Brewed Johar Town",
    address: "Block H, Johar Town, Lahore",
    hours: "7:30 AM – 10:30 PM",
    phone: "+92 333 9876543",
  },
];

export function OurBranchesPage() {
  return (
    <div className="category-browse-in pb-8">
      <PageHero
        eyebrow="Find us"
        title="Our Branches"
        subtitle="Visit any Brewed location for the same warm service and quality you love."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {BRANCHES.map((branch) => (
          <article key={branch.name} className="category-story-panel p-5 sm:p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDE4D6] text-[#5C4A3D]">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl text-[#3E2723]">{branch.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#5C4A3D]">
              {branch.address}
            </p>
            <div className="mt-4 space-y-1 text-xs text-[#6E5D4F]">
              <p>{branch.hours}</p>
              <a
                href={`tel:${branch.phone.replace(/\s/g, "")}`}
                className="font-medium text-[#3E2723] hover:underline"
              >
                {branch.phone}
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="category-fancy-header relative mb-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#3E4A38] via-[#2A1E17] to-[#3E3027] p-5 shadow-[0_20px_48px_rgba(34,23,20,0.22)] sm:mb-6 sm:rounded-[32px] sm:p-8">
      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#C99E92]">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-serif text-2xl leading-tight text-[#FAF7F2] sm:text-3xl lg:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-xl font-serif text-sm italic leading-relaxed text-[#E8DCC8]/95 sm:text-base">
        {subtitle}
      </p>
    </header>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EDE4D6] text-[#5C4A3D]">
        {icon}
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8B7355]">
          {label}
        </p>
        {href ? (
          <a
            href={href}
            className="mt-1 block text-sm font-medium text-[#3E2723] hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm text-[#3E2723]">{value}</p>
        )}
      </div>
    </div>
  );
}
