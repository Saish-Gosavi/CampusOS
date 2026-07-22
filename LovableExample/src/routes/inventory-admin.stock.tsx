import { createFileRoute } from "@tanstack/react-router";
import { Boxes, ArrowUp, ArrowDown } from "lucide-react";
import { InventoryPageHeader } from "@/components/inventory/InventoryPageHeader";
import { InventoryStatusPill } from "@/components/inventory/InventoryStatusPill";
import { Button } from "@/components/ui/button";
import { inventoryItems } from "@/lib/inventory-data";

export const Route = createFileRoute("/inventory-admin/stock")({
  component: StockPage,
});

function StockPage() {
  const totals = inventoryItems.reduce(
    (acc, i) => {
      acc.total += i.available;
      if (i.status === "Low Stock") acc.low += 1;
      if (i.status === "Out of Stock") acc.out += 1;
      return acc;
    },
    { total: 0, low: 0, out: 0 },
  );

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <InventoryPageHeader
        title="Stock Management"
        description="Adjust quantities, reconcile counts and monitor reorder levels."
        icon={Boxes}
        tint="#0D9488"
        breadcrumbs={[{ label: "Stock Management" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Units in Stock</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{totals.total.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
          <p className="mt-2 text-2xl font-bold text-[#EAB308]">{totals.low}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
          <p className="mt-2 text-2xl font-bold text-[#EF4444]">{totals.out}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between px-1 pb-3">
          <h2 className="text-base font-semibold text-foreground">Stock Adjustments</h2>
          <span className="text-xs text-muted-foreground">Add or remove stock per item</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Item</th>
                <th className="px-3 py-2 font-medium">Location</th>
                <th className="px-3 py-2 font-medium">Available</th>
                <th className="px-3 py-2 font-medium">Min Stock</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventoryItems.map((i) => (
                <tr key={i.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="font-medium text-foreground">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.sku}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{i.location}</td>
                  <td className="px-3 py-3 font-semibold text-foreground">
                    {i.available} <span className="text-xs font-normal text-muted-foreground">{i.unit}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{i.minStock}</td>
                  <td className="px-3 py-3"><InventoryStatusPill status={i.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="outline" className="h-8 border-[#22C55E] text-[#16A34A] hover:bg-[#22C55E]/10">
                        <ArrowUp className="mr-1 h-3.5 w-3.5" /> Stock In
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10">
                        <ArrowDown className="mr-1 h-3.5 w-3.5" /> Stock Out
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
