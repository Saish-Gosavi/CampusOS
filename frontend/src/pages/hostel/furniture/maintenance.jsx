import { useMemo, useState } from "react";
import { createFileRoute } from "@/routes/compat";
import { Wrench, CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";
import { StatusPill } from "@/components/hostel/StatusPill";
import { furnitureItems } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/furniture/maintenance")({
  component: MaintenancePage
});
function MaintenancePage() {
  const [query, setQuery] = useState("");
  const rows = useMemo(() => {
    let list = furnitureItems.filter((f) => f.status === "Under Maintenance");
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((f) => f.code.toLowerCase().includes(q) || f.room.toLowerCase().includes(q));
    }
    return list;
  }, [query]);
  const stats = useMemo(() => ({
    inWorkshop: furnitureItems.filter((f) => f.status === "Under Maintenance").length,
    resolvedThisMonth: 4,
    avgDays: 3
  }), []);
  return <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Tile icon={Wrench} label="In Workshop" value={String(stats.inWorkshop)} hint="Currently servicing" tint="#F59E0B" />
        <Tile icon={CheckCircle2} label="Resolved (30d)" value={String(stats.resolvedThisMonth)} hint="Returned to service" tint="#22C55E" />
        <Tile icon={Wrench} label="Avg Turnaround" value={`${stats.avgDays} days`} hint="From report to fix" tint="#3B82F6" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-sm font-semibold text-foreground">Under Maintenance</h3>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item or room" className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm" />
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
                <th className="px-3 py-2 font-medium">Issue</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((f) => <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-semibold">{f.code}</td>
                  <td className="whitespace-nowrap px-3 py-3">{f.category}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{f.hostel} · {f.room}</td>
                  <td className="px-3 py-3"><StatusPill status={f.condition} /></td>
                  <td className="px-3 py-3"><StatusPill status={f.status} /></td>
                  <td className="px-3 py-3 text-muted-foreground">{f.notes ?? "\u2014"}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => toast.success(`${f.code} marked resolved`)} className="inline-flex items-center gap-1 rounded-md bg-[#22C55E] px-2 py-1 text-xs text-white hover:bg-[#16A34A]">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
                      </button>
                      <button onClick={() => toast.success(`Work log updated for ${f.code}`)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">
                        Log Update
                      </button>
                    </div>
                  </td>
                </tr>)}
              {rows.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-sm text-muted-foreground">No items under maintenance.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
function Tile({ icon: Icon, label, value, hint, tint }) {
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold" style={{ color: tint }}>{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${tint}1a`, color: tint }}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>;
}
export {
  Route
};
