import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Package, Plus, Search, Filter, Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { InventoryPageHeader } from "@/components/inventory/InventoryPageHeader";
import { InventoryStatusPill } from "@/components/inventory/InventoryStatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { inventoryItems } from "@/lib/inventory-data";
const Route = createFileRoute("/inventory-admin/items")({
  component: ItemsPage
});
const PAGE_SIZE = 7;
function ItemsPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(inventoryItems.map((i) => i.category)))],
    []
  );
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return inventoryItems.filter((i) => {
      const matchesQ = !query || i.name.toLowerCase().includes(query) || i.sku.toLowerCase().includes(query) || i.location.toLowerCase().includes(query);
      const matchesCat = category === "All" || i.category === category;
      return matchesQ && matchesCat;
    });
  }, [q, category]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <InventoryPageHeader
    title="Inventory Items"
    description="Every item tracked across stores, labs and departments."
    icon={Package}
    tint="#2563EB"
    breadcrumbs={[{ label: "Inventory Items" }]}
    action={<Button className="bg-[#2563EB] hover:bg-[#1e4fd1]">
            <Plus className="mr-1.5 h-4 w-4" /> Add Item
          </Button>}
  />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
    value={q}
    onChange={(e) => {
      setQ(e.target.value);
      setPage(1);
    }}
    placeholder="Search by name, SKU or location"
    className="h-10 pl-9"
  />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
    value={category}
    onChange={(e) => {
      setCategory(e.target.value);
      setPage(1);
    }}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
  >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Item</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Available</th>
                <th className="px-3 py-2 font-medium">Min Stock</th>
                <th className="px-3 py-2 font-medium">Location</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {current.map((i) => {
    const pct = Math.min(100, Math.round(i.available / Math.max(1, i.minStock * 2) * 100));
    const barColor = i.status === "Out of Stock" ? "#EF4444" : i.status === "Low Stock" ? "#EAB308" : "#22C55E";
    return <tr key={i.id} className="transition-colors hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="font-medium text-foreground">{i.name}</div>
                      <div className="text-xs text-muted-foreground">{i.sku}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-foreground">{i.category}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {i.available} <span className="text-xs font-normal text-muted-foreground">{i.unit}</span>
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{i.minStock}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{i.location}</td>
                    <td className="px-3 py-3"><InventoryStatusPill status={i.status} /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>;
  })}
              {current.length === 0 && <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">
                    No items match your filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    disabled={page === 1}
    className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-50"
  >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <button
    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    disabled={page === totalPages}
    className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-50"
  >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Route
};
