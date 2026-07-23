import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, DoorClosed, DoorOpen, Wrench } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { StatCard } from "@/components/admin/StatCard";
import { rooms } from "@/lib/hostel-data";
import { cn } from "@/lib/utils";
const Route = createFileRoute("/warden/occupancy")({
  component: OccupancyPage
});
const TINT = "#7B4CED";
function OccupancyPage() {
  const [block, setBlock] = useState("All");
  const filtered = useMemo(() => block === "All" ? rooms : rooms.filter((r) => r.block === block), [block]);
  const totalBeds = rooms.reduce((s, r) => s + r.beds, 0);
  const occupied = rooms.reduce((s, r) => s + r.occupied, 0);
  const maintenance = rooms.filter((r) => r.status === "Maintenance").length;
  const available = totalBeds - occupied;
  const byBlock = ["A", "B", "C", "D"].map((b) => {
    const items = rooms.filter((r) => r.block === b);
    return { block: b, capacity: items.reduce((s, r) => s + r.beds, 0), occupied: items.reduce((s, r) => s + r.occupied, 0), rooms: items.length };
  });
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Room Occupancy"
    description="Live view of block, floor and room occupancy in your assigned hostels."
    icon={BedDouble}
    tint={TINT}
    breadcrumbs={[{ label: "Room Occupancy" }]}
  />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Beds" value={String(totalBeds)} delta={`${rooms.length} rooms`} trend="up" icon={BedDouble} tint="#2563EB" />
        <StatCard label="Occupied Beds" value={String(occupied)} delta={`${Math.round(occupied / totalBeds * 100)}% utilised`} trend="up" icon={DoorClosed} tint="#7B4CED" />
        <StatCard label="Available Beds" value={String(available)} delta="Ready to allocate" trend="up" icon={DoorOpen} tint="#22C55E" />
        <StatCard label="Under Maintenance" value={String(maintenance)} delta="Rooms" trend="down" icon={Wrench} tint="#EAB308" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {byBlock.map((b) => {
    const pct = b.capacity ? Math.round(b.occupied / b.capacity * 100) : 0;
    return <div key={b.block} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Block</p>
                  <h3 className="text-lg font-bold text-foreground">Block {b.block}</h3>
                </div>
                <span className="rounded-full bg-[#7B4CED]/10 px-2 py-0.5 text-xs font-medium text-[#7B4CED]">{b.rooms} rooms</span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Occupancy</span>
                  <span className="font-medium text-foreground">{b.occupied} / {b.capacity}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7B4CED]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>;
  })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Rooms</h2>
            <p className="text-xs text-muted-foreground">Visual occupancy card for each room</p>
          </div>
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
            {["All", "A", "B", "C", "D"].map((b) => <button
    key={b}
    onClick={() => setBlock(b)}
    className={cn(
      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
      block === b ? "bg-[#7B4CED] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
    )}
  >
                {b === "All" ? "All Blocks" : `Block ${b}`}
              </button>)}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => {
    const avail = r.beds - r.occupied;
    const pct = r.beds ? Math.round(r.occupied / r.beds * 100) : 0;
    return <div key={r.id} className="rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Block {r.block} · Floor {r.floor}</p>
                    <h3 className="text-lg font-bold text-foreground">Room {r.number}</h3>
                  </div>
                  <StatusPill status={r.status} />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/40 py-2">
                    <p className="text-[10px] uppercase text-muted-foreground">Beds</p>
                    <p className="text-sm font-semibold text-foreground">{r.beds}</p>
                  </div>
                  <div className="rounded-lg bg-[#7B4CED]/10 py-2">
                    <p className="text-[10px] uppercase text-[#7B4CED]">Occupied</p>
                    <p className="text-sm font-semibold text-[#7B4CED]">{r.occupied}</p>
                  </div>
                  <div className="rounded-lg bg-[#22C55E]/10 py-2">
                    <p className="text-[10px] uppercase text-[#16A34A]">Available</p>
                    <p className="text-sm font-semibold text-[#16A34A]">{avail}</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7B4CED]" style={{ width: `${pct}%` }} />
                </div>
              </div>;
  })}
        </div>
      </div>
    </div>;
}
export {
  Route
};
