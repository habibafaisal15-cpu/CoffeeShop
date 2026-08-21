"use client";

import { useState } from "react";
import { resolveCustomerMediaUrl } from "@/lib/media-url";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  fallback: React.ReactNode;
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  fallback,
}: SafeImageProps) {
  const resolved = resolveCustomerMediaUrl(src);
  const [failed, setFailed] = useState(false);

  if (!resolved || failed) {
    return <>{fallback}</>;
  }

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        className={`absolute inset-0 h-full w-full ${className ?? "object-cover"}`}
        loading="eager"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      width={width ?? 40}
      height={height ?? 40}
      className={className}
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
