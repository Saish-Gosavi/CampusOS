import { createFileRoute } from "@tanstack/react-router";
import { Truck, Plus } from "lucide-react";
import { InventoryPageHeader } from "@/components/inventory/InventoryPageHeader";
import { InventoryStatusPill } from "@/components/inventory/InventoryStatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { goodsReceipts } from "@/lib/inventory-data";
const Route = createFileRoute("/inventory-admin/receipts")({
  component: ReceiptsPage
});
function ReceiptsPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <InventoryPageHeader
    title="Goods Receipt"
    description="Log incoming shipments and mark them ready for stock."
    icon={Truck}
    tint="#7B4CED"
    breadcrumbs={[{ label: "Goods Receipt" }]}
    action={<Button className="bg-[#7B4CED] hover:bg-[#6b3ed6]">
            <Plus className="mr-1.5 h-4 w-4" /> New GRN
          </Button>}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
          <h2 className="text-base font-semibold text-foreground">Record Receipt</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Match to a purchase order if available</p>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Vendor</Label>
              <Input placeholder="e.g. Office Stationers Pvt Ltd" />
            </div>
            <div className="space-y-1.5">
              <Label>Item</Label>
              <Input placeholder="e.g. A4 Paper (500 sheets)" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Quantity</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label>Received On</Label>
                <Input type="date" />
              </div>
            </div>
            <Button className="mt-2 w-full bg-[#7B4CED] hover:bg-[#6b3ed6]">
              <Truck className="mr-1.5 h-4 w-4" /> Create GRN
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between px-1 pb-3">
            <h2 className="text-base font-semibold text-foreground">Recent Receipts</h2>
            <span className="text-xs text-muted-foreground">{goodsReceipts.length} entries</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">GRN</th>
                  <th className="px-3 py-2 font-medium">Vendor</th>
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 font-medium">Qty</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {goodsReceipts.map((g) => <tr key={g.id} className="hover:bg-muted/40">
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{g.grn}</td>
                    <td className="px-3 py-3 text-foreground">{g.vendor}</td>
                    <td className="px-3 py-3 text-foreground">{g.item}</td>
                    <td className="px-3 py-3 text-foreground">{g.quantity}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{g.receivedOn}</td>
                    <td className="px-3 py-3"><InventoryStatusPill status={g.status} /></td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Route
};
