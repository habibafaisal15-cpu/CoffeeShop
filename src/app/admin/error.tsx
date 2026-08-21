"use client";

import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="admin-card mx-auto max-w-md p-8 text-center">
      <h2 className="font-serif text-xl text-coffee">Admin failed to load</h2>
      <p className="mt-2 text-sm text-coffee-muted">
        {error.message || "Something went wrong. Try refreshing or restarting the dev server."}
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={reset} className="admin-btn-primary">
          Try again
        </button>
        <Link href="/" className="admin-btn-secondary">
          Back to Kiosk
        </Link>
      </div>
      <p className="mt-4 text-xs text-coffee-muted">
        If this persists, run{" "}
        <code className="rounded bg-cream px-1">npm run dev:clean</code>
      </p>
    </div>
  );
}
