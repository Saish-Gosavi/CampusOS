import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Wrench, RefreshCcw, Search } from "lucide-react";
import { toast } from "sonner";
import { StatusPill } from "@/components/hostel/StatusPill";
import { furnitureItems } from "@/lib/hostel-data";

export const Route = createFileRoute("/hostel-admin/furniture/damaged")({
  component: DamagedItemsPage,
});

function DamagedItemsPage() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    let list = furnitureItems.filter((f) => f.condition === "Damaged");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) => f.code.toLowerCase().includes(q) || f.room.toLowerCase().includes(q) || f.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-4">
        <div className="flex items-center gap-2 text-[#DC2626]">
          <AlertTriangle className="h-5 w-5" />
          <p className="text-sm font-semibold">{rows.length} damaged item(s) require attention</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-sm font-semibold text-foreground">Damaged Items</h3>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ID, room, category" className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Furniture ID</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Room</th>
                <th className="px-3 py-2 font-medium">Condition</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Reported On</th>
                <th className="px-3 py-2 font-medium">Notes</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((f) => (
                <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-semibold">{f.code}</td>
                  <td className="whitespace-nowrap px-3 py-3">{f.category}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{f.hostel} · {f.room}</td>
                  <td className="px-3 py-3"><StatusPill status={f.condition} /></td>
                  <td className="px-3 py-3"><StatusPill status={f.status} /></td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{f.lastInspected ?? "—"}</td>
                  <td className="px-3 py-3 text-muted-foreground">{f.notes ?? "—"}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => toast.success(`${f.code} scheduled for maintenance`)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">
                        <Wrench className="h-3.5 w-3.5" /> Send to Maintenance
                      </button>
                      <button onClick={() => toast.success(`${f.code} marked for replacement`)} className="inline-flex items-center gap-1 rounded-md bg-[#7B4CED] px-2 py-1 text-xs text-white hover:opacity-90">
                        <RefreshCcw className="h-3.5 w-3.5" /> Replace
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-sm text-muted-foreground">No damaged items 🎉</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
