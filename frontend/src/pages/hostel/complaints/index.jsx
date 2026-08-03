import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  MessageSquareWarning,
  CheckCircle2,
  UserCog,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  LayoutGrid,
  List,
  Eye,
  Check,
  User,
  Phone,
  MapPin,
  Tag,
  CalendarDays
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { complaints as seed, staff } from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/hostel-admin/complaints")({
  head: () => ({
    meta: [
      { title: "Complaint Management \u2014 Hostel Admin \xB7 CampusOS" },
      { name: "description", content: "Track, assign and resolve student complaints with Kanban and table views." }
    ]
  }),
  component: ComplaintsPage
});
const STATUSES = ["Open", "In Progress", "Resolved", "Closed"];
const CATEGORIES = ["All", "Plumbing", "Electrical", "Cleaning", "Mess", "Internet", "Furniture", "Other"];
const PRIORITIES = ["All", "High", "Medium", "Low"];
const PRIORITY_TINT = {
  High: "#EF4444",
  Medium: "#EAB308",
  Low: "#3B82F6"
};
const STATUS_TINT = {
  Open: "#EF4444",
  "In Progress": "#3B82F6",
  Resolved: "#22C55E",
  Closed: "#6B7280"
};
function ComplaintsPage() {
  const [rows, setRows] = useState(seed);
  const [view, setView] = useState("kanban");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [pri, setPri] = useState("All");
  const [viewing, setViewing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [resolving, setResolving] = useState(null);
  const [assignee, setAssignee] = useState("");
  const [resolution, setResolution] = useState("");
  const filtered = useMemo(() => {
    return rows.filter((c) => {
      if (cat !== "All" && c.category !== cat) return false;
      if (pri !== "All" && c.priority !== pri) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!c.title.toLowerCase().includes(s) && !c.raisedBy.toLowerCase().includes(s) && !c.room.toLowerCase().includes(s) && !c.code.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [rows, q, cat, pri]);
  const counts = useMemo(
    () => ({
      total: rows.length,
      open: rows.filter((r) => r.status === "Open").length,
      progress: rows.filter((r) => r.status === "In Progress").length,
      resolved: rows.filter((r) => r.status === "Resolved" || r.status === "Closed").length,
      high: rows.filter((r) => r.priority === "High" && r.status !== "Resolved" && r.status !== "Closed").length
    }),
    [rows]
  );
  const stats = [
    { label: "Total Complaints", value: counts.total, icon: MessageSquareWarning, tint: "#EF4444" },
    { label: "Open", value: counts.open, icon: AlertTriangle, tint: "#EF4444" },
    { label: "In Progress", value: counts.progress, icon: Clock, tint: "#3B82F6" },
    { label: "Resolved", value: counts.resolved, icon: CheckCircle2, tint: "#22C55E" },
    { label: "High Priority Open", value: counts.high, icon: AlertTriangle, tint: "#F97316" }
  ];
  const nowStamp = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 16).replace("T", " ");
  const openAssign = (c) => {
    setAssigning(c);
    setAssignee(c.assigned ?? "");
  };
  const submitAssign = () => {
    if (!assigning || !assignee) return;
    setRows(
      (prev) => prev.map(
        (r) => r.id === assigning.id ? {
          ...r,
          assigned: assignee,
          status: r.status === "Open" ? "In Progress" : r.status,
          updatedAt: nowStamp(),
          updates: [
            ...r.updates,
            { at: nowStamp(), by: "Hostel Admin", note: `Assigned to ${assignee}.` }
          ]
        } : r
      )
    );
    toast.success(`${assigning.code} assigned to ${assignee}`);
    setAssigning(null);
    setAssignee("");
  };
  const changeStatus = (c, status) => {
    setRows(
      (prev) => prev.map(
        (r) => r.id === c.id ? {
          ...r,
          status,
          updatedAt: nowStamp(),
          updates: [
            ...r.updates,
            { at: nowStamp(), by: "Hostel Admin", note: `Status changed to ${status}.` }
          ]
        } : r
      )
    );
    toast.success(`${c.code} \u2192 ${status}`);
  };
  const openResolve = (c) => {
    setResolving(c);
    setResolution("");
  };
  const submitResolve = () => {
    if (!resolving || !resolution.trim()) return;
    const stamp = nowStamp();
    setRows(
      (prev) => prev.map(
        (r) => r.id === resolving.id ? {
          ...r,
          status: "Resolved",
          resolvedAt: stamp,
          resolution: resolution.trim(),
          updatedAt: stamp,
          updates: [
            ...r.updates,
            { at: stamp, by: "Hostel Admin", note: `Resolved \u2014 ${resolution.trim()}` }
          ]
        } : r
      )
    );
    toast.success(`${resolving.code} marked as resolved`);
    setResolving(null);
    setResolution("");
  };
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Complaint Management"
    description="Track, assign and resolve student complaints across all blocks."
    icon={MessageSquareWarning}
    tint="#EF4444"
    breadcrumbs={[{ label: "Complaints" }]}
    action={<div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button
      onClick={() => setView("kanban")}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === "kanban" ? "bg-[#EF4444] text-white" : "text-muted-foreground hover:text-foreground"}`}
    >
              <LayoutGrid className="h-4 w-4" /> Kanban
            </button>
            <button
      onClick={() => setView("table")}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${view === "table" ? "bg-[#EF4444] text-white" : "text-muted-foreground hover:text-foreground"}`}
    >
              <List className="h-4 w-4" /> Table
            </button>
          </div>}
  />

      {
    /* Dashboard stats */
  }
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <span
    className="grid h-8 w-8 place-items-center rounded-lg"
    style={{ backgroundColor: `${s.tint}1A`, color: s.tint }}
  >
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
          </div>)}
      </div>

      {
    /* Filters */
  }
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
    value={q}
    onChange={(e) => setQ(e.target.value)}
    placeholder="Search ID, title, student, room…"
    className="h-9 w-72 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
  />
        </div>
        <div className="relative">
          <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <select
    value={cat}
    onChange={(e) => setCat(e.target.value)}
    className="h-9 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
  >
            {CATEGORIES.map((c) => <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>)}
          </select>
        </div>
        <select
    value={pri}
    onChange={(e) => setPri(e.target.value)}
    className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
  >
          {PRIORITIES.map((p) => <option key={p} value={p}>
              {p === "All" ? "All Priorities" : `${p} Priority`}
            </option>)}
        </select>
        <span className="ml-auto text-xs text-muted-foreground">
          Showing {filtered.length} of {rows.length}
        </span>
      </div>

      {
    /* Kanban */
  }
      {view === "kanban" && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STATUSES.map((status) => {
    const items = filtered.filter((c) => c.status === status);
    const tint = STATUS_TINT[status];
    return <div key={status} className="flex flex-col rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tint }} />
                    <p className="text-sm font-semibold text-foreground">{status}</p>
                  </div>
                  <span
      className="rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: `${tint}1A`, color: tint }}
    >
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-3">
                  {items.map((c) => <div
      key={c.id}
      className="rounded-lg border border-border bg-background p-3 shadow-sm transition-shadow hover:shadow-md"
    >
                      <div className="flex items-center justify-between">
                        <span
      className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
      style={{
        backgroundColor: `${PRIORITY_TINT[c.priority]}1A`,
        color: PRIORITY_TINT[c.priority]
      }}
    >
                          {c.priority}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">{c.code}</span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">{c.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-[10px] font-semibold text-white">
                          {c.raisedBy.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-foreground">{c.raisedBy}</p>
                          <p className="truncate text-[11px] text-muted-foreground">
                            {c.room} · {c.category}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-border pt-2 text-[11px] text-muted-foreground">
                        <span className="truncate">
                          {c.assigned ? <span className="inline-flex items-center gap-1">
                              <UserCog className="h-3 w-3" /> {c.assigned}
                            </span> : <span className="italic">Unassigned</span>}
                        </span>
                        <span>{c.createdAt.slice(5, 10)}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-1">
                        <button
      onClick={() => setViewing(c)}
      className="flex-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
                          View
                        </button>
                        {c.status !== "Resolved" && c.status !== "Closed" && <button
      onClick={() => openAssign(c)}
      className="flex-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-[#3B82F6] hover:bg-primary/80/10"
    >
                            Assign
                          </button>}
                        {c.status !== "Resolved" && c.status !== "Closed" && <button
      onClick={() => openResolve(c)}
      className="flex-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-[#22C55E] hover:bg-[#22C55E]/10"
    >
                            Resolve
                          </button>}
                        {c.status === "Resolved" && <button
      onClick={() => changeStatus(c, "Closed")}
      className="flex-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
    >
                            Close
                          </button>}
                      </div>
                    </div>)}
                  {items.length === 0 && <div className="grid h-24 place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                      No complaints
                    </div>}
                </div>
              </div>;
  })}
        </div>}

      {
    /* Table */
  }
      {view === "table" && <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Complaint ID</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Assigned Staff</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => <tr key={c.id} className="hover:bg-muted/30">
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="font-mono text-xs font-semibold text-foreground">{c.code}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{c.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-[10px] font-semibold text-white">
                        {c.raisedBy.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{c.raisedBy}</p>
                        <p className="truncate text-xs text-muted-foreground">{c.room}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{c.category}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusPill status={c.priority} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{c.createdAt}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">
                    {c.assigned ? <span className="inline-flex items-center gap-1.5">
                        <UserCog className="h-3.5 w-3.5 text-muted-foreground" /> {c.assigned}
                      </span> : <span className="text-xs italic text-muted-foreground">Unassigned</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
    onClick={() => setViewing(c)}
    title="View"
    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
  >
                        <Eye className="h-4 w-4" />
                      </button>
                      {c.status !== "Resolved" && c.status !== "Closed" && <>
                          <button
    onClick={() => openAssign(c)}
    title="Assign"
    className="grid h-8 w-8 place-items-center rounded-lg text-[#3B82F6] hover:bg-primary/80/10"
  >
                            <UserCog className="h-4 w-4" />
                          </button>
                          <button
    onClick={() => openResolve(c)}
    title="Resolve"
    className="grid h-8 w-8 place-items-center rounded-lg text-[#22C55E] hover:bg-[#22C55E]/10"
  >
                            <Check className="h-4 w-4" />
                          </button>
                        </>}
                    </div>
                  </td>
                </tr>)}
              {filtered.length === 0 && <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No complaints match the current filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>}

      {
    /* View dialog */
  }
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl">
          {viewing && <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquareWarning className="h-5 w-5 text-[#EF4444]" />
                  {viewing.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <span className="font-mono">{viewing.code}</span> ·
                  <StatusPill status={viewing.status} />
                  <StatusPill status={viewing.priority} />
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={User} label="Raised by" value={`${viewing.raisedBy} (${viewing.enrollment})`} />
                <InfoRow icon={MapPin} label="Location" value={`${viewing.hostel} \xB7 ${viewing.room}`} />
                <InfoRow icon={Tag} label="Category" value={viewing.category} />
                <InfoRow icon={Phone} label="Contact" value={viewing.contact} />
                <InfoRow icon={CalendarDays} label="Created" value={viewing.createdAt} />
                <InfoRow icon={UserCog} label="Assigned" value={viewing.assigned ?? "Unassigned"} />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Description</p>
                <p className="mt-1 text-sm text-foreground">{viewing.description}</p>
              </div>

              {viewing.resolution && <div className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/5 p-3">
                  <p className="text-xs font-medium text-[#16A34A]">Resolution</p>
                  <p className="mt-1 text-sm text-foreground">{viewing.resolution}</p>
                  {viewing.resolvedAt && <p className="mt-1 text-xs text-muted-foreground">Resolved on {viewing.resolvedAt}</p>}
                </div>}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Activity Timeline
                </p>
                <ol className="relative space-y-3 border-l border-border pl-4">
                  {viewing.updates.map((u, i) => <li key={i} className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-[#EF4444]" />
                      <p className="text-sm text-foreground">{u.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {u.by} · {u.at}
                      </p>
                    </li>)}
                </ol>
              </div>

              <DialogFooter className="flex-wrap gap-2">
                {viewing.status !== "Resolved" && viewing.status !== "Closed" && <>
                    <Button
    variant="outline"
    onClick={() => {
      const c = viewing;
      setViewing(null);
      openAssign(c);
    }}
  >
                      <UserCog className="mr-1.5 h-4 w-4" /> Assign Staff
                    </Button>
                    {viewing.status === "Open" && <Button
    variant="outline"
    onClick={() => {
      changeStatus(viewing, "In Progress");
      setViewing(null);
    }}
  >
                        <Clock className="mr-1.5 h-4 w-4" /> Mark In Progress
                      </Button>}
                    <Button
    onClick={() => {
      const c = viewing;
      setViewing(null);
      openResolve(c);
    }}
    className="bg-[#22C55E] hover:bg-[#16a34a]"
  >
                      <Check className="mr-1.5 h-4 w-4" /> Resolve
                    </Button>
                  </>}
                {viewing.status === "Resolved" && <Button
    onClick={() => {
      changeStatus(viewing, "Closed");
      setViewing(null);
    }}
    variant="outline"
  >
                    Close Complaint
                  </Button>}
                <Button variant="ghost" onClick={() => setViewing(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>}
        </DialogContent>
      </Dialog>

      {
    /* Assign dialog */
  }
      <Dialog open={!!assigning} onOpenChange={(o) => !o && setAssigning(null)}>
        <DialogContent>
          {assigning && <>
              <DialogHeader>
                <DialogTitle>Assign staff</DialogTitle>
                <DialogDescription>
                  {assigning.code} · {assigning.title}
                </DialogDescription>
              </DialogHeader>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Staff member</label>
                <select
    value={assignee}
    onChange={(e) => setAssignee(e.target.value)}
    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
  >
                  <option value="">Select staff…</option>
                  {staff.map((s) => <option key={s.id} value={s.name}>
                      {s.name} — {s.role} · {s.block}
                    </option>)}
                </select>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAssigning(null)}>
                  Cancel
                </Button>
                <Button onClick={submitAssign} disabled={!assignee} className="bg-primary/80 hover:bg-primary">
                  Assign
                </Button>
              </DialogFooter>
            </>}
        </DialogContent>
      </Dialog>

      {
    /* Resolve dialog */
  }
      <Dialog open={!!resolving} onOpenChange={(o) => !o && setResolving(null)}>
        <DialogContent>
          {resolving && <>
              <DialogHeader>
                <DialogTitle>Resolve complaint</DialogTitle>
                <DialogDescription>
                  {resolving.code} · {resolving.title}
                </DialogDescription>
              </DialogHeader>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Resolution note <span className="text-[#EF4444]">*</span>
                </label>
                <Textarea
    value={resolution}
    onChange={(e) => setResolution(e.target.value)}
    rows={4}
    placeholder="Describe the action taken to resolve this complaint…"
  />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setResolving(null)}>
                  Cancel
                </Button>
                <Button
    onClick={submitResolve}
    disabled={!resolution.trim()}
    className="bg-[#22C55E] hover:bg-[#16a34a]"
  >
                  <Check className="mr-1.5 h-4 w-4" /> Mark Resolved
                </Button>
              </DialogFooter>
            </>}
        </DialogContent>
      </Dialog>
    </div>;
}
function InfoRow({
  icon: Icon,
  label,
  value
}) {
  return <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/20 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>;
}
export {
  Route
};
