export type SiteMode = "full" | "customer" | "admin";

export function getSiteMode(): SiteMode {
  const mode = process.env.SITE_MODE?.trim().toLowerCase();
  if (mode === "customer" || mode === "admin") return mode;
  return "full";
}

export function isCustomerSite() {
  const mode = getSiteMode();
  return mode === "customer" || mode === "full";
}

export function isAdminSite() {
  const mode = getSiteMode();
  return mode === "admin" || mode === "full";
}

export function getLinkedCustomerUrl() {
  return process.env.NEXT_PUBLIC_CUSTOMER_URL?.trim() || "";
}

export function getLinkedAdminUrl() {
  return process.env.NEXT_PUBLIC_ADMIN_URL?.trim() || "";
}
