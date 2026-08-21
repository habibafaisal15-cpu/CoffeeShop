import { OrderStatus } from "@/lib/types";
import { ORDER_STATUS_LABELS } from "@/lib/types";

const COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  "out-for-delivery": "bg-purple-100 text-purple-800",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${COLORS[status]}`}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
