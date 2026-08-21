"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  FolderOpen,
  ArrowLeft,
  Coffee,
  LogOut,
  ExternalLink,
} from "lucide-react";

const CUSTOMER_URL = process.env.NEXT_PUBLIC_CUSTOMER_URL?.trim() || "";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <aside className="flex w-60 shrink-0 flex-col border-r border-linen/60 bg-[#D9C4A3] text-coffee shadow-sm">
        <div className="flex items-center gap-3 border-b border-linen/40 px-5 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-coffee shadow-sm">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <p className="font-serif text-base font-bold">Brewed POS</p>
            <p className="text-[11px] text-coffee-muted">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-sage-deep text-cream shadow-sm"
                    : "text-coffee-light hover:bg-cream/25 hover:text-coffee"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-linen/40 p-3">
          {CUSTOMER_URL ? (
            <a
              href={CUSTOMER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-coffee-muted transition hover:bg-cream/25 hover:text-coffee"
            >
              <ExternalLink className="h-4 w-4" />
              Customer Kiosk
            </a>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-coffee-muted transition hover:bg-cream/25 hover:text-coffee"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Kiosk
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-coffee-muted transition hover:bg-cream/25 hover:text-coffee"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-pattern p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
