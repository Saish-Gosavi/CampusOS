import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  DoorClosed,
  Pencil,
  Trash2,
  BedDouble,
  Building2,
  Blocks as BlocksIcon,
  Layers,
  IndianRupee,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { rooms, hostels, blocks, floors } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/rooms/$id/")({
  component: RoomDetailsPage
});
const TYPE_COLORS = {
  Single: "#2563EB",
  Double: "#7B4CED",
  Triple: "#0D9488",
  Dormitory: "#EA580C",
  Deluxe: "#DB2777"
};
function RoomDetailsPage() {
  const { id } = Route.useParams();
  const room = rooms.find((r) => r.id === id);
  if (!room) throw notFound();
  const hostel = hostels.find((h) => h.id === room.hostelId);
  const block = blocks.find((b) => b.id === room.blockId);
  const floor = floors.find((f) => f.id === room.floorId);
  const typeTint = TYPE_COLORS[room.type ?? "Double"] ?? "#7B4CED";
  const pct = room.beds ? Math.round(room.occupied / room.beds * 100) : 0;
  const available = room.beds - room.occupied;
  return <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <HostelPageHeader
    title={`Room ${room.number}`}
    description={`${hostel?.name ?? "Hostel"} \xB7 ${block?.name ?? ""} \xB7 Floor ${floor?.number ?? room.floor ?? "\u2014"}`}
    icon={DoorClosed}
    tint={typeTint}
    breadcrumbs={[
      { label: "Room Management", to: "/hostel-admin/rooms" },
      { label: `Room ${room.number}` }
    ]}
    action={<div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/hostel-admin/rooms"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Link>
            </Button>
            <Button asChild className="bg-[#7B4CED] hover:bg-[#6a3dd6]">
              <Link to="/hostel-admin/allocation"><BedDouble className="mr-1.5 h-4 w-4" /> Allocate Room</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/hostel-admin/rooms/$id/edit" params={{ id: room.id }}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Link>
            </Button>
            <Button variant="outline" className="text-[#EF4444] hover:text-[#EF4444]">
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete
            </Button>
          </div>}
  />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {
    /* Main details */
  }
        <div className="flex flex-col gap-6 lg:col-span-2">
          {
    /* Hero card */
  }
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between px-6 py-5 text-white" style={{ background: `linear-gradient(135deg, ${typeTint}, ${typeTint}CC)` }}>
              <div>
                <p className="text-xs uppercase tracking-wider text-white/70">Room Number</p>
                <p className="text-3xl font-bold">{room.number}</p>
                <p className="mt-1 text-sm text-white/80">{room.type ?? "Standard"} room</p>
              </div>
              <StatusPill status={room.status} />
            </div>
            <div className="grid grid-cols-3 gap-4 p-6">
              <Stat label="Capacity" value={room.beds} tint="#2563EB" />
              <Stat label="Occupied" value={room.occupied} tint="#7B4CED" />
              <Stat label="Available" value={available} tint="#22C55E" />
            </div>
            <div className="border-t border-border px-6 py-5">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Occupancy</span>
                <span className="font-semibold text-foreground">{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
    className="h-full rounded-full transition-all"
    style={{ width: `${pct}%`, backgroundColor: pct >= 90 ? "#EF4444" : pct >= 60 ? "#EAB308" : "#22C55E" }}
  />
              </div>
            </div>
          </div>

          {
    /* Description */
  }
          {room.description && <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Description</h3>
              <p className="text-sm leading-relaxed text-foreground">{room.description}</p>
            </div>}

          {
    /* Amenities */
  }
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Amenities</h3>
            {room.amenities && room.amenities.length > 0 ? <div className="flex flex-wrap gap-2">
                {room.amenities.map((a) => <span key={a} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#22C55E]" />
                    {a}
                  </span>)}
              </div> : <p className="text-sm text-muted-foreground">No amenities listed.</p>}
          </div>
        </div>

        {
    /* Sidebar */
  }
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Location</h3>
            <div className="flex flex-col gap-3">
              <InfoRow icon={Building2} label="Hostel" value={hostel?.name ?? "\u2014"} />
              <InfoRow icon={BlocksIcon} label="Block" value={block?.name ?? "\u2014"} />
              <InfoRow icon={Layers} label="Floor" value={`Floor ${floor?.number ?? room.floor ?? "\u2014"}`} />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Room Info</h3>
            <div className="flex flex-col gap-3">
              <InfoRow icon={DoorClosed} label="Type" value={room.type ?? "Standard"} />
              <InfoRow icon={BedDouble} label="Beds" value={`${room.beds} total`} />
              {room.rent !== void 0 && <InfoRow icon={IndianRupee} label="Monthly Rent" value={`\u20B9${room.rent.toLocaleString("en-IN")}`} />}
            </div>
          </div>
        </div>
      </div>
    </div>;
}
function Stat({ label, value, tint }) {
  return <div className="rounded-lg border border-border p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color: tint }}>{value}</p>
    </div>;
}
function InfoRow({ icon: Icon, label, value }) {
  return <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>;
}
export {
  Route
};
