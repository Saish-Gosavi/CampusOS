import { createFileRoute } from "@tanstack/react-router";
import { BedDouble, Building2, Layers, Phone, User } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { studentProfile } from "@/lib/student-data";
const Route = createFileRoute("/student/room")({
  head: () => ({ meta: [{ title: "My Room \u2014 Student Portal" }] }),
  component: MyRoomPage
});
function Tile({ label, value, icon: Icon, tint }) {
  return <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: `${tint}1A`, color: tint }}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>;
}
function MyRoomPage() {
  const h = studentProfile.hostel;
  return <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <StudentPageHeader
    title="My Room"
    description="Your accommodation details and roommates"
    icon={BedDouble}
    tint="#2563EB"
    breadcrumbs={[{ label: "Hostel", to: "/student/room" }, { label: "My Room" }]}
  />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Tile label="Hostel" value={h.name} icon={Building2} tint="#2563EB" />
        <Tile label="Block" value={h.block} icon={Layers} tint="#7B4CED" />
        <Tile label="Floor" value={h.floor} icon={Layers} tint="#0D9488" />
        <Tile label="Room" value={h.room} icon={BedDouble} tint="#F97316" />
        <Tile label="Bed" value={h.bed} icon={BedDouble} tint="#22C55E" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Roommates</h3>
          <ul className="space-y-3">
            {h.roommates.map((r) => <li key={r.enrollment} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-sm font-semibold text-white">
                  {r.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.enrollment}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">{r.bed}</span>
              </li>)}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Warden contact</h3>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#7B4CED]/10 text-[#7B4CED]">
              <User className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">{h.warden.name}</p>
              <p className="text-xs text-muted-foreground">Warden · {h.name}</p>
            </div>
          </div>
          <a
    href={`tel:${h.warden.mobile.replace(/\s/g, "")}`}
    className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
  >
            <Phone className="h-4 w-4" /> Call {h.warden.mobile}
          </a>
        </div>
      </div>
    </div>;
}
export {
  Route
};
