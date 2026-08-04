import { createFileRoute, Link } from "@/routes/compat";
import { useMemo, useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  UserCog,
  Eye,
  Pencil,
  Trash2,
  Filter
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHostels } from "@/services/queries/hostelHooks";
const Route = createFileRoute("/hostel-admin/hostels/")({
  component: HostelsPage
});
function HostelsPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  const { data: hostels = [], isLoading, isError } = useHostels();
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return hostels.filter((h) => {
      const mQ = !query || h.name.toLowerCase().includes(query) || h.address.toLowerCase().includes(query) || h.warden.toLowerCase().includes(query);
      const mT = type === "All" || h.type === type;
      const mS = status === "All" || h.status === status;
      return mQ && mT && mS;
    });
  }, [q, type, status]);
  const stats = useMemo(() => {
    const capacity = hostels.reduce((a, h) => a + h.capacity, 0);
    const occupied = hostels.reduce((a, h) => a + h.occupied, 0);
    return {
      total: hostels.length,
      capacity,
      occupied,
      available: capacity - occupied,
      active: hostels.filter((h) => h.status === "Active").length
    };
  }, []);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Hostel Management"
    description="View, add and manage every hostel block on campus."
    icon={Building2}
    tint="#2563EB"
    breadcrumbs={[{ label: "Hostel Management" }]}
    action={<Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/hostel-admin/hostels/add">
              <Plus className="mr-1.5 h-4 w-4" /> Add Hostel
            </Link>
          </Button>}
  />

      {isLoading && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-border bg-card">
          <div className="text-muted-foreground">Loading hostels...</div>
        </div>
      )}

      {isError && (
        <div className="flex h-40 items-center justify-center rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/10">
          <div className="text-[#EF4444]">Failed to load hostels. Please try again.</div>
        </div>
      )}

      {!isLoading && !isError && (
        <>

      {
    /* Stats */
  }
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
    { label: "Total Hostels", value: stats.total, tint: "#2563EB" },
    { label: "Active", value: stats.active, tint: "#22C55E" },
    { label: "Total Capacity", value: stats.capacity, tint: "#7B4CED" },
    { label: "Occupied", value: stats.occupied, tint: "#EA580C" },
    { label: "Available", value: stats.available, tint: "#0D9488" }
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
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, address or warden" className="h-10 pl-9" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              {["All", "Boys", "Girls", "Co-ed"].map((x) => <option key={x}>{x}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
              {["All", "Active", "Under Maintenance", "Inactive"].map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
      </div>

      {
    /* Cards */
  }
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((h) => {
    const pct = h.capacity ? Math.round(h.occupied / h.capacity * 100) : 0;
    return <div key={h.id} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
              <div className={`relative h-28 bg-gradient-to-br ${h.image}`}>
                <div className="absolute inset-0 flex items-end justify-between p-4">
                  <div className="text-white">
                    <p className="text-xs uppercase tracking-wide opacity-80">{h.type} Hostel</p>
                    <h3 className="text-lg font-semibold leading-tight">{h.name}</h3>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-white/20 text-white backdrop-blur">
                    <Building2 className="h-5 w-5" />
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <StatusPill status={h.status} />
                  <span className="text-xs text-muted-foreground">Est. {h.establishedYear}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="line-clamp-2">{h.address}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/50 py-2">
                    <p className="text-[11px] text-muted-foreground">Capacity</p>
                    <p className="text-sm font-semibold text-foreground">{h.capacity}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 py-2">
                    <p className="text-[11px] text-muted-foreground">Floors</p>
                    <p className="text-sm font-semibold text-foreground">{h.floors}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 py-2">
                    <p className="text-[11px] text-muted-foreground">Blocks</p>
                    <p className="text-sm font-semibold text-foreground">{h.blocks}</p>
                  </div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Occupancy</span>
                    <span className="font-medium text-foreground">{h.occupied}/{h.capacity} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
      className="h-full rounded-full"
      style={{
        width: `${pct}%`,
        backgroundColor: pct > 85 ? "#EF4444" : pct > 60 ? "#EAB308" : "#22C55E"
      }}
    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserCog className="h-4 w-4 text-[#7B4CED]" />
                  <span className="font-medium text-foreground">{h.warden}</span>
                  <span className="text-muted-foreground">· {h.wardenContact}</span>
                </div>
                <div className="mt-auto flex items-center justify-end gap-1 border-t border-border pt-3">
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/hostel-admin/hostels/$id" params={{ id: h.id }}>
                      <Eye className="mr-1.5 h-4 w-4" /> View
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link to="/hostel-admin/hostels/$id/edit" params={{ id: h.id }}>
                      <Pencil className="mr-1.5 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <button className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>;
  })}
        {filtered.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No hostels match your filters.
          </div>}
      </div>
        </>
      )}
    </div>;
}
export {
  Route
};
