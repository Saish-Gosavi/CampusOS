import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layers, Plus, Search, Filter, Pencil, Trash2, DoorClosed, Building2, Blocks as BlocksIcon } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { floors as allFloors, blocks, hostels } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/floors/")({
  component: FloorsPage
});
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function FloorsPage() {
  const [q, setQ] = useState("");
  const [hostelId, setHostelId] = useState("All");
  const [blockId, setBlockId] = useState("All");
  const [status, setStatus] = useState("All");
  const blockById = (id) => blocks.find((b) => b.id === id);
  const hostelName = (id) => hostels.find((h) => h.id === id)?.name ?? "\u2014";
  const availableBlocks = useMemo(
    () => hostelId === "All" ? blocks : blocks.filter((b) => b.hostelId === hostelId),
    [hostelId]
  );
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return allFloors.filter((f) => {
      const b = blockById(f.blockId);
      const hName = b ? hostelName(b.hostelId).toLowerCase() : "";
      const bName = (b?.name ?? "").toLowerCase();
      const mQ = !query || String(f.number).includes(query) || bName.includes(query) || hName.includes(query);
      const mH = hostelId === "All" || b?.hostelId === hostelId;
      const mB = blockId === "All" || f.blockId === blockId;
      const mS = status === "All" || f.status === status;
      return mQ && mH && mB && mS;
    });
  }, [q, hostelId, blockId, status]);
  const stats = useMemo(() => ({
    total: allFloors.length,
    active: allFloors.filter((f) => f.status === "Active").length,
    rooms: allFloors.reduce((a, f) => a + f.totalRooms, 0),
    occupied: allFloors.reduce((a, f) => a + f.occupiedRooms, 0)
  }), []);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Floor Management"
    description="Manage floors inside every block across all hostels."
    icon={Layers}
    tint="#7B4CED"
    breadcrumbs={[{ label: "Floor Management" }]}
    action={<Button asChild className="bg-[#7B4CED] hover:bg-[#6a3dd6]">
            <Link to="/hostel-admin/floors/add">
              <Plus className="mr-1.5 h-4 w-4" /> Add Floor
            </Link>
          </Button>}
  />

      {
    /* Stats */
  }
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
    { label: "Total Floors", value: stats.total, tint: "#7B4CED", icon: Layers },
    { label: "Active Floors", value: stats.active, tint: "#22C55E", icon: BlocksIcon },
    { label: "Total Rooms", value: stats.rooms, tint: "#2563EB", icon: DoorClosed },
    { label: "Occupied Rooms", value: stats.occupied, tint: "#EA580C", icon: Building2 }
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
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by floor, block or hostel" className="h-10 pl-9" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
    value={hostelId}
    onChange={(e) => {
      setHostelId(e.target.value);
      setBlockId("All");
    }}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
  >
              <option value="All">All Hostels</option>
              {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <select
    value={blockId}
    onChange={(e) => setBlockId(e.target.value)}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
  >
              <option value="All">All Blocks</option>
              {availableBlocks.map((b) => <option key={b.id} value={b.id}>{b.name} · {hostelName(b.hostelId)}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              {["All", "Active", "Under Maintenance", "Inactive"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </div>

      {
    /* Floor cards grid */
  }
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((f) => {
    const b = blockById(f.blockId);
    const pct = f.totalRooms ? Math.round(f.occupiedRooms / f.totalRooms * 100) : 0;
    return <div key={f.id} className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between bg-gradient-to-br from-[#7B4CED] to-[#5B2FCB] px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur">
                    <Layers className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/70">Floor</p>
                    <p className="text-base font-semibold leading-tight">{ordinal(f.number)} Floor</p>
                  </div>
                </div>
                <StatusPill status={f.status} />
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BlocksIcon className="h-3.5 w-3.5" />
                  <span className="font-medium text-foreground">{b?.name ?? "\u2014"}</span>
                  <span className="text-muted-foreground/60">·</span>
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="truncate">{b ? hostelName(b.hostelId) : "\u2014"}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rooms</p>
                    <p className="text-lg font-semibold text-foreground">{f.totalRooms}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-2.5">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Occupied</p>
                    <p className="text-lg font-semibold text-foreground">{f.occupiedRooms}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Occupancy</span>
                    <span className="font-medium text-foreground">{pct}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
      className="h-full rounded-full transition-all"
      style={{ width: `${pct}%`, backgroundColor: pct > 85 ? "#EF4444" : pct > 60 ? "#EAB308" : "#22C55E" }}
    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 border-t border-border pt-3">
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/hostel-admin/floors/$id/edit" params={{ id: f.id }}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Link>
                  </Button>
                  <button
      className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
      title="Delete"
    >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>;
  })}
        {filtered.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No floors match your filters.
          </div>}
      </div>
    </div>;
}
export {
  Route
};
