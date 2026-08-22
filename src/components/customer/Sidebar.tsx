import Image from "next/image";
import { NavCategory } from "@/lib/types";
import { NAV_ITEMS } from "@/lib/types";
import { IconCoffeeCup, IconQrScan, NAV_ICON_MAP } from "@/components/icons/BrewedIcons";

const MOBILE_SHORT_LABELS: Partial<Record<NavCategory, string>> = {
  home: "Home",
  menu: "Menu",
  "my-orders": "Orders",
  about: "About",
  contact: "Contact",
  branches: "Branches",
};

interface SidebarProps {
  activeNav: NavCategory;
  onNavChange: (nav: NavCategory) => void;
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  return (
    <>
      <div className="relative mx-3 hidden shrink-0 xl:mx-4 xl:flex xl:flex-col">
        <div className="xl:sticky xl:top-4 xl:self-start">
        <aside className="sidebar-panel flex h-[calc(100vh-2rem)] max-h-[calc(100vh-2rem)] w-[10.75rem] flex-col rounded-[28px] py-4 shadow-glass">
          <SidebarBrand />
          <SidebarNav activeNav={activeNav} onNavChange={onNavChange} />
          <SidebarFooter />
        </aside>

        <button
          type="button"
          className="absolute -right-0.5 bottom-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/50 bg-[#D8C9B5] text-[#3E3027] shadow-md transition hover:scale-105"
          aria-label="Scan to Pay"
          title="Scan to Pay"
        >
          <IconQrScan size={18} />
        </button>
        </div>
      </div>

      <nav className="sidebar-panel mx-1 flex shrink-0 gap-0.5 overflow-x-auto rounded-2xl px-1.5 py-2 shadow-glass scrollbar-hide sm:mx-2 sm:gap-1 sm:px-2 xl:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = NAV_ICON_MAP[item.icon as keyof typeof NAV_ICON_MAP];
          const isActive = activeNav === item.id;
          const shortLabel = MOBILE_SHORT_LABELS[item.id] ?? item.label;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavChange(item.id)}
              className={`flex min-w-[4.25rem] shrink-0 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition sm:min-w-0 sm:gap-1 sm:px-3 sm:py-2 ${
                isActive ? "bg-[#9FB19A] text-[#3E2723]" : "text-[#3E2723]"
              }`}
            >
              <Icon size={18} />
              <span className="max-w-[4.5rem] truncate text-[9px] font-medium sm:max-w-none sm:text-[10px]">
                {shortLabel}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

function SidebarBrand() {
  return (
    <div className="mb-4 flex flex-col items-center px-3 text-center">
      <div className="mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#B8C5B3] text-[#3E2723]">
        <IconCoffeeCup size={20} />
      </div>
      <p className="font-serif text-xl font-bold leading-tight text-[#3E2723]">Brewed</p>
      <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#3E2723]">
        Coffee House
      </p>
    </div>
  );
}

function SidebarNav({
  activeNav,
  onNavChange,
}: {
  activeNav: NavCategory;
  onNavChange: (nav: NavCategory) => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-2">
      {NAV_ITEMS.map((item) => {
        const Icon = NAV_ICON_MAP[item.icon as keyof typeof NAV_ICON_MAP];
        const isActive = activeNav === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavChange(item.id)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 transition-all ${
              isActive
                ? "bg-[#9FB19A] text-[#3E2723] shadow-sm"
                : "text-[#3E2723] hover:bg-black/[0.04]"
            }`}
          >
            <Icon size={17} className="h-[17px] w-[17px] shrink-0" />
            <span className="truncate text-[12px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="mt-auto px-2.5 pb-0.5">
      <div className="relative overflow-hidden rounded-xl bg-[#AD9A85] p-2.5 pb-10 shadow-[inset_0_2px_6px_rgba(0,0,0,0.1)]">
        <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FAF7F2]">
          Brewed Rewards
        </p>
        <p className="mb-2 max-w-[7.5rem] text-[9px] leading-snug text-[#FAF7F2]/90">
          Get points &amp; get exclusive rewards!
        </p>
        <button
          type="button"
          className="rounded-full bg-[#EFE6DC] px-2.5 py-1 text-[9px] font-bold text-[#2D2118] shadow-sm transition hover:bg-white"
        >
          Join Now →
        </button>
        <div className="pointer-events-none absolute -bottom-1 -right-0.5 h-11 w-11">
          <Image
            src="https://img.icons8.com/3d-fluency/94/coffee-to-go.png"
            alt=""
            width={44}
            height={44}
            className="h-full w-full object-contain drop-shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
