import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Repeat, LogOut, Plus, Users, BedDouble, DoorClosed, CheckCircle2 } from "lucide-react";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { allocations, beds, blocks, floors, hostels, rooms, students } from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/hostel-admin/allocation/")({
  component: AllocationListPage
});
function AllocationListPage() {
  const [q, setQ] = useState("");
  const [hostelId, setHostelId] = useState("all");
  const [status, setStatus] = useState("all");
  const active = allocations.filter((a) => a.status === "Active");
  const totalBeds = beds.length;
  const availableBeds = beds.filter((b) => b.status === "Available").length;
  const reservedBeds = beds.filter((b) => b.status === "Reserved").length;
  const rows = useMemo(() => {
    return allocations.filter((a) => hostelId === "all" ? true : a.hostelId === hostelId).filter((a) => status === "all" ? true : a.status === status).filter((a) => {
      if (!q.trim()) return true;
      const s = students.find((x) => x.id === a.studentId);
      const r = rooms.find((x) => x.id === a.roomId);
      const hay = `${s?.name} ${s?.enrollment} ${r?.number}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });
  }, [q, hostelId, status]);
  const stats = [
    { label: "Active Allocations", value: active.length, icon: CheckCircle2, tint: "#22C55E" },
    { label: "Total Beds", value: totalBeds, icon: BedDouble, tint: "#2563EB" },
    { label: "Available Beds", value: availableBeds, icon: DoorClosed, tint: "#7B4CED" },
    { label: "Reserved Beds", value: reservedBeds, icon: Users, tint: "#F97316" }
  ];
  return <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span
    className="grid h-9 w-9 place-items-center rounded-lg"
    style={{ backgroundColor: `${s.tint}1A`, color: s.tint }}
  >
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>)}
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
    value={q}
    onChange={(e) => setQ(e.target.value)}
    placeholder="Search by student, enrollment or room…"
    className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground"
  />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
    value={hostelId}
    onChange={(e) => setHostelId(e.target.value)}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
  >
              <option value="all">All Hostels</option>
              {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
            <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
  >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Vacated">Vacated</option>
              <option value="Transferred">Transferred</option>
            </select>
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Hostel · Block · Floor</th>
                <th className="px-4 py-3 font-medium">Room · Bed</th>
                <th className="px-4 py-3 font-medium">Allocated On</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((a) => {
    const s = students.find((x) => x.id === a.studentId);
    const h = hostels.find((x) => x.id === a.hostelId);
    const b = blocks.find((x) => x.id === a.blockId);
    const f = floors.find((x) => x.id === a.floorId);
    const r = rooms.find((x) => x.id === a.roomId);
    const bed = beds.find((x) => x.id === a.bedId);
    return <tr key={a.id} className="hover:bg-muted/30">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                          {s?.photo}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{s?.name}</p>
                          <p className="text-xs text-muted-foreground">{s?.enrollment}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">
                      <p className="font-medium">{h?.name}</p>
                      <p className="text-xs text-muted-foreground">{b?.name} · Floor {f?.number}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">
                      Room {r?.number} · {bed?.number}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{a.allocatedOn}</td>
                    <td className="px-4 py-3"><StatusPill status={a.status} /></td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Link to="/hostel-admin/allocation/change">
                          <Button size="sm" variant="outline" className="h-8">
                            <Repeat className="mr-1 h-3.5 w-3.5" /> Change
                          </Button>
                        </Link>
                        <Button
      size="sm"
      variant="outline"
      className="h-8 text-[#DC2626] hover:bg-red-50"
      onClick={() => toast.success(`${s?.name} vacated from Room ${r?.number}`)}
    >
                          <LogOut className="mr-1 h-3.5 w-3.5" /> Vacate
                        </Button>
                      </div>
                    </td>
                  </tr>;
  })}
              {rows.length === 0 && <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    No allocations match your filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>

        {
    /* Mobile cards */
  }
        <div className="divide-y divide-border md:hidden">
          {rows.map((a) => {
    const s = students.find((x) => x.id === a.studentId);
    const h = hostels.find((x) => x.id === a.hostelId);
    const r = rooms.find((x) => x.id === a.roomId);
    const bed = beds.find((x) => x.id === a.bedId);
    return <div key={a.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                      {s?.photo}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{s?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{s?.enrollment}</p>
                    </div>
                  </div>
                  <StatusPill status={a.status} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {h?.name} · Room {r?.number} · {bed?.number}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Allocated {a.allocatedOn}</p>
              </div>;
  })}
        </div>
      </div>

      <div className="flex justify-end">
        <Link to="/hostel-admin/allocation/new">
          <Button className="bg-[#7B4CED] hover:bg-[#6a3dd6]">
            <Plus className="mr-1.5 h-4 w-4" /> New Allocation
          </Button>
        </Link>
      </div>
    </div>;
}
export {
  Route
};
