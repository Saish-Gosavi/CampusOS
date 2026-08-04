import { useMemo, useState } from "react";
import { createFileRoute } from "@/routes/compat";
import { Armchair, Search, Eye, ArrowRightLeft, AlertTriangle, Wrench, Plus, Download } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { furnitureItems } from "@/lib/hostel-data";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/warden/furniture")({
  component: FurniturePage
});
const TINT = "#EAB308";
const tabs = ["Furniture List", "Room-wise", "Damaged", "Maintenance", "History"];
function FurniturePage() {
  const [tab, setTab] = useState("Furniture List");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [status, setStatus] = useState("All");
  const cats = useMemo(() => ["All", ...Array.from(new Set(furnitureItems.map((f) => f.category)))], []);
  const byTab = useMemo(() => {
    if (tab === "Damaged") return furnitureItems.filter((f) => f.condition === "Damaged");
    if (tab === "Maintenance") return furnitureItems.filter((f) => f.status === "Under Maintenance");
    if (tab === "History") return furnitureItems.filter((f) => f.status === "Replaced" || f.status === "Retired");
    return furnitureItems;
  }, [tab]);
  const filtered = useMemo(() => {
    return byTab.filter((f) => {
      if (cat !== "All" && f.category !== cat) return false;
      if (status !== "All" && f.status !== status) return false;
      if (q) {
        const t = q.toLowerCase();
        return f.code.toLowerCase().includes(t) || f.room.toLowerCase().includes(t) || (f.assignedTo?.toLowerCase().includes(t) ?? false);
      }
      return true;
    });
  }, [byTab, q, cat, status]);
  const total = furnitureItems.length;
  const inUse = furnitureItems.filter((f) => f.status === "In Use" || f.status === "Assigned").length;
  const available = furnitureItems.filter((f) => f.status === "In Storage").length;
  const damaged = furnitureItems.filter((f) => f.condition === "Damaged").length;
  const maint = furnitureItems.filter((f) => f.status === "Under Maintenance").length;
  const byRoom = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    furnitureItems.forEach((f) => {
      const arr = map.get(f.room) ?? [];
      arr.push(f);
      map.set(f.room, arr);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, []);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Furniture Management"
    description="Track, assign and maintain hostel furniture in your assigned blocks."
    icon={Armchair}
    tint={TINT}
    breadcrumbs={[{ label: "Furniture" }]}
    action={<div className="flex gap-2">
            <Button variant="outline"><Download className="mr-1.5 h-4 w-4" /> Export</Button>
            <Button style={{ backgroundColor: TINT }} className="text-slate-900 hover:opacity-90"><Plus className="mr-1.5 h-4 w-4" /> Assign Item</Button>
          </div>}
  />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total Furniture" value={String(total)} delta="Across all rooms" trend="up" icon={Armchair} tint="#2563EB" />
        <StatCard label="In Use" value={String(inUse)} delta={`${Math.round(inUse / total * 100)}% assigned`} trend="up" icon={Armchair} tint="#22C55E" />
        <StatCard label="Available" value={String(available)} delta="In storage" trend="up" icon={Armchair} tint="#06B6D4" />
        <StatCard label="Damaged" value={String(damaged)} delta="Need attention" trend="down" icon={AlertTriangle} tint="#EF4444" />
        <StatCard label="Maintenance" value={String(maint)} delta="Under repair" trend="down" icon={Wrench} tint="#EAB308" />
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tabs.map((t) => <button
    key={t}
    onClick={() => setTab(t)}
    className={cn(
      "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      tab === t ? "text-slate-900 shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
    style={tab === t ? { backgroundColor: TINT } : void 0}
  >
            {t}
          </button>)}
      </div>

      {tab === "Room-wise" ? <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {byRoom.map(([room, items]) => <div key={room} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">Room {room}</h3>
                <span className="rounded-full bg-[#EAB308]/10 px-2 py-0.5 text-xs font-medium text-[#B45309]">{items.length} items</span>
              </div>
              <ul className="mt-3 divide-y divide-border">
                {items.map((f) => <li key={f.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{f.category}</p>
                      <p className="truncate text-xs text-muted-foreground">{f.code}</p>
                    </div>
                    <StatusPill status={f.status} />
                  </li>)}
              </ul>
            </div>)}
        </div> : <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by code, room or assignee..." className="h-10 pl-9" />
            </div>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              {["All", "In Use", "Assigned", "In Storage", "Under Maintenance", "Replaced", "Retired"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-3 pr-2">Code</th>
                  <th className="py-3 pr-2">Category</th>
                  <th className="py-3 pr-2">Room</th>
                  <th className="py-3 pr-2">Assigned</th>
                  <th className="py-3 pr-2">Condition</th>
                  <th className="py-3 pr-2">Status</th>
                  <th className="py-3 pr-2">Last Inspected</th>
                  <th className="py-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => <tr key={f.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                    <td className="py-3 pr-2 font-mono text-xs">{f.code}</td>
                    <td className="py-3 pr-2">{f.category}</td>
                    <td className="py-3 pr-2 font-medium">{f.room}</td>
                    <td className="py-3 pr-2 text-xs text-muted-foreground">{f.assignedTo ?? "\u2014"}</td>
                    <td className="py-3 pr-2"><StatusPill status={f.condition} /></td>
                    <td className="py-3 pr-2"><StatusPill status={f.status} /></td>
                    <td className="py-3 pr-2 text-xs">{f.lastInspected ?? "\u2014"}</td>
                    <td className="py-3 pr-2">
                      <div className="flex items-center justify-end gap-1">
                        <button title="View" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-3.5 w-3.5" /></button>
                        <button title="Transfer" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><ArrowRightLeft className="h-3.5 w-3.5" /></button>
                        <button title="Report damage" className="grid h-7 w-7 place-items-center rounded-md text-[#DC2626] hover:bg-[#EF4444]/10"><AlertTriangle className="h-3.5 w-3.5" /></button>
                        <button title="Request maintenance" className="grid h-7 w-7 place-items-center rounded-md text-[#B45309] hover:bg-[#EAB308]/10"><Wrench className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>)}
                {filtered.length === 0 && <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No furniture items</td></tr>}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
}
export {
  Route
};
