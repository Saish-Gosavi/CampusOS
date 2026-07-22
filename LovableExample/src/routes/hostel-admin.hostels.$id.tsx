import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Building2,
  Pencil,
  MapPin,
  UserCog,
  Phone,
  Layers,
  Users2,
  BedDouble,
  Calendar,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { hostels } from "@/lib/hostel-data";

export const Route = createFileRoute("/hostel-admin/hostels/$id")({
  loader: ({ params }) => {
    const hostel = hostels.find((h) => h.id === params.id);
    if (!hostel) throw notFound();
    return { hostel };
  },
  component: HostelDetailPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="text-xl font-semibold text-foreground">Hostel not found</h2>
      <Button asChild className="mt-4"><Link to="/hostel-admin/hostels">Back to hostels</Link></Button>
    </div>
  ),
});

function Stat({ icon: Icon, label, value, tint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; tint: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <span className="grid h-10 w-10 place-items-center rounded-lg" style={{ backgroundColor: `${tint}1A`, color: tint }}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

function HostelDetailPage() {
  const { hostel: h } = Route.useLoaderData();
  const pct = h.capacity ? Math.round((h.occupied / h.capacity) * 100) : 0;

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <HostelPageHeader
        title={h.name}
        description="Complete hostel overview and warden details."
        icon={Building2}
        tint="#2563EB"
        breadcrumbs={[
          { label: "Hostel Management", to: "/hostel-admin/hostels" },
          { label: h.name },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/hostel-admin/hostels"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Link>
            </Button>
            <Button asChild className="bg-[#2563EB] hover:bg-[#1e4fd1]">
              <Link to="/hostel-admin/hostels/$id/edit" params={{ id: h.id }}>
                <Pencil className="mr-1.5 h-4 w-4" /> Edit
              </Link>
            </Button>
          </div>
        }
      />

      {/* Hero */}
      <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${h.image} p-6 text-white shadow-md`}>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-wide opacity-80">{h.type} Hostel · Est. {h.establishedYear}</p>
            <h1 className="mt-1 text-2xl font-semibold">{h.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm opacity-90">
              <MapPin className="h-4 w-4" /> {h.address}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur">
              <StatusPill status={h.status} />
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={Users2} label="Capacity" value={h.capacity} tint="#2563EB" />
        <Stat icon={BedDouble} label="Occupied" value={h.occupied} tint="#7B4CED" />
        <Stat icon={BedDouble} label="Available" value={h.capacity - h.occupied} tint="#22C55E" />
        <Stat icon={Layers} label="Floors × Blocks" value={`${h.floors} × ${h.blocks}`} tint="#EA580C" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Occupancy */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Occupancy Overview</h3>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall</span>
            <span className="font-medium text-foreground">{h.occupied}/{h.capacity} ({pct}%)</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                backgroundColor: pct > 85 ? "#EF4444" : pct > 60 ? "#EAB308" : "#22C55E",
              }}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {Array.from({ length: h.floors }).map((_, i) => {
              const per = Math.round(h.capacity / h.floors);
              const occ = Math.min(per, Math.max(0, h.occupied - per * i));
              const p = per ? Math.round((occ / per) * 100) : 0;
              return (
                <div key={i} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">Floor {i + 1}</span>
                    <span className="text-muted-foreground">{occ}/{per}</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${p}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Warden */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Warden</h3>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-[#7B4CED] to-[#5B2FCB] text-white">
              <UserCog className="h-5 w-5" />
            </span>
            <div>
              <p className="font-medium text-foreground">{h.warden}</p>
              <p className="text-xs text-muted-foreground">Chief Warden</p>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> {h.wardenContact}</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /> Established {h.establishedYear}</p>
          </div>
        </section>

        {/* Amenities */}
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-3">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-[#EAB308]" /> Amenities
          </h3>
          <div className="flex flex-wrap gap-2">
            {h.amenities.map((a: string) => (
              <span key={a} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground">
                {a}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
