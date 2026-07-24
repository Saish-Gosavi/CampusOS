import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Blocks, Plus, Search, Filter, Pencil, Trash2, Building2, Layers, DoorClosed } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { blocks as allBlocks, hostels } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/blocks/")({
  component: BlocksPage
});
function BlocksPage() {
  const [q, setQ] = useState("");
  const [hostelId, setHostelId] = useState("All");
  const [status, setStatus] = useState("All");
  const hostelName = (id) => hostels.find((h) => h.id === id)?.name ?? "\u2014";
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return allBlocks.filter((b) => {
      const hn = hostelName(b.hostelId).toLowerCase();
      const mQ = !query || b.name.toLowerCase().includes(query) || hn.includes(query) || b.inCharge.toLowerCase().includes(query);
      const mH = hostelId === "All" || b.hostelId === hostelId;
      const mS = status === "All" || b.status === status;
      return mQ && mH && mS;
    });
  }, [q, hostelId, status]);
  const stats = useMemo(() => {
    const totalRooms = allBlocks.reduce((a, b) => a + b.totalRooms, 0);
    return {
      total: allBlocks.length,
      active: allBlocks.filter((b) => b.status === "Active").length,
      floors: allBlocks.reduce((a, b) => a + b.floors, 0),
      totalRooms
    };
  }, []);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Block Management"
    description="Manage blocks within every hostel building."
    icon={Blocks}
    tint="#2563EB"
    breadcrumbs={[{ label: "Block Management" }]}
    action={<Button asChild className="bg-[#2563EB] hover:bg-[#1e4fd1]">
            <Link to="/hostel-admin/blocks/add">
              <Plus className="mr-1.5 h-4 w-4" /> Add Block
            </Link>
          </Button>}
  />

      {
    /* Stats */
  }
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
    { label: "Total Blocks", value: stats.total, tint: "#2563EB", icon: Blocks },
    { label: "Active Blocks", value: stats.active, tint: "#22C55E", icon: Building2 },
    { label: "Total Floors", value: stats.floors, tint: "#7B4CED", icon: Layers },
    { label: "Total Rooms", value: stats.totalRooms, tint: "#EA580C", icon: DoorClosed }
  ].map((c) => <div key={c.label} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-2xl font-semibold" style={{ color: c.tint }}>{c.value}</p>
            </div>
            <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: `${c.tint}15`, color: c.tint }}>
              <c.icon className="h-5 w-5" />
            </span>
          </div>)}
      </div>

      {
    /* Filters */
  }
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by block, hostel or in-charge" className="h-10 pl-9" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={hostelId} onChange={(e) => setHostelId(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              <option value="All">All Hostels</option>
              {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              {["All", "Active", "Under Maintenance", "Inactive"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </div>

      {
    /* Data table (desktop) */
  }
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Block</th>
                <th className="px-4 py-3 text-left">Hostel</th>
                <th className="px-4 py-3 text-center">Floors</th>
                <th className="px-4 py-3 text-center">Rooms</th>
                <th className="px-4 py-3 text-left">Occupancy</th>
                <th className="px-4 py-3 text-left">In-Charge</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
    const pct = b.totalRooms ? Math.round(b.occupiedRooms / b.totalRooms * 100) : 0;
    return <tr key={b.id} className="border-t border-border transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                          <Blocks className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-foreground">{b.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{hostelName(b.hostelId)}</td>
                    <td className="px-4 py-3 text-center font-medium">{b.floors}</td>
                    <td className="px-4 py-3 text-center font-medium">{b.totalRooms}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
      className="h-full rounded-full"
      style={{ width: `${pct}%`, backgroundColor: pct > 85 ? "#EF4444" : pct > 60 ? "#EAB308" : "#22C55E" }}
    />
                        </div>
                        <span className="text-xs text-muted-foreground">{b.occupiedRooms}/{b.totalRooms}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.inCharge}</td>
                    <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/hostel-admin/blocks/$id/edit" params={{ id: b.id }}>
                            <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                          </Link>
                        </Button>
                        <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>;
  })}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">No blocks match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Mobile cards */
  }
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filtered.map((b) => {
    const pct = b.totalRooms ? Math.round(b.occupiedRooms / b.totalRooms * 100) : 0;
    return <div key={b.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
                    <Blocks className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{hostelName(b.hostelId)}</p>
                  </div>
                </div>
                <StatusPill status={b.status} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-muted/50 py-2">
                  <p className="text-[10px] text-muted-foreground">Floors</p>
                  <p className="text-sm font-semibold">{b.floors}</p>
                </div>
                <div className="rounded-lg bg-muted/50 py-2">
                  <p className="text-[10px] text-muted-foreground">Rooms</p>
                  <p className="text-sm font-semibold">{b.totalRooms}</p>
                </div>
                <div className="rounded-lg bg-muted/50 py-2">
                  <p className="text-[10px] text-muted-foreground">Occupied</p>
                  <p className="text-sm font-semibold">{pct}%</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">In-charge: <span className="font-medium text-foreground">{b.inCharge}</span></span>
                <div className="flex items-center gap-1">
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/hostel-admin/blocks/$id/edit" params={{ id: b.id }}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>
                  <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>;
  })}
        {filtered.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No blocks match your filters.
          </div>}
      </div>
    </div>;
}
export {
  Route
};
