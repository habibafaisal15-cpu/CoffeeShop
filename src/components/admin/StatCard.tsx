import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
}

export function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="admin-card p-6">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${accent ?? "bg-sage-light/40"}`}
      >
        <Icon className="h-5 w-5 text-sage-deep" />
      </div>
      <p className="text-2xl font-semibold text-coffee">{value}</p>
      <p className="text-sm text-coffee-muted">{label}</p>
    </div>
  );
}
