import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightLeft, BookUp, Undo2 } from "lucide-react";
import { InventoryPageHeader } from "@/components/inventory/InventoryPageHeader";
import { InventoryStatusPill } from "@/components/inventory/InventoryStatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { borrowings } from "@/lib/inventory-data";
const Route = createFileRoute("/inventory-admin/borrowing")({
  component: BorrowingPage
});
function BorrowingPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <InventoryPageHeader
    title="Borrow & Return"
    description="Track items lent to departments, events and clubs."
    icon={ArrowRightLeft}
    tint="#3B82F6"
    breadcrumbs={[{ label: "Borrow & Return" }]}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
          <h2 className="text-base font-semibold text-foreground">Issue an Item</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Lend to a department or event</p>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Borrower / Department</Label>
              <Input placeholder="e.g. EXTC Seminar Hall" />
            </div>
            <div className="space-y-1.5">
              <Label>Item (SKU or name)</Label>
              <Input placeholder="e.g. Epson EB-X51 Projector" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Quantity</Label>
                <Input type="number" placeholder="1" />
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <Button className="mt-2 w-full bg-primary hover:bg-primary/90">
              <BookUp className="mr-1.5 h-4 w-4" /> Issue Item
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between px-1 pb-3">
            <h2 className="text-base font-semibold text-foreground">Active & Recent Borrowings</h2>
            <span className="text-xs text-muted-foreground">{borrowings.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Borrower</th>
                  <th className="px-3 py-2 font-medium">Item</th>
                  <th className="px-3 py-2 font-medium">Qty</th>
                  <th className="px-3 py-2 font-medium">Due</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {borrowings.map((b) => <tr key={b.id} className="hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="font-medium text-foreground">{b.borrower}</div>
                      <div className="text-xs text-muted-foreground">{b.department}</div>
                    </td>
                    <td className="px-3 py-3 text-foreground">{b.item}</td>
                    <td className="px-3 py-3 text-foreground">{b.quantity}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-foreground">{b.dueDate}</td>
                    <td className="px-3 py-3"><InventoryStatusPill status={b.status} /></td>
                    <td className="px-3 py-3 text-right">
                      {b.status !== "Returned" && <Button size="sm" variant="outline" className="h-8 border-[#22C55E] text-[#16A34A] hover:bg-[#22C55E]/10">
                          <Undo2 className="mr-1 h-3.5 w-3.5" /> Return
                        </Button>}
                    </td>
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
