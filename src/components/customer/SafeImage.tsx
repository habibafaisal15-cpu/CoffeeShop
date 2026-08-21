"use client";

import Image from "next/image";
import { useState } from "react";

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
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return <>{fallback}</>;
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 40}
      height={height ?? 40}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
