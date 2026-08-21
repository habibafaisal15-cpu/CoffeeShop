"use client";

import Image from "next/image";
import { useState } from "react";
import { resolveMediaUrl } from "@/lib/media-url";

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
  const resolved = resolveMediaUrl(src);
  const [failed, setFailed] = useState(false);

  if (failed || !resolved) {
    return <>{fallback}</>;
  }

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width ?? 40}
      height={height ?? 40}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
