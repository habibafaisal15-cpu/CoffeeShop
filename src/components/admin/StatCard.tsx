import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: string;
}

export function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="admin-card p-4 sm:p-6">
      <div
        className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl sm:mb-3 sm:h-10 sm:w-10 ${accent ?? "bg-sage-light/40"}`}
      >
        <Icon className="h-4 w-4 text-sage-deep sm:h-5 sm:w-5" />
      </div>
      <p className="text-lg font-semibold text-coffee sm:text-2xl">{value}</p>
      <p className="text-xs text-coffee-muted sm:text-sm">{label}</p>
    </div>
  );
}
