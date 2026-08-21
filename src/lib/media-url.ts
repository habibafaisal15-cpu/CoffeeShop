/**
 * Turn stored image paths into absolute URLs both deployments can load.
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

export function resolveMediaUrl(src: string | undefined | null): string {
  const value = src?.trim() ?? "";
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  const base = getMediaBaseUrl();
  if (!base) return value;

  if (value.startsWith("/")) {
    return `${base}${value}`;
  }

  return `${base}/${value}`;
}

export function isSupabaseMediaUrl(src: string | undefined | null): boolean {
  const value = src?.trim() ?? "";
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
