"use client";

import { useState } from "react";
import { IconCoffeeCup } from "@/components/icons/BrewedIcons";

interface CategoryImageProps {
  src: string;
  alt: string;
}

export function CategoryImage({ src, alt }: CategoryImageProps) {
  const [failed, setFailed] = useState(false);
  const url = src?.trim();

  if (!url || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#EDE4D6]/80">
        <IconCoffeeCup size={22} className="text-[#5C4A3D]/40" />
      </div>
    );
  }

  const isIcon =
    url.includes("icons8.com") || url.includes("img.icons8");

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={`h-full w-full ${isIcon ? "object-contain p-1.5" : "object-cover"}`}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
