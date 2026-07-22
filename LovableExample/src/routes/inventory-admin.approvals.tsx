import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, Check, X } from "lucide-react";
import { InventoryPageHeader } from "@/components/inventory/InventoryPageHeader";
import { InventoryStatusPill } from "@/components/inventory/InventoryStatusPill";
import { Button } from "@/components/ui/button";
import { procurementRequests } from "@/lib/inventory-data";

export const Route = createFileRoute("/inventory-admin/approvals")({
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const pending = procurementRequests.filter((r) => r.status === "Pending");

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <InventoryPageHeader
        title="Approvals"
        description="Review and approve pending procurement requests."
        icon={ClipboardCheck}
        tint="#22C55E"
        breadcrumbs={[{ label: "Approvals" }]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pending.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-foreground">{r.item}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Qty {r.quantity} · raised {r.raisedOn}
                </p>
              </div>
              <InventoryStatusPill status={r.priority} />
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm">
              <p className="font-medium text-foreground">{r.requester}</p>
              <p className="text-xs text-muted-foreground">{r.department} department</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button className="flex-1 bg-[#22C55E] hover:bg-[#16A34A]" size="sm">
                <Check className="mr-1 h-3.5 w-3.5" /> Approve
              </Button>
              <Button variant="outline" size="sm" className="flex-1 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10">
                <X className="mr-1 h-3.5 w-3.5" /> Reject
              </Button>
            </div>
          </div>
        ))}
        {pending.length === 0 && (
          <div className="col-span-full grid place-items-center rounded-xl border border-dashed border-border bg-card p-12 text-sm text-muted-foreground">
            No pending approvals right now.
          </div>
        )}
      </div>
    </div>
  );
}
