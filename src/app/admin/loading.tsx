export default function AdminLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-sage-deep border-t-transparent" />
      <p className="text-sm text-coffee-muted">Loading admin panel…</p>
    </div>
  );
}
