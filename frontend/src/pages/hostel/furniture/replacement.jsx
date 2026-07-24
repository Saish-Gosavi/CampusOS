import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCcw, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/hostel/StatusPill";
import { furnitureItems } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/furniture/replacement")({
  component: ReplacementPage
});
const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
function ReplacementPage() {
  const [query, setQuery] = useState("");
  const replaced = useMemo(() => furnitureItems.filter((f) => f.status === "Replaced" || f.status === "Retired"), []);
  const pending = useMemo(() => furnitureItems.filter((f) => f.condition === "Damaged" && f.status !== "Replaced"), []);
  const rows = useMemo(() => {
    if (!query.trim()) return replaced;
    const q = query.toLowerCase();
    return replaced.filter((f) => f.code.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
  }, [query, replaced]);
  const totalCost = replaced.reduce((s, f) => s + f.cost, 0);
  return <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Tile label="Replaced / Retired" value={String(replaced.length)} hint="Lifetime" tint="#3B82F6" />
        <Tile label="Pending Replacement" value={String(pending.length)} hint="Damaged items" tint="#EF4444" />
        <Tile label="Total Replacement Cost" value={INR.format(totalCost)} hint="Recorded to date" tint="#7B4CED" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Raise Replacement Request</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Request procurement of a new item to replace a damaged one.</p>
          </div>
          <Button onClick={() => toast.success("Replacement request raised \u2014 pending procurement")} style={{ backgroundColor: "#7B4CED" }} className="text-white hover:opacity-90">
            <Plus className="mr-1.5 h-4 w-4" /> New Request
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-sm font-semibold text-foreground">Replacement History</h3>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item or category" className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Furniture ID</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Room</th>
                <th className="px-3 py-2 font-medium">Cost</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Notes</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((f) => <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-semibold">{f.code}</td>
                  <td className="whitespace-nowrap px-3 py-3">{f.category}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{f.hostel} · {f.room}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold">{INR.format(f.cost)}</td>
                  <td className="px-3 py-3"><StatusPill status={f.status} /></td>
                  <td className="px-3 py-3 text-muted-foreground">{f.notes ?? "\u2014"}</td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => toast.success(`Procurement re-triggered for ${f.code}`)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">
                      <RefreshCcw className="h-3.5 w-3.5" /> Re-order
                    </button>
                  </td>
                </tr>)}
              {rows.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-sm text-muted-foreground">No replacements on record.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
function Tile({ label, value, hint, tint }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold" style={{ color: tint }}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>;
}
export {
  Route
};
