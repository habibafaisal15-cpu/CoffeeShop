"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  FolderOpen,
  ArrowLeft,
  Coffee,
  LogOut,
  ExternalLink,
  Images,
  Monitor,
  Menu,
  X,
} from "lucide-react";

const CUSTOMER_URL = process.env.NEXT_PUBLIC_CUSTOMER_URL?.trim() || "";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/pos", label: "POS", icon: Monitor },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/home-slides", label: "Home Slides", icon: Images },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F0E8] lg:flex-row">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-linen/60 bg-[#D9C4A3] px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream/80 text-coffee"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-coffee">
            <Coffee className="h-4 w-4" />
          </div>
          <div>
            <p className="font-serif text-sm font-bold leading-tight">Brewed POS</p>
            <p className="text-[10px] text-coffee-muted">Admin</p>
          </div>
        </div>
        <div className="w-10" aria-hidden />
      </header>

      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] flex-col border-r border-linen/60 bg-[#D9C4A3] text-coffee shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:w-60 lg:shrink-0 lg:translate-x-0 lg:shadow-sm ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-linen/40 px-5 py-5 lg:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cream text-coffee shadow-sm">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <p className="font-serif text-base font-bold">Brewed POS</p>
              <p className="text-[11px] text-coffee-muted">Admin Panel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-coffee-muted hover:bg-cream/25 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-sage-deep text-cream shadow-sm"
                    : "text-coffee-light hover:bg-cream/25 hover:text-coffee"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-linen/40 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {CUSTOMER_URL ? (
            <a
              href={CUSTOMER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-coffee-muted transition hover:bg-cream/25 hover:text-coffee"
            >
              <ExternalLink className="h-4 w-4 shrink-0" />
              Customer Kiosk
            </a>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-coffee-muted transition hover:bg-cream/25 hover:text-coffee"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              Back to Kiosk
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-coffee-muted transition hover:bg-cream/25 hover:text-coffee"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto bg-pattern p-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-4 lg:p-8">
        {children}
      </main>
    </div>
  );
}
