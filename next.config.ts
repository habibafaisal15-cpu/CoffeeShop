import type { NextConfig } from "next";
import path from "path";

function adminImageHost(): string | null {
  const adminUrl =
    process.env.NEXT_PUBLIC_ADMIN_URL?.trim() ||
    process.env.ADMIN_PUBLIC_URL?.trim();
  if (!adminUrl) return null;
  try {
    return new URL(adminUrl).hostname;
  } catch {
    return null;
  }
}

const adminHost = adminImageHost();

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "img.icons8.com" },
      { protocol: "https", hostname: "bgupvqeccxztvkfuvefl.supabase.co" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.vercel.app" },
      ...(adminHost
        ? [{ protocol: "https" as const, hostname: adminHost }]
        : []),
    ],
  },
};

export default nextConfig;
