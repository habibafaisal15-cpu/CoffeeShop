"use client";

import { PosTerminal } from "@/components/admin/PosTerminal";
import { PageHeader } from "@/components/admin/PageHeader";

export default function AdminPosPage() {
  return (
    <div>
      <PageHeader
        title="Walk-in POS"
        description="Take counter orders, complete sales, and print receipts"
      />
      <PosTerminal />
    </div>
  );
}
