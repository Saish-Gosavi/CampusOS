import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { BedDouble, DoorClosed, DoorOpen, Wrench, Building } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { StatCard } from "@/components/admin/StatCard";
import { roomApi } from "@/services/api";
import { cn } from "@/lib/utils";

const Route = createFileRoute("/warden/occupancy")({
  component: OccupancyPage
});

const TINT = "#7B4CED";

function OccupancyPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [block, setBlock] = useState("All");

  useEffect(() => {
    async function fetchRooms() {
      setLoading(true);
      try {
        const res = await roomApi.getAll();
        const data = res?.data || res || [];
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, []);

  const formattedRooms = useMemo(() => {
    return rooms.map((r) => {
      const blockName = r.floor?.block?.name || r.block || "Block A";
      const totalBeds = r.beds?.length || r.capacity || 1;
      const occupiedBeds = r.beds ? r.beds.filter(b => b.allocations && b.allocations.length > 0).length : (r.isOccupied ? totalBeds : 0);
      const status = r.status || (occupiedBeds === totalBeds ? "Occupied" : occupiedBeds > 0 ? "Partial" : "Available");
      return {
        id: r.id,
        number: r.number,
        floor: r.floor?.number || r.floor || "1",
        block: blockName,
        beds: totalBeds,
        occupied: occupiedBeds,
        status
      };
    });
  }, [rooms]);

  const isBlockMatch = (roomBlock, selectedBlock) => {
    if (!selectedBlock || selectedBlock === "All") return true;
    const rb = String(roomBlock || "").toLowerCase().trim();
    const sb = String(selectedBlock || "").toLowerCase().trim();
    return (
      rb === sb ||
      rb === `block ${sb}` ||
      `block ${rb}` === sb ||
      rb.replace(/^block\s+/, "") === sb.replace(/^block\s+/, "")
    );
  };

  const filtered = useMemo(
    () => (block === "All" ? formattedRooms : formattedRooms.filter((r) => isBlockMatch(r.block, block))),
    [block, formattedRooms]
  );
  const totalBeds = formattedRooms.reduce((s, r) => s + r.beds, 0);
  const occupied = formattedRooms.reduce((s, r) => s + r.occupied, 0);
  const maintenance = formattedRooms.filter((r) => r.status === "Maintenance").length;
  const available = totalBeds - occupied;

  const blocksList = Array.from(new Set(formattedRooms.map((r) => r.block)));

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Room Occupancy"
        description="Live view of block, floor and room occupancy in your assigned hostels."
        icon={BedDouble}
        tint={TINT}
        breadcrumbs={[{ label: "Room Occupancy" }]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Beds" value={String(totalBeds)} delta={`${formattedRooms.length} rooms`} trend="up" icon={BedDouble} tint="#2563EB" />
        <StatCard label="Occupied Beds" value={String(occupied)} delta={`${totalBeds ? Math.round(occupied / totalBeds * 100) : 0}% utilised`} trend="up" icon={DoorClosed} tint="#7B4CED" />
        <StatCard label="Available Beds" value={String(available)} delta="Ready to allocate" trend="up" icon={DoorOpen} tint="#22C55E" />
        <StatCard label="Under Maintenance" value={String(maintenance)} delta="Rooms" trend="down" icon={Wrench} tint="#EAB308" />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Rooms</h2>
            <p className="text-xs text-muted-foreground">Visual occupancy card for each room</p>
          </div>
          {blocksList.length > 0 && (
            <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
              <button
                onClick={() => setBlock("All")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  block === "All" ? "bg-[#7B4CED] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                All Blocks
              </button>
              {blocksList.map((b) => (
                <button
                  key={b}
                  onClick={() => setBlock(b)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                    block === b ? "bg-[#7B4CED] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => {
              const avail = r.beds - r.occupied;
              const pct = r.beds ? Math.round(r.occupied / r.beds * 100) : 0;
              return (
                <div key={r.id} className="rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{r.block} · Floor {r.floor}</p>
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-48 flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <Building className="h-10 w-10 stroke-[1.5] mb-2 opacity-40 text-primary" />
            <p className="text-sm font-medium text-foreground">No Rooms Found</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              Rooms configured in your assigned hostels will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export { Route };
