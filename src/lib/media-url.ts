/**
 * Resolve stored image paths to URLs the customer kiosk can load.
 */
export function getMediaBaseUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_ADMIN_URL?.trim() ||
    process.env.ADMIN_PUBLIC_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    "";

  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return vercelUrl.startsWith("http")
      ? vercelUrl.replace(/\/$/, "")
      : `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return "";
}

export function trimMediaUrl(src: string | undefined | null): string {
  return src?.trim().replace(/[\r\n]+/g, "") ?? "";
}

export function resolveMediaUrl(src: string | undefined | null): string {
  const value = trimMediaUrl(src);
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  const base = getMediaBaseUrl();
  if (!base) return value;

  if (value.startsWith("/")) {
    return `${base}${value}`;
  }

  return `${base}/${value}`;
}

/** Same-origin proxy so images load reliably (blockers, referrer, mixed CDN). */
export function resolveCustomerMediaUrl(src: string | undefined | null): string {
  const absolute = resolveMediaUrl(src);
  if (!absolute) return "";

  if (absolute.startsWith("/") && !absolute.startsWith("//")) {
    return absolute;
  }

  if (/^https?:\/\//i.test(absolute)) {
    return `/api/image-proxy?url=${encodeURIComponent(absolute)}`;
  }

  return absolute;
}

export function isSupabaseMediaUrl(src: string | undefined | null): boolean {
  const value = trimMediaUrl(src);
  if (!value) return false;
  return /supabase\.co\/storage\//i.test(value);
}

export function isCustomUploadUrl(src: string | undefined | null): boolean {
  const value = resolveMediaUrl(src);
  if (!value) return false;
  return (
    isSupabaseMediaUrl(value) ||
    /\/api\/uploads\//i.test(value) ||
    /\/uploads\//i.test(value)
  );
}
