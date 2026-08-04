import { createFileRoute } from "@/routes/compat";
import { ClipboardList, Plus, Eye } from "lucide-react";
import { InventoryPageHeader } from "@/components/inventory/InventoryPageHeader";
import { InventoryStatusPill } from "@/components/inventory/InventoryStatusPill";
import { Button } from "@/components/ui/button";
import { procurementRequests } from "@/lib/inventory-data";
const Route = createFileRoute("/inventory-admin/requests")({
  component: RequestsPage
});
function RequestsPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <InventoryPageHeader
    title="Procurement Requests"
    description="Requests raised by departments for new inventory."
    icon={ClipboardList}
    tint="#7B4CED"
    breadcrumbs={[{ label: "Procurement Requests" }]}
    action={<Button className="bg-[#7B4CED] hover:bg-[#6b3ed6]">
            <Plus className="mr-1.5 h-4 w-4" /> New Request
          </Button>}
  />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Requester</th>
                <th className="px-3 py-2 font-medium">Department</th>
                <th className="px-3 py-2 font-medium">Item</th>
                <th className="px-3 py-2 font-medium">Qty</th>
                <th className="px-3 py-2 font-medium">Raised</th>
                <th className="px-3 py-2 font-medium">Priority</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {procurementRequests.map((r) => <tr key={r.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3 font-medium text-foreground">{r.requester}</td>
                  <td className="px-3 py-3 text-foreground">{r.department}</td>
                  <td className="px-3 py-3 text-foreground">{r.item}</td>
                  <td className="px-3 py-3 text-foreground">{r.quantity}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{r.raisedOn}</td>
                  <td className="px-3 py-3"><InventoryStatusPill status={r.priority} /></td>
                  <td className="px-3 py-3"><InventoryStatusPill status={r.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
export {
  Route
};
