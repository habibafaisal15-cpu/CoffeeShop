/**
 * Turn stored image paths into absolute URLs both deployments can load.
 * - Supabase / external https URLs pass through unchanged
 * - Relative /uploads or /api/uploads paths resolve via admin or app base URL
 */
export function resolveMediaUrl(src: string | undefined | null): string {
  const value = src?.trim() ?? "";
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;

  const base =
    process.env.NEXT_PUBLIC_ADMIN_URL?.replace(/\/$/, "") ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    "";

  if (!base) return value;

  if (value.startsWith("/")) {
    return `${base}${value}`;
  }

  return `${base}/${value}`;
}
