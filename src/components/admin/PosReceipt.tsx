"use client";

import { Order } from "@/lib/types";
import { formatPKR } from "@/lib/store";

export interface PosReceiptMeta {
  customerName?: string;
  paymentMethod?: "cash" | "card";
  cashier?: string;
}

interface PosReceiptProps {
  order: Order;
  meta?: PosReceiptMeta;
  className?: string;
}

export function PosReceipt({ order, meta, className = "" }: PosReceiptProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const date = new Date(order.createdAt);

  return (
    <div className={`pos-receipt font-mono text-[#1a1a1a] ${className}`}>
      <div className="text-center">
        <p className="text-lg font-bold tracking-wide">BREWED COFFEE HOUSE</p>
        <p className="text-[11px] text-[#444]">Walk-in · Counter Sale</p>
        <p className="mt-1 text-[10px] text-[#666]">
          {date.toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="my-3 border-t border-dashed border-[#999]" />

      <div className="space-y-0.5 text-[11px]">
        <p>
          <span className="text-[#666]">Order:</span> {order.id}
        </p>
        {meta?.customerName?.trim() && (
          <p>
            <span className="text-[#666]">Customer:</span> {meta.customerName}
          </p>
        )}
        {meta?.paymentMethod && (
          <p>
            <span className="text-[#666]">Payment:</span>{" "}
            {meta.paymentMethod === "cash" ? "Cash" : "Card"}
          </p>
        )}
        <p>
          <span className="text-[#666]">Items:</span> {itemCount}
        </p>
      </div>

      <div className="my-3 border-t border-dashed border-[#999]" />

      <div className="space-y-2 text-[11px]">
        {order.items.map((item) => (
          <div key={item.productId} className="flex justify-between gap-2">
            <span className="min-w-0 flex-1">
              {item.quantity}× {item.name}
            </span>
            <span className="shrink-0">{formatPKR(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="my-3 border-t border-dashed border-[#999]" />

      <div className="flex justify-between text-sm font-bold">
        <span>TOTAL</span>
        <span>{formatPKR(order.total)}</span>
      </div>

      <div className="my-3 border-t border-dashed border-[#999]" />

      <p className="text-center text-[10px] leading-relaxed text-[#555]">
        Thank you for visiting Brewed!
        <br />
        See you again soon.
      </p>
    </div>
  );
}

export function printPosReceipt() {
  window.print();
}
