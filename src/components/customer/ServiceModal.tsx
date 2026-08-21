"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BRANCH_NAME } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { IconCoffeeCup } from "@/components/icons/BrewedIcons";

function WheatSprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 20V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 10c-3-2-6-1-7 2M12 13c3-2 6-1 7 2M12 16c-3-2-6-1-7 2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GhibliOptionImage({
  src,
  alt,
  variant = "pickup",
}: {
  src: string;
  alt: string;
  variant?: "pickup" | "delivery";
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={`ghibli-hover-img h-full w-full object-cover object-center ${
        variant === "delivery" ? "ghibli-hover-img--delivery" : ""
      }`}
      loading="eager"
      decoding="async"
    />
  );
}

export function ServiceModal() {
  const showServiceModal = useCartStore((s) => s.showServiceModal);
  const setServiceType = useCartStore((s) => s.setServiceType);
  const setShowServiceModal = useCartStore((s) => s.setShowServiceModal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !showServiceModal) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#3E2723]/35 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Choose pickup or delivery"
      onClick={() => setShowServiceModal(false)}
    >
      <div
        className="pointer-events-auto relative w-full max-w-[760px] overflow-hidden rounded-[28px] border border-[#E8DCC8] bg-[#FAF6F0] shadow-[0_24px_80px_rgba(62,39,35,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "url(/images/service-modal-texture.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#E8C4BC]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-64 w-64 rounded-full bg-[#D5F1D1]/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-8 top-1/3 h-40 w-40 rounded-full bg-[#E8C4BC]/20 blur-2xl" />
        <div className="pointer-events-none absolute bottom-8 left-1/4 h-32 w-32 rounded-full bg-[#D5F1D1]/25 blur-2xl" />

        <div className="relative px-6 pb-6 pt-7 sm:px-10 sm:pb-8 sm:pt-9">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-2 sm:gap-3">
              <h2 className="font-serif text-[1.35rem] font-medium leading-[1.25] tracking-tight text-[#9A7B4F] sm:text-[1.65rem]">
                How would you like
                <br className="hidden sm:block" />
                <span className="sm:ml-0"> your cup of happiness?</span>
              </h2>
              <WheatSprig className="mt-1 h-6 w-6 shrink-0 text-[#C9A84C]/80 sm:mt-2 sm:h-7 sm:w-7" />
            </div>

            <div className="flex shrink-0 items-center gap-2 text-[#3E2723]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#3E2723]/15 bg-[#FAF6F0] shadow-sm">
                <IconCoffeeCup size={18} />
              </div>
              <div className="hidden text-right sm:block">
                <p className="font-serif text-sm font-bold leading-none text-[#3E2723]">
                  Brewed
                </p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#7D6B5D]">
                  Coffee House
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            <button
              type="button"
              onClick={() => setServiceType("pickup")}
              className="group flex flex-col overflow-hidden rounded-[22px] border-2 border-[#D4BC82] bg-[#FFFCF8]/90 p-4 text-left shadow-[0_8px_24px_rgba(62,39,35,0.08)] transition hover:border-[#C9A84C] hover:shadow-[0_12px_32px_rgba(62,39,35,0.12)] active:scale-[0.98] sm:p-5"
            >
              <div className="relative mb-4 h-[140px] overflow-hidden rounded-[16px] bg-[#FAF0E8] sm:h-[160px]">
                <GhibliOptionImage
                  src="/images/pickup-ghibli.png"
                  alt="Barista handing coffee to customer at pickup counter"
                  variant="pickup"
                />
              </div>
              <h3 className="text-center font-serif text-2xl font-semibold tracking-wide text-[#5C4A3A] sm:text-[1.7rem]">
                PICKUP
              </h3>
              <p className="mt-1 text-center text-sm text-[#8B7355]">
                at {BRANCH_NAME}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setServiceType("delivery")}
              className="group flex flex-col overflow-hidden rounded-[22px] border-2 border-[#D4BC82] bg-[#FFFCF8]/90 p-4 text-left shadow-[0_8px_24px_rgba(62,39,35,0.08)] transition hover:border-[#C9A84C] hover:shadow-[0_12px_32px_rgba(62,39,35,0.12)] active:scale-[0.98] sm:p-5"
            >
              <div className="relative mb-4 h-[140px] overflow-hidden rounded-[16px] bg-[#EEF4EA] sm:h-[160px]">
                <GhibliOptionImage
                  src="/images/delivery-ghibli.png"
                  alt="Delivery rider on scooter with coffee"
                  variant="delivery"
                />
              </div>
              <h3 className="text-center font-serif text-2xl font-semibold tracking-wide text-[#5C4A3A] sm:text-[1.7rem]">
                DELIVERY
              </h3>
              <p className="mt-1 text-center text-sm text-[#8B7355]">
                to your doorstep
              </p>
            </button>
          </div>

          <div className="mt-7 rounded-[18px] border border-[#D5E8D0]/60 bg-[#EEF5EA]/70 px-4 py-3.5 text-center sm:mt-8 sm:px-6 sm:py-4">
            <p className="text-sm font-medium text-[#4A3B32] sm:text-[0.95rem]">
              🎉 Earn up to{" "}
              <span className="font-bold text-[#6B8F63]">200 points</span> on
              Delivery and{" "}
              <span className="font-bold text-[#6B8F63]">100</span> on Pickup!
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
