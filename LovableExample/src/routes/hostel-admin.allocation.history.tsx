import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Download, History } from "lucide-react";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { allocations, beds, blocks, floors, hostels, rooms, students } from "@/lib/hostel-data";
import { toast } from "sonner";

export const Route = createFileRoute("/hostel-admin/allocation/history")({
  component: AllocationHistoryPage,
});

function AllocationHistoryPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    return [...allocations]
      .sort((a, b) => (a.allocatedOn < b.allocatedOn ? 1 : -1))
      .filter((a) => (status === "all" ? true : a.status === status))
      .filter((a) => {
        if (!q.trim()) return true;
        const s = students.find((x) => x.id === a.studentId);
        const r = rooms.find((x) => x.id === a.roomId);
        const hay = `${s?.name} ${s?.enrollment} ${r?.number}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      });
  }, [q, status]);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#7B4CED]/10 text-[#7B4CED]">
              <History className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Allocation History</h2>
              <p className="text-xs text-muted-foreground">All allocations, transfers and vacations.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground sm:w-64"
              />
            </div>
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
            <Button
              variant="outline"
              onClick={() => toast.success("Export started")}
              className="h-10"
            >
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <ol className="relative divide-y divide-border">
          {rows.map((a) => {
            const s = students.find((x) => x.id === a.studentId);
            const h = hostels.find((x) => x.id === a.hostelId);
            const b = blocks.find((x) => x.id === a.blockId);
            const f = floors.find((x) => x.id === a.floorId);
            const r = rooms.find((x) => x.id === a.roomId);
            const bed = beds.find((x) => x.id === a.bedId);
            return (
              <li key={a.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                    {s?.photo}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{s?.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {h?.name} · {b?.name} · Floor {f?.number} · Room {r?.number} · {bed?.number}
                    </p>
                    {a.note && (
                      <p className="mt-0.5 truncate text-[11px] italic text-muted-foreground">"{a.note}"</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <div className="text-right text-xs">
                    <p className="text-muted-foreground">Allocated</p>
                    <p className="font-medium text-foreground">{a.allocatedOn}</p>
                  </div>
                  {a.vacatedOn && (
                    <div className="text-right text-xs">
                      <p className="text-muted-foreground">Vacated</p>
                      <p className="font-medium text-foreground">{a.vacatedOn}</p>
                    </div>
                  )}
                  <StatusPill status={a.status} />
                </div>
              </li>
            );
          })}
          {rows.length === 0 && (
            <li className="p-10 text-center text-sm text-muted-foreground">No records found.</li>
          )}
        </ol>
      </div>
    </div>
  );
}
