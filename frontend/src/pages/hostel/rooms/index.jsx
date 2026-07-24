import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  DoorClosed,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
  BedDouble,
  LayoutGrid,
  List as ListIcon
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { rooms as allRooms, hostels, blocks, floors } from "@/lib/hostel-data";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/hostel-admin/rooms/")({
  component: RoomsListPage
});
const TYPE_COLORS = {
  Single: "#2563EB",
  Double: "#7B4CED",
  Triple: "#0D9488",
  Dormitory: "#EA580C",
  Deluxe: "#DB2777"
};
function RoomsListPage() {
  const [q, setQ] = useState("");
  const [hostelId, setHostelId] = useState("All");
  const [blockId, setBlockId] = useState("All");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [view, setView] = useState("grid");
  const hostelName = (id) => hostels.find((h) => h.id === id)?.name ?? "\u2014";
  const blockName = (id) => blocks.find((b) => b.id === id)?.name ?? `Block ${allRooms.find((r) => r.blockId === id)?.block ?? ""}`;
  const floorNum = (id) => floors.find((f) => f.id === id)?.number;
  const availableBlocks = useMemo(
    () => hostelId === "All" ? blocks : blocks.filter((b) => b.hostelId === hostelId),
    [hostelId]
  );
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return allRooms.filter((r) => {
      const hn = hostelName(r.hostelId).toLowerCase();
      const bn = blockName(r.blockId).toLowerCase();
      const mQ = !query || r.number.toLowerCase().includes(query) || hn.includes(query) || bn.includes(query) || (r.type ?? "").toLowerCase().includes(query);
      const mH = hostelId === "All" || r.hostelId === hostelId;
      const mB = blockId === "All" || r.blockId === blockId;
      const mT = type === "All" || r.type === type;
      const mS = status === "All" || r.status === status;
      return mQ && mH && mB && mT && mS;
    });
  }, [q, hostelId, blockId, type, status]);
  const stats = useMemo(() => {
    const beds = allRooms.reduce((n, r) => n + r.beds, 0);
    const occ = allRooms.reduce((n, r) => n + r.occupied, 0);
    return {
      total: allRooms.length,
      available: allRooms.filter((r) => r.status === "Available").length,
      occupied: allRooms.filter((r) => r.status === "Occupied").length,
      maintenance: allRooms.filter((r) => r.status === "Maintenance").length,
      beds,
      occ
    };
  }, []);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Room Management"
    description="Manage rooms, capacity, occupancy and bed allocation."
    icon={DoorClosed}
    tint="#7B4CED"
    breadcrumbs={[{ label: "Room Management" }]}
    action={<Button asChild className="bg-[#7B4CED] hover:bg-[#6a3dd6]">
            <Link to="/hostel-admin/rooms/add">
              <Plus className="mr-1.5 h-4 w-4" /> Add Room
            </Link>
          </Button>}
  />

      {
    /* Stats */
  }
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
    { label: "Total Rooms", value: stats.total, tint: "#7B4CED" },
    { label: "Available", value: stats.available, tint: "#22C55E" },
    { label: "Occupied", value: stats.occupied, tint: "#2563EB" },
    { label: "Maintenance", value: stats.maintenance, tint: "#EAB308" }
  ].map((c) => <div key={c.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold" style={{ color: c.tint }}>{c.value}</p>
          </div>)}
      </div>

      {
    /* Filters */
  }
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by room, hostel, block or type" className="h-10 pl-9" />
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
            <select value={blockId} onChange={(e) => setBlockId(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              <option value="All">All Blocks</option>
              {availableBlocks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              {["All", "Single", "Double", "Triple", "Dormitory", "Deluxe"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              {["All", "Available", "Occupied", "Maintenance"].map((s) => <option key={s}>{s}</option>)}
            </select>
            <div className="ml-1 inline-flex overflow-hidden rounded-lg border border-border">
              <button
    onClick={() => setView("grid")}
    className={cn("grid h-10 w-10 place-items-center", view === "grid" ? "bg-[#7B4CED] text-white" : "bg-background text-muted-foreground hover:bg-muted")}
    title="Grid view"
  >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
    onClick={() => setView("table")}
    className={cn("grid h-10 w-10 place-items-center border-l border-border", view === "table" ? "bg-[#7B4CED] text-white" : "bg-background text-muted-foreground hover:bg-muted")}
    title="Table view"
  >
                <ListIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === "grid" ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => {
    const pct = r.beds ? Math.round(r.occupied / r.beds * 100) : 0;
    const typeTint = TYPE_COLORS[r.type ?? "Double"] ?? "#7B4CED";
    return <div key={r.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between px-4 py-3 text-white" style={{ background: `linear-gradient(135deg, ${typeTint}, ${typeTint}CC)` }}>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/70">Room</p>
                    <p className="text-lg font-semibold leading-tight">{r.number}</p>
                  </div>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
                    {r.type ?? "Room"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{hostelName(r.hostelId)}</span>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{blockName(r.blockId)}</span>
                    <span className="text-muted-foreground/50">·</span>
                    <span>Floor {floorNum(r.floorId) ?? r.floor ?? "\u2014"}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-[10px] text-muted-foreground">Capacity</p>
                      <p className="text-sm font-semibold text-foreground">{r.beds}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-[10px] text-muted-foreground">Occupied</p>
                      <p className="text-sm font-semibold text-foreground">{r.occupied}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2">
                      <p className="text-[10px] text-muted-foreground">Available</p>
                      <p className="text-sm font-semibold text-foreground">{r.beds - r.occupied}</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-medium text-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
      className="h-full rounded-full"
      style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? "#EF4444" : pct >= 60 ? "#EAB308" : "#22C55E" }}
    />
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-1 border-t border-border pt-3">
                    <Button asChild size="sm" variant="ghost" className="text-[#7B4CED] hover:text-[#7B4CED]">
                      <Link to="/hostel-admin/allocation">
                        <BedDouble className="mr-1 h-3.5 w-3.5" /> Allocate
                      </Link>
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/hostel-admin/rooms/$id" params={{ id: r.id }} title="View">
                          <Eye className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="ghost">
                        <Link to="/hostel-admin/rooms/$id/edit" params={{ id: r.id }} title="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>;
  })}
          {filtered.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No rooms match your filters.
            </div>}
        </div> : <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Room</th>
                  <th className="px-4 py-3 text-left">Hostel</th>
                  <th className="px-4 py-3 text-left">Block</th>
                  <th className="px-4 py-3 text-center">Floor</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-center">Capacity</th>
                  <th className="px-4 py-3 text-center">Occupied</th>
                  <th className="px-4 py-3 text-center">Available</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
    const typeTint = TYPE_COLORS[r.type ?? "Double"] ?? "#7B4CED";
    return <tr key={r.id} className="border-t border-border transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="grid h-9 w-9 place-items-center rounded-lg text-white" style={{ backgroundColor: typeTint }}>
                            <DoorClosed className="h-4 w-4" />
                          </span>
                          <span className="font-medium text-foreground">Room {r.number}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{hostelName(r.hostelId)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{blockName(r.blockId)}</td>
                      <td className="px-4 py-3 text-center">{floorNum(r.floorId) ?? r.floor ?? "\u2014"}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: `${typeTint}15`, color: typeTint }}>
                          {r.type ?? "\u2014"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">{r.beds}</td>
                      <td className="px-4 py-3 text-center">{r.occupied}</td>
                      <td className="px-4 py-3 text-center">{r.beds - r.occupied}</td>
                      <td className="px-4 py-3"><StatusPill status={r.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button asChild size="sm" variant="ghost">
                            <Link to="/hostel-admin/rooms/$id" params={{ id: r.id }} title="View"><Eye className="h-3.5 w-3.5" /></Link>
                          </Button>
                          <Button asChild size="sm" variant="ghost">
                            <Link to="/hostel-admin/rooms/$id/edit" params={{ id: r.id }} title="Edit"><Pencil className="h-3.5 w-3.5" /></Link>
                          </Button>
                          <Button asChild size="sm" variant="ghost" className="text-[#7B4CED] hover:text-[#7B4CED]">
                            <Link to="/hostel-admin/allocation" title="Allocate"><BedDouble className="h-3.5 w-3.5" /></Link>
                          </Button>
                          <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>;
  })}
                {filtered.length === 0 && <tr><td colSpan={10} className="px-4 py-10 text-center text-sm text-muted-foreground">No rooms match your filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>}
    </div>;
}
export {
  Route
};
