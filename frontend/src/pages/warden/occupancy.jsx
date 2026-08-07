import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { BedDouble, DoorClosed, DoorOpen, Wrench, Loader2 } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { StatCard } from "@/components/admin/StatCard";
import { cn } from "@/lib/utils";
import { blockApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const Route = createFileRoute("/warden/occupancy")({
  component: OccupancyPage
});
const TINT = "#210963";
function OccupancyPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rawBlocks, setRawBlocks] = useState([]);
  const [blockFilter, setBlockFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.hostelId) return;
      try {
        setLoading(true);
        const res = await blockApi.getAll(user.hostelId);
        const data = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
        setRawBlocks(data);
      } catch (err) {
        console.error("Failed to load occupancy data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.hostelId]);

  const { roomsList, byBlock, stats } = useMemo(() => {
    const list = [];
    const blockMap = [];
    let totBeds = 0;
    let totOcc = 0;
    let totMaint = 0;

    rawBlocks.forEach((b) => {
      let bCap = 0;
      let bOcc = 0;
      let bRooms = 0;

      (b.floors || []).forEach((f) => {
        (f.rooms || []).forEach((r) => {
          bRooms++;
          let rCap = r.capacity || 0;
          let rOcc = 0;
          (r.beds || []).forEach((bed) => {
            if (bed.allocations && bed.allocations.length > 0) {
              rOcc++;
            }
          });

          totBeds += rCap;
          totOcc += rOcc;
          bCap += rCap;
          bOcc += rOcc;
          
          list.push({
            id: r.id,
            number: r.number,
            block: b.name,
            floor: f.number,
            beds: rCap,
            occupied: rOcc,
            status: "Active", // Add maintenance status field in DB later if needed
          });
        });
      });

      blockMap.push({
        block: b.name,
        capacity: bCap,
        occupied: bOcc,
        rooms: bRooms,
      });
    });

    return {
      roomsList: list,
      byBlock: blockMap,
      stats: {
        totalBeds: totBeds,
        occupied: totOcc,
        maintenance: totMaint,
        available: Math.max(0, totBeds - totOcc),
      }
    };
  }, [rawBlocks]);

  const filtered = useMemo(() => blockFilter === "All" ? roomsList : roomsList.filter((r) => r.block === blockFilter), [blockFilter, roomsList]);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Room Occupancy"
    description="Live view of block, floor and room occupancy in your assigned hostels."
    icon={BedDouble}
    tint={TINT}
    breadcrumbs={[{ label: "Room Occupancy" }]}
  />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Beds" value={String(stats.totalBeds)} delta={`${roomsList.length} rooms`} trend="up" icon={BedDouble} tint="#2563EB" />
        <StatCard label="Occupied Beds" value={String(stats.occupied)} delta={`${stats.totalBeds ? Math.round(stats.occupied / stats.totalBeds * 100) : 0}% utilised`} trend="up" icon={DoorClosed} tint="#210963" />
        <StatCard label="Available Beds" value={String(stats.available)} delta="Ready to allocate" trend="up" icon={DoorOpen} tint="#22C55E" />
        <StatCard label="Under Maintenance" value={String(stats.maintenance)} delta="Rooms" trend="down" icon={Wrench} tint="#EAB308" />
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
                <span className="rounded-full bg-[#210963]/10 px-2 py-0.5 text-xs font-medium text-[#210963]">{b.rooms} rooms</span>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Occupancy</span>
                  <span className="font-medium text-foreground">{b.occupied} / {b.capacity}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#210963]" style={{ width: `${pct}%` }} />
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
            <button
              onClick={() => setBlockFilter("All")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                blockFilter === "All" ? "bg-[#210963] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              All Blocks
            </button>
            {byBlock.map((b) => (
              <button
                key={b.block}
                onClick={() => setBlockFilter(b.block)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  blockFilter === b.block ? "bg-[#210963] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {b.block}
              </button>
            ))}
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
                  <div className="rounded-lg bg-[#210963]/10 py-2">
                    <p className="text-[10px] uppercase text-[#210963]">Occupied</p>
                    <p className="text-sm font-semibold text-[#210963]">{r.occupied}</p>
                  </div>
                  <div className="rounded-lg bg-[#22C55E]/10 py-2">
                    <p className="text-[10px] uppercase text-[#16A34A]">Available</p>
                    <p className="text-sm font-semibold text-[#16A34A]">{avail}</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#210963]" style={{ width: `${pct}%` }} />
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
