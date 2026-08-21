import { getLinkedCustomerUrl } from "@/lib/site-mode";

const PRODUCTION_CUSTOMER_URL =
  getLinkedCustomerUrl() || "https://coffee-pos-coral.vercel.app";

export function CustomerDbError() {
  const isPreview = process.env.VERCEL_ENV === "preview";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#E8DFD4] p-6">
      <div className="max-w-lg rounded-3xl border border-[#C4B5A5] bg-[#FAF7F2] p-8 shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B7355]">
          Brewed Coffee House
        </p>
        <h1 className="mt-3 font-serif text-2xl text-[#2A1E17]">
          Customer kiosk is not connected to the database
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C4A3D]">
          {isPreview
            ? "This is a Vercel preview link. It does not have DATABASE_URL configured, so admin changes will not appear here."
            : "DATABASE_URL is missing on this deployment, so menu data cannot load from the admin panel."}
        </p>
        <p className="mt-4 text-sm text-[#5C4A3D]">
          Open the live customer site instead:
        </p>
        <a
          href={PRODUCTION_CUSTOMER_URL}
          className="mt-4 inline-flex rounded-full bg-[#8EB67D] px-6 py-3 text-sm font-semibold text-[#2A1E17] transition hover:bg-[#7DA56E]"
        >
          {PRODUCTION_CUSTOMER_URL.replace(/^https?:\/\//, "")}
        </a>
        <p className="mt-6 text-xs text-[#8B7355]">
          Admin panel:{" "}
          <a
            href="https://coffee-shop-pos-eight.vercel.app/admin"
            className="underline"
          >
            coffee-shop-pos-eight.vercel.app/admin
          </a>
        </p>
      </div>
    </div>
  );
}
