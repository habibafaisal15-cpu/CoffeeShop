"use client";

interface CategoryImageProps {
  src: string;
  alt: string;
}

export function CategoryImage({ src, alt }: CategoryImageProps) {
  const url = src?.trim();
  if (!url) return null;

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
    />
  );
}
