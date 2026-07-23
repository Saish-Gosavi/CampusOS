import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareWarning, Eye, UserCog, CheckCircle2, Search } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { StatCard } from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { complaints, staff } from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/warden/complaints")({
  component: ComplaintsPage
});
const TINT = "#EF4444";
function ComplaintsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [selected, setSelected] = useState(null);
  const [assignee, setAssignee] = useState("");
  const [resolution, setResolution] = useState("");
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (status !== "All" && c.status !== status) return false;
      if (priority !== "All" && c.priority !== priority) return false;
      if (q) {
        const t = q.toLowerCase();
        return c.code.toLowerCase().includes(t) || c.title.toLowerCase().includes(t) || c.raisedBy.toLowerCase().includes(t);
      }
      return true;
    });
  }, [q, status, priority]);
  const open = complaints.filter((c) => c.status === "Open").length;
  const inProgress = complaints.filter((c) => c.status === "In Progress").length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const high = complaints.filter((c) => c.priority === "High").length;
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Complaint Management"
    description="Track, assign and resolve complaints raised by residents."
    icon={MessageSquareWarning}
    tint={TINT}
    breadcrumbs={[{ label: "Complaints" }]}
  />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Open" value={String(open)} delta="Needs assignment" trend="down" icon={MessageSquareWarning} tint="#EF4444" />
        <StatCard label="In Progress" value={String(inProgress)} delta="Under work" trend="up" icon={MessageSquareWarning} tint="#3B82F6" />
        <StatCard label="Resolved" value={String(resolved)} delta="This month" trend="up" icon={CheckCircle2} tint="#22C55E" />
        <StatCard label="High Priority" value={String(high)} delta="Escalated" trend="down" icon={MessageSquareWarning} tint="#F97316" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by code, title or student..." className="h-10 pl-9" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
            {["All", "Open", "In Progress", "Resolved", "Closed"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
            {["All", "Low", "Medium", "High"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-3 pr-2">ID</th>
                <th className="py-3 pr-2">Student</th>
                <th className="py-3 pr-2">Title</th>
                <th className="py-3 pr-2">Category</th>
                <th className="py-3 pr-2">Priority</th>
                <th className="py-3 pr-2">Status</th>
                <th className="py-3 pr-2">Assigned</th>
                <th className="py-3 pr-2">Created</th>
                <th className="py-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                  <td className="py-3 pr-2 font-mono text-xs">{c.code}</td>
                  <td className="py-3 pr-2">
                    <p className="font-medium text-foreground">{c.raisedBy}</p>
                    <p className="text-xs text-muted-foreground">{c.room}</p>
                  </td>
                  <td className="py-3 pr-2 max-w-xs truncate" title={c.title}>{c.title}</td>
                  <td className="py-3 pr-2">{c.category}</td>
                  <td className="py-3 pr-2"><StatusPill status={c.priority} /></td>
                  <td className="py-3 pr-2"><StatusPill status={c.status} /></td>
                  <td className="py-3 pr-2 text-xs text-muted-foreground">{c.assigned ?? "\u2014"}</td>
                  <td className="py-3 pr-2 text-xs">{c.createdAt}</td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelected(c)} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{selected.code}</p>
                <h3 className="text-lg font-semibold text-foreground">{selected.title}</h3>
                <p className="text-xs text-muted-foreground">{selected.raisedBy} · {selected.room} · {selected.hostel}</p>
              </div>
              <div className="flex gap-2"><StatusPill status={selected.priority} /><StatusPill status={selected.status} /></div>
            </div>

            <p className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-sm">{selected.description}</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Assign staff</label>
                <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm">
                  <option value="">Select staff...</option>
                  {staff.map((s) => <option key={s.id} value={s.name}>{s.name} — {s.role}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Resolution notes</label>
                <Input value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="Short summary..." className="h-10" />
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Timeline</p>
              <ul className="space-y-2">
                {selected.updates.map((u, i) => <li key={i} className="rounded-lg border border-border bg-background p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{u.by}</span>
                      <span className="text-xs text-muted-foreground">{u.at}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{u.note}</p>
                  </li>)}
              </ul>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
              <Button variant="outline" onClick={() => {
    toast.success(`Assigned to ${assignee || "staff"}`);
  }}>
                <UserCog className="mr-1.5 h-4 w-4" /> Assign
              </Button>
              <Button className="bg-[#22C55E] text-white hover:bg-[#16A34A]" onClick={() => {
    toast.success("Complaint marked resolved");
    setSelected(null);
  }}>
                <CheckCircle2 className="mr-1.5 h-4 w-4" /> Resolve
              </Button>
            </div>
          </div>
        </div>}
    </div>;
}
export {
  Route
};
