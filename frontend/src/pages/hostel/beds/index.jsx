import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BedDouble,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  DoorClosed,
  CheckCircle2,
  UserCheck,
  BookmarkCheck,
  Wrench
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  beds as allBeds,
  rooms,
  hostels,
  blocks,
  students
} from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/beds/")({
  component: BedsPage
});
function BedsPage() {
  const [q, setQ] = useState("");
  const [roomId, setRoomId] = useState("All");
  const [hostelId, setHostelId] = useState("All");
  const [status, setStatus] = useState("All");
  const roomMap = useMemo(() => Object.fromEntries(rooms.map((r) => [r.id, r])), []);
  const studentMap = useMemo(
    () => Object.fromEntries(students.map((s) => [s.id, s])),
    []
  );
  const blockMap = useMemo(
    () => Object.fromEntries(blocks.map((b) => [b.id, b])),
    []
  );
  const hostelMap = useMemo(
    () => Object.fromEntries(hostels.map((h) => [h.id, h])),
    []
  );
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return allBeds.filter((b) => {
      const room = roomMap[b.roomId];
      const stu = b.studentId ? studentMap[b.studentId] : void 0;
      const mQ = !query || b.number.toLowerCase().includes(query) || room?.number.toLowerCase().includes(query) || stu?.name.toLowerCase().includes(query) || stu?.enrollment.toLowerCase().includes(query);
      const mR = roomId === "All" || b.roomId === roomId;
      const mH = hostelId === "All" || room?.hostelId === hostelId;
      const mS = status === "All" || b.status === status;
      return mQ && mR && mH && mS;
    });
  }, [q, roomId, hostelId, status, roomMap, studentMap]);
  const stats = useMemo(() => {
    const total = allBeds.length;
    const count = (s) => allBeds.filter((b) => b.status === s).length;
    return {
      total,
      available: count("Available"),
      occupied: count("Occupied"),
      reserved: count("Reserved"),
      maintenance: count("Maintenance")
    };
  }, []);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Bed Management"
    description="Track individual beds inside every room and their allocation status."
    icon={BedDouble}
    tint="#2563EB"
    breadcrumbs={[{ label: "Bed Management" }]}
    action={<Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/hostel-admin/beds/add">
              <Plus className="mr-1.5 h-4 w-4" /> Add Bed
            </Link>
          </Button>}
  />

      {
    /* Stats */
  }
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
    { label: "Total Beds", value: stats.total, tint: "#2563EB", icon: BedDouble },
    { label: "Available", value: stats.available, tint: "#22C55E", icon: CheckCircle2 },
    { label: "Occupied", value: stats.occupied, tint: "#7B4CED", icon: UserCheck },
    { label: "Reserved", value: stats.reserved, tint: "#3B82F6", icon: BookmarkCheck },
    { label: "Maintenance", value: stats.maintenance, tint: "#EAB308", icon: Wrench }
  ].map((c) => <div
    key={c.label}
    className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm"
  >
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-2xl font-semibold" style={{ color: c.tint }}>
                {c.value}
              </p>
            </div>
            <span
    className="grid h-10 w-10 place-items-center rounded-lg"
    style={{ backgroundColor: `${c.tint}15`, color: c.tint }}
  >
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
            <Input
    value={q}
    onChange={(e) => setQ(e.target.value)}
    placeholder="Search by bed, room, or student"
    className="h-10 pl-9"
  />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
    value={hostelId}
    onChange={(e) => setHostelId(e.target.value)}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
  >
              <option value="All">All Hostels</option>
              {hostels.map((h) => <option key={h.id} value={h.id}>
                  {h.name}
                </option>)}
            </select>
            <select
    value={roomId}
    onChange={(e) => setRoomId(e.target.value)}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
  >
              <option value="All">All Rooms</option>
              {rooms.map((r) => <option key={r.id} value={r.id}>
                  Room {r.number} · Block {r.block}
                </option>)}
            </select>
            <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
  >
              {["All", "Available", "Occupied", "Reserved", "Maintenance"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </div>

      {
    /* Table (desktop) */
  }
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Bed</th>
                <th className="px-4 py-3 text-left">Room</th>
                <th className="px-4 py-3 text-left">Hostel / Block</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
    const room = roomMap[b.roomId];
    const stu = b.studentId ? studentMap[b.studentId] : void 0;
    const hostel = room ? hostelMap[room.hostelId ?? ""] : void 0;
    const block = room ? blockMap[room.blockId ?? ""] : void 0;
    return <tr
      key={b.id}
      className="border-t border-border transition-colors hover:bg-muted/30"
    >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                          <BedDouble className="h-4 w-4" />
                        </span>
                        <span className="font-medium text-foreground">{b.number}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-foreground">
                        <DoorClosed className="h-3.5 w-3.5 text-muted-foreground" />
                        {room?.number ?? "\u2014"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p className="text-foreground">{hostel?.name ?? "\u2014"}</p>
                      <p className="text-xs">{block?.name ?? `Block ${room?.block ?? "\u2014"}`}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.type}</td>
                    <td className="px-4 py-3">
                      {stu ? <div>
                          <p className="font-medium text-foreground">{stu.name}</p>
                          <p className="text-xs text-muted-foreground">{stu.enrollment}</p>
                        </div> : <span className="text-xs text-muted-foreground">— Unassigned —</span>}
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild size="sm" variant="ghost">
                          <Link to="/hostel-admin/beds/$id/edit" params={{ id: b.id }}>
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
                    </td>
                  </tr>;
  })}
              {filtered.length === 0 && <tr>
                  <td
    colSpan={7}
    className="px-4 py-10 text-center text-sm text-muted-foreground"
  >
                    No beds match your filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Mobile cards */
  }
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {filtered.map((b) => {
    const room = roomMap[b.roomId];
    const stu = b.studentId ? studentMap[b.studentId] : void 0;
    const hostel = room ? hostelMap[room.hostelId ?? ""] : void 0;
    return <div
      key={b.id}
      className="rounded-xl border border-border bg-card p-4 shadow-sm"
    >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                    <BedDouble className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">
                      Bed {b.number}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        · {b.type}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Room {room?.number ?? "\u2014"} · {hostel?.name ?? "\u2014"}
                    </p>
                  </div>
                </div>
                <StatusPill status={b.status} />
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
                <span className="text-muted-foreground">
                  {stu ? <>
                      <span className="font-medium text-foreground">{stu.name}</span>{" "}
                      · {stu.enrollment}
                    </> : "Unassigned"}
                </span>
                <div className="flex items-center gap-1">
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/hostel-admin/beds/$id/edit" params={{ id: b.id }}>
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
            No beds match your filters.
          </div>}
      </div>
    </div>;
}
export {
  Route
};
