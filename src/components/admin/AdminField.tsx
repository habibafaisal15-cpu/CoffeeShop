import { ReactNode } from "react";

export function AdminField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`block ${className ?? ""}`}>
      <span className="mb-1 block text-xs font-medium text-coffee-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`admin-card ${className ?? ""}`}>{children}</div>
  );
}
