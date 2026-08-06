import { useMemo, useState } from "react";
import { createFileRoute } from "@/routes/compat";
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
  CalendarDays,
  RotateCcw,
  Plus
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useComplaints, useUpdateComplaint, useCreateComplaint } from "@/services/queries/complaintHooks";
import { staff } from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/hostel-admin/complaints")({
  head: () => ({
    meta: [
      { title: "Complaint Management — Hostel Admin · CampusOS" },
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
  const { data: apiComplaints } = useComplaints();
  const updateMutation = useUpdateComplaint();
  const createMutation = useCreateComplaint();

  const [view, setView] = useState("kanban");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [pri, setPri] = useState("All");
  const [viewing, setViewing] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [resolving, setResolving] = useState(null);
  const [assignee, setAssignee] = useState("");
  const [resolution, setResolution] = useState("");

  // Dynamic creation modal state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStudent, setNewStudent] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newCategory, setNewCategory] = useState("Plumbing");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDescription, setNewDescription] = useState("");

  const rows = useMemo(() => {
    if (apiComplaints && Array.isArray(apiComplaints)) {
      return apiComplaints.map((c) => {
        const priorityCap = c.priority ? c.priority.charAt(0).toUpperCase() + c.priority.slice(1) : "Medium";
        const statusMap = {
          open: "Open",
          "in-progress": "In Progress",
          assigned: "In Progress",
          resolved: "Resolved",
          closed: "Closed",
        };
        const statusCap = statusMap[c.status?.toLowerCase()] || (c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : "Open");

        return {
          id: c.id,
          code: `CMP-${c.id.toString().padStart(4, "0")}`,
          title: c.title,
          description: c.description,
          category: c.category || "Other",
          priority: priorityCap,
          status: statusCap,
          raisedBy: c.student?.user?.name || "Student",
          enrollment: c.student?.enrollmentNo || "N/A",
          room: c.student?.allocations?.[0]?.bed?.room?.name || "Room",
          hostel: c.student?.allocations?.[0]?.bed?.room?.floor?.block?.hostel?.name || "Hostel",
          contact: c.student?.user?.phone || "N/A",
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          assigned: c.assignedTo?.user?.name || c.assigned || null,
          resolution: c.resolution || null,
          updates: c.updates || [
            {
              at: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 16).replace("T", " ") : new Date().toISOString().slice(0, 16).replace("T", " "),
              by: c.student?.user?.name || "Student",
              note: "Complaint submitted.",
            },
          ],
        };
      });
    }
    return [];
  }, [apiComplaints]);

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      if (cat !== "All" && c.category !== cat) return false;
      if (pri !== "All" && c.priority !== pri) return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !c.title.toLowerCase().includes(s) &&
          !c.raisedBy.toLowerCase().includes(s) &&
          !c.room.toLowerCase().includes(s) &&
          !c.code.toLowerCase().includes(s)
        )
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

  const nowStamp = () => new Date().toISOString().slice(0, 16).replace("T", " ");

  const openAssign = (c) => {
    setAssigning(c);
    setAssignee(c.assigned ?? "");
  };

  const submitAssign = () => {
    if (!assigning || !assignee) return;
    const newStatus = assigning.status === "Open" ? "In Progress" : assigning.status;

    if (typeof assigning.id === "number") {
      updateMutation.mutate({
        id: assigning.id,
        assigned: assignee,
        status: newStatus.toLowerCase(),
      });
    }

    setSeedRows((prev) =>
      prev.map((r) =>
        r.id === assigning.id
          ? {
              ...r,
              assigned: assignee,
              status: newStatus,
              updatedAt: nowStamp(),
              updates: [
                ...r.updates,
                { at: nowStamp(), by: "Hostel Admin", note: `Assigned to ${assignee}.` },
              ],
            }
          : r
      )
    );
    toast.success(`${assigning.code} assigned to ${assignee}`);
    setAssigning(null);
    setAssignee("");
  };

  const changeStatus = (c, status) => {
    if (typeof c.id === "number") {
      updateMutation.mutate({
        id: c.id,
        status: status.toLowerCase(),
      });
    }

    setSeedRows((prev) =>
      prev.map((r) =>
        r.id === c.id
          ? {
              ...r,
              status,
              updatedAt: nowStamp(),
              updates: [
                ...r.updates,
                { at: nowStamp(), by: "Hostel Admin", note: `Status changed to ${status}.` },
              ],
            }
          : r
      )
    );
    toast.success(`${c.code} → ${status}`);
  };

  const openResolve = (c) => {
    setResolving(c);
    setResolution("");
  };

  const submitResolve = () => {
    if (!resolving || !resolution.trim()) return;
    const stamp = nowStamp();

    if (typeof resolving.id === "number") {
      updateMutation.mutate({
        id: resolving.id,
        status: "resolved",
        resolution: resolution.trim(),
      });
    }

    setSeedRows((prev) =>
      prev.map((r) =>
        r.id === resolving.id
          ? {
              ...r,
              status: "Resolved",
              resolvedAt: stamp,
              resolution: resolution.trim(),
              updatedAt: stamp,
              updates: [
                ...r.updates,
                { at: stamp, by: "Hostel Admin", note: `Resolved — ${resolution.trim()}` },
              ],
            }
          : r
      )
    );
    toast.success(`${resolving.code} marked as resolved`);
    setResolving(null);
    setResolution("");
  };

  const submitCreate = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("Please fill in required fields.");
      return;
    }

    const stamp = nowStamp();
    const newId = Date.now();
    const newCode = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const newObj = {
      id: newId,
      code: newCode,
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      priority: newPriority,
      status: "Open",
      raisedBy: newStudent.trim() || "Student",
      enrollment: "EN2026" + Math.floor(1000 + Math.random() * 9000),
      room: newRoom.trim() || "Room 101",
      hostel: "Hostel 1",
      contact: "+91 98765 43210",
      createdAt: stamp,
      assigned: null,
      resolution: null,
      updates: [{ at: stamp, by: newStudent.trim() || "Student", note: "Complaint submitted." }],
    };

    try {
      await createMutation.mutateAsync({
        title: newTitle.trim(),
        description: newDescription.trim(),
        category: newCategory,
        priority: newPriority.toLowerCase(),
      });
    } catch (e) {
      // Local state fallback
    }

    setSeedRows((prev) => [newObj, ...prev]);
    toast.success(`${newCode} raised successfully!`);

    setIsCreating(false);
    setNewTitle("");
    setNewDescription("");
    setNewStudent("");
    setNewRoom("");
    setNewCategory("Plumbing");
    setNewPriority("Medium");
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Complaint Management"
        description="Track, assign and resolve student complaints across all blocks."
        icon={MessageSquareWarning}
        tint="#EF4444"
        breadcrumbs={[{ label: "Complaints" }]}
        action={
          <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
            <button
              onClick={() => setView("kanban")}
              title="Kanban View"
              aria-label="Kanban View"
              className={`inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors ${view === "kanban" ? "bg-[#EF4444] text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              title="Table View"
              aria-label="Table View"
              className={`inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors ${view === "table" ? "bg-[#EF4444] text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        }
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

                      <div className="mt-3 flex items-center">
                        <button
                          onClick={() => setViewing(c)}
                          className="w-full rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>)}
                  {items.length === 0 && <div className="grid h-24 place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                      No complaints
                    </div>}
                </div>
              </div>;
  })}
        </div>}

      {view === "table" && (
        <div className="w-full rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs table-fixed">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="uppercase tracking-wider text-muted-foreground font-semibold">
                <th className="w-[23%] px-3.5 py-3">Complaint</th>
                <th className="w-[18%] px-3.5 py-3">Student</th>
                <th className="w-[10%] px-3.5 py-3">Category</th>
                <th className="w-[10%] px-3.5 py-3">Priority</th>
                <th className="w-[12%] px-3.5 py-3">Status</th>
                <th className="w-[9%] px-3.5 py-3">Created</th>
                <th className="w-[13%] px-3.5 py-3">Assigned Staff</th>
                <th className="w-[15%] px-3.5 py-3 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3.5 py-3">
                    <p className="font-mono text-[11px] font-bold text-primary/90">{c.code}</p>
                    <p className="line-clamp-1 text-xs font-medium text-foreground" title={c.title}>
                      {c.title}
                    </p>
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-foreground">{c.raisedBy}</p>
                      <p className="truncate text-[11px] text-muted-foreground">{c.room}</p>
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <span className="inline-flex items-center rounded-md bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-foreground border border-border/40">
                      {c.category}
                    </span>
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusPill status={c.priority} />
                  </td>
                  <td className="px-3.5 py-3">
                    <StatusPill status={c.status} />
                  </td>
                  <td className="px-3.5 py-3 text-[11px] text-muted-foreground font-mono">
                    {c.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-3.5 py-3">
                    {c.assigned ? (
                      <span className="inline-flex items-center gap-1 truncate text-xs font-medium text-foreground">
                        <UserCog className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate">{c.assigned}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] italic text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-3.5 py-3 text-right pr-4">
                    <div className="inline-flex items-center justify-end">
                      <button
                        onClick={() => setViewing(c)}
                        title="View Details"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shadow-2xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No complaints match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {
    /* View dialog */
  }
      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          {viewing && (
            <>
              <DialogHeader className="p-6 pb-4 border-b border-border/60 shrink-0">
                <DialogTitle className="flex items-center gap-2 pr-6">
                  <MessageSquareWarning className="h-5 w-5 shrink-0 text-[#EF4444]" />
                  <span className="truncate">{viewing.title}</span>
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="font-mono">{viewing.code}</span> ·
                  <StatusPill status={viewing.status} />
                  <StatusPill status={viewing.priority} />
                </DialogDescription>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoRow icon={User} label="Raised by" value={`${viewing.raisedBy} (${viewing.enrollment})`} />
                  <InfoRow icon={MapPin} label="Location" value={`${viewing.hostel} · ${viewing.room}`} />
                  <InfoRow icon={Tag} label="Category" value={viewing.category} />
                  <InfoRow icon={Phone} label="Contact" value={viewing.contact} />
                  <InfoRow icon={CalendarDays} label="Created" value={viewing.createdAt} />
                  <InfoRow icon={UserCog} label="Assigned" value={viewing.assigned ?? "Unassigned"} />
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</p>
                  <p className="mt-1.5 text-sm text-foreground leading-relaxed">{viewing.description}</p>
                </div>

                {viewing.resolution && (
                  <div className="rounded-xl border border-[#22C55E]/30 bg-[#22C55E]/5 p-4">
                    <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wider">Resolution</p>
                    <p className="mt-1.5 text-sm text-foreground leading-relaxed">{viewing.resolution}</p>
                    {viewing.resolvedAt && (
                      <p className="mt-2 text-xs text-muted-foreground font-mono">Resolved on {viewing.resolvedAt}</p>
                    )}
                  </div>
                )}

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Activity Timeline
                  </p>
                  <ol className="relative space-y-4 border-l-2 border-border/60 pl-4 ml-1.5">
                    {viewing.updates.map((u, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-[#EF4444]" />
                        <p className="text-xs font-medium text-foreground">{u.note}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                          {u.by} · {u.at}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              <DialogFooter className="p-6 pt-4 border-t border-border/60 flex justify-end shrink-0 bg-card">
                <Button variant="ghost" onClick={() => setViewing(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
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
          {resolving && (
            <>
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
                  className="bg-[#22C55E] hover:bg-[#16a34a] text-white"
                >
                  <Check className="mr-1.5 h-4 w-4" /> Mark Resolved
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Complaint Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#EF4444]" />
              Raise New Complaint
            </DialogTitle>
            <DialogDescription>
              Submit a new hostel complaint to track and resolve dynamically.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Title <span className="text-[#EF4444]">*</span>
              </label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Geyser Not Heating Water"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Category <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Priority <span className="text-[#EF4444]">*</span>
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="h-11 w-full rounded-xl border border-input bg-transparent px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Student Name
                </label>
                <Input
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Room / Location
                </label>
                <Input
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="e.g. Room 304 (Block A)"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Description <span className="text-[#EF4444]">*</span>
              </label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                placeholder="Describe the complaint in detail…"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitCreate}
              disabled={!newTitle.trim() || !newDescription.trim()}
              className="bg-[#EF4444] text-white hover:bg-[#dc2626]"
            >
              <Plus className="mr-1.5 h-4 w-4" /> Submit Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
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
