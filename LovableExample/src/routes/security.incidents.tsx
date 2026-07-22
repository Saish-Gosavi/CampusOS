import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert, Plus, Eye, Filter } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { incidents, type Incident } from "@/lib/security-data";
import { Flame, Stethoscope, ShieldOff, AlertOctagon } from "lucide-react";

export const Route = createFileRoute("/security/incidents")({
  component: IncidentsPage,
});

const TINT = "#EF4444";

function IncidentsPage() {
  const [active, setActive] = useState<Incident | null>(null);
  const openCount = incidents.filter((i) => i.status === "Open").length;
  const inProg = incidents.filter((i) => i.status === "In Progress").length;
  const resolved = incidents.filter((i) => i.status === "Resolved" || i.status === "Closed").length;
  const high = incidents.filter((i) => i.severity === "High").length;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
        title="Emergency & Incident Log"
        description="Report and track security incidents on campus."
        icon={ShieldAlert}
        tint={TINT}
        breadcrumbs={[{ label: "Incidents" }]}
        action={<CreateIncidentDialog />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Open Incidents" value={String(openCount)} delta="Needs attention" trend="down" icon={AlertOctagon} tint="#EF4444" />
        <StatCard label="In Progress" value={String(inProg)} delta="Being handled" trend="up" icon={Stethoscope} tint="#F97316" />
        <StatCard label="Resolved / Closed" value={String(resolved)} delta="This month" trend="up" icon={ShieldOff} tint="#22C55E" />
        <StatCard label="High Severity" value={String(high)} delta="All-time" trend="down" icon={Flame} tint="#DC2626" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row">
        <Input placeholder="Search incidents…" className="h-10 flex-1" />
        <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filters</Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Incident ID</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Date & Time</th>
                <th className="px-4 py-3 text-left">Reported By</th>
                <th className="px-4 py-3 text-left">Severity</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {incidents.map((i) => (
                <tr key={i.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-foreground">{i.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{i.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.dateTime}</td>
                  <td className="px-4 py-3 text-muted-foreground">{i.reportedBy}</td>
                  <td className="px-4 py-3"><StatusPill status={i.severity} /></td>
                  <td className="px-4 py-3"><StatusPill status={i.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setActive(i)} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-lg">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-[#EF4444]" /> {active.type} · {active.id}
                </DialogTitle>
                <DialogDescription>{active.dateTime} · {active.location}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p className="rounded-lg border border-border bg-muted/30 p-3 text-foreground">{active.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reported by</span>
                  <span className="font-medium">{active.reportedBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Severity</span>
                  <StatusPill status={active.severity} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusPill status={active.status} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Update</Button>
                <Button style={{ backgroundColor: "#22C55E" }} className="text-white hover:opacity-90">Close Incident</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CreateIncidentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: TINT }} className="gap-2 text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> Log Incident
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Incident Report</DialogTitle>
          <DialogDescription>Record what happened, where and who is involved.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 text-sm">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Incident Type</span>
            <select className="h-10 w-full rounded-lg border border-border bg-background px-3">
              <option>Medical</option><option>Fire</option><option>Theft</option>
              <option>Unauthorized Entry</option><option>Fight</option><option>Damage</option><option>Other</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Location</span>
              <Input placeholder="e.g. Main Gate" className="h-10" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Student (optional)</span>
              <Input placeholder="Name / enrollment" className="h-10" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Description</span>
            <textarea rows={4} placeholder="Describe what happened…" className="w-full rounded-lg border border-border bg-background p-3 text-sm" />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90">Log Incident</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
