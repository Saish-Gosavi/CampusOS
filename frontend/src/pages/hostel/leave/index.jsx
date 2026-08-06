import { useState, useEffect, useCallback, useMemo } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  CalendarDays, Check, X, Eye, Search, Filter, Clock, CheckCircle2,
  XCircle, User, Phone, MapPin, FileText, Loader2, RefreshCw, Plus, Trash2
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { leaveApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/hostel-admin/leaves")({
  head: () => ({
    meta: [
      { title: "Leave Management — Hostel Admin · CampusOS" },
      { name: "description", content: "Review, approve or reject student hostel leave requests." }
    ]
  }),
  component: LeavesPage
});

const LEAVE_TYPES = ["All", "Home Visit", "Medical", "Family Function", "Personal", "Emergency", "Academic"];
const TABS = ["Pending", "Approved", "Rejected", "All", "History"];

// Helper to format date
function fmt(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// Calculate days between dates
function daysBetween(start, end) {
  const s = new Date(start), e = new Date(end);
  return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1);
}

// Extract room label from nested allocation
function getRoomLabel(student) {
  const alloc = student?.allocations?.[0];
  if (!alloc?.bed?.room) return "—";
  const { room } = alloc.bed;
  const block = room.floor?.block;
  const hostel = block?.hostel?.name || "";
  return `${hostel} · Room ${room.number}`;
}

function LeavesPage() {
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Pending");
  const [q, setQ] = useState("");
  const [leaveType, setLeaveType] = useState("All");
  const [viewing, setViewing] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ studentId: "", leaveType: "Personal", reason: "", destination: "", contactPhone: "", parentContact: "", startDate: "", endDate: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const statusParam = tab === "All" || tab === "History" ? undefined : tab.toLowerCase();
      const [listRes, statsRes] = await Promise.all([
        leaveApi.getAll({ status: statusParam, leaveType: leaveType !== "All" ? leaveType : undefined, search: q || undefined }),
        leaveApi.getStats()
      ]);
      const items = listRes?.items || listRes?.data?.items || [];
      setRows(tab === "History" ? items.filter(r => r.status !== "pending") : items);
      const s = statsRes?.data || statsRes;
      setStats({ total: s.total ?? 0, pending: s.pending ?? 0, approved: s.approved ?? 0, rejected: s.rejected ?? 0 });
    } catch (err) {
      toast.error("Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  }, [tab, leaveType, q]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statCards = [
    { label: "Total Requests", value: stats.total, icon: CalendarDays, tint: "#2563EB" },
    { label: "Pending", value: stats.pending, icon: Clock, tint: "#EAB308" },
    { label: "Approved", value: stats.approved, icon: CheckCircle2, tint: "#22C55E" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, tint: "#EF4444" }
  ];

  const openReview = (row, action) => {
    setReviewing({ row, action });
    setRemarks(row.remarks ?? "");
  };

  const submitReview = async () => {
    if (!reviewing) return;
    const { row, action } = reviewing;
    setActionLoading(true);
    try {
      await leaveApi.updateStatus(row.id, { status: action.toLowerCase(), remarks: remarks.trim() });
      toast.success(`${action} — ${row.student?.fullName || "Student"}`);
      setReviewing(null);
      setRemarks("");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this leave request?")) return;
    try {
      await leaveApi.delete(id);
      toast.success("Leave request deleted");
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await leaveApi.create({
        ...createForm,
        studentId: Number(createForm.studentId)
      });
      toast.success("Leave request created");
      setCreateOpen(false);
      setCreateForm({ studentId: "", leaveType: "Personal", reason: "", destination: "", contactPhone: "", parentContact: "", startDate: "", endDate: "" });
      fetchData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Leave Management"
        description="Review, approve or reject hostel leave requests from residents."
        icon={CalendarDays}
        tint="#F97316"
        breadcrumbs={[{ label: "Leave Management" }]}
        action={
          <div className="flex items-center gap-2">
            <button onClick={fetchData} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-muted">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90">
              <Plus className="h-4 w-4" /> New Request
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ backgroundColor: `${s.tint}1A`, color: s.tint }}>
                <s.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Filters */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === t ? "bg-[#F97316] text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
              {t}
            </button>
          ))}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search student, room, reason…"
                className="h-9 w-64 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground outline-none" />
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select value={leaveType} onChange={e => setLeaveType(e.target.value)}
                className="h-9 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground outline-none">
                {LEAVE_TYPES.map(t => <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Leave Type</th>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">To</th>
                <th className="px-4 py-3 font-medium">Days</th>
                <th className="px-4 py-3 font-medium">Reason</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Remarks</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" /> Loading leave requests…
                  </div>
                </td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No leave requests match the current filters.
                </td></tr>
              ) : rows.map(r => {
                const name = r.student?.fullName || "Unknown";
                const initials = name.split(" ").map(p => p[0]).join("").slice(0, 2);
                const enrollment = r.student?.collegeId || "—";
                const room = getRoomLabel(r.student);
                const days = daysBetween(r.startDate, r.endDate);
                const statusNorm = r.status.charAt(0).toUpperCase() + r.status.slice(1);
                return (
                  <tr key={r.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                          {initials}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{name}</p>
                          <p className="truncate text-xs text-muted-foreground">{enrollment} · {room}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-full bg-[#F97316]/10 px-2 py-0.5 text-xs font-medium text-[#F97316]">{r.leaveType}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{fmt(r.startDate)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{fmt(r.endDate)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{days}</td>
                    <td className="max-w-[240px] px-4 py-3 text-muted-foreground"><p className="truncate">{r.reason}</p></td>
                    <td className="whitespace-nowrap px-4 py-3"><StatusPill status={statusNorm} /></td>
                    <td className="max-w-[200px] px-4 py-3 text-xs text-muted-foreground"><p className="truncate">{r.remarks || "—"}</p></td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => setViewing(r)} title="View"
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </button>
                        {r.status === "pending" && <>
                          <button onClick={() => openReview(r, "Approved")} title="Approve"
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#22C55E] hover:bg-[#22C55E]/10">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={() => openReview(r, "Rejected")} title="Reject"
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10">
                            <X className="h-4 w-4" />
                          </button>
                        </>}
                        <button onClick={() => handleDelete(r.id)} title="Delete"
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewing} onOpenChange={o => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          {viewing && <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#F97316]" />
                Leave Request · {viewing.student?.fullName || "Student"}
              </DialogTitle>
              <DialogDescription>
                Applied on {fmt(viewing.createdAt)} · {daysBetween(viewing.startDate, viewing.endDate)} day(s)
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow icon={User} label="Enrollment" value={viewing.student?.collegeId || "—"} />
              <InfoRow icon={User} label="Room" value={getRoomLabel(viewing.student)} />
              <InfoRow icon={CalendarDays} label="From" value={fmt(viewing.startDate)} />
              <InfoRow icon={CalendarDays} label="To" value={fmt(viewing.endDate)} />
              <InfoRow icon={FileText} label="Leave Type" value={viewing.leaveType} />
              <InfoRow icon={MapPin} label="Destination" value={viewing.destination || "—"} />
              <InfoRow icon={Phone} label="Student Contact" value={viewing.contactPhone || viewing.student?.phone || "—"} />
              <InfoRow icon={Phone} label="Parent Contact" value={viewing.parentContact || "—"} />
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground">Reason</p>
              <p className="mt-1 text-sm text-foreground">{viewing.reason}</p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <div className="mt-1"><StatusPill status={viewing.status.charAt(0).toUpperCase() + viewing.status.slice(1)} /></div>
              </div>
              {viewing.reviewedBy && <div className="text-right">
                <p className="text-xs text-muted-foreground">Reviewed by</p>
                <p className="text-sm font-medium text-foreground">{viewing.reviewedBy}</p>
                <p className="text-xs text-muted-foreground">{fmt(viewing.reviewedAt)}</p>
              </div>}
            </div>

            {viewing.remarks && <div className="rounded-lg border border-border bg-muted/30 p-3">
              <p className="text-xs font-medium text-muted-foreground">Remarks</p>
              <p className="mt-1 text-sm text-foreground">{viewing.remarks}</p>
            </div>}

            <DialogFooter>
              {viewing.status === "pending" ? <>
                <Button variant="outline" onClick={() => { const r = viewing; setViewing(null); openReview(r, "Rejected"); }} className="text-[#EF4444] hover:text-[#EF4444]">
                  <X className="mr-1.5 h-4 w-4" /> Reject
                </Button>
                <Button onClick={() => { const r = viewing; setViewing(null); openReview(r, "Approved"); }} className="bg-[#22C55E] hover:bg-[#16a34a]">
                  <Check className="mr-1.5 h-4 w-4" /> Approve
                </Button>
              </> : <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>}
            </DialogFooter>
          </>}
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Dialog */}
      <Dialog open={!!reviewing} onOpenChange={o => !o && setReviewing(null)}>
        <DialogContent>
          {reviewing && <>
            <DialogHeader>
              <DialogTitle>{reviewing.action === "Approved" ? "Approve" : "Reject"} leave request</DialogTitle>
              <DialogDescription>
                {reviewing.row.student?.fullName} · {fmt(reviewing.row.startDate)} → {fmt(reviewing.row.endDate)} ({daysBetween(reviewing.row.startDate, reviewing.row.endDate)} day{daysBetween(reviewing.row.startDate, reviewing.row.endDate) === 1 ? "" : "s"})
              </DialogDescription>
            </DialogHeader>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                Remarks {reviewing.action === "Rejected" && <span className="text-[#EF4444]">*</span>}
              </label>
              <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={4}
                placeholder={reviewing.action === "Approved" ? "Optional notes for the resident…" : "Reason for rejection…"} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setReviewing(null)}>Cancel</Button>
              <Button
                onClick={submitReview}
                disabled={actionLoading || (reviewing.action === "Rejected" && !remarks.trim())}
                className={reviewing.action === "Approved" ? "bg-[#22C55E] hover:bg-[#16a34a]" : "bg-[#EF4444] hover:bg-[#dc2626]"}
              >
                {actionLoading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> :
                  reviewing.action === "Approved" ? <><Check className="mr-1.5 h-4 w-4" /> Approve</> : <><X className="mr-1.5 h-4 w-4" /> Reject</>}
              </Button>
            </DialogFooter>
          </>}
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={o => !o && setCreateOpen(false)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>New Leave Request</DialogTitle>
            <DialogDescription>Submit a new leave request on behalf of a student</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Student ID *</label>
                <input required type="number" value={createForm.studentId} onChange={e => setCreateForm(p => ({ ...p, studentId: e.target.value }))}
                  placeholder="Student database ID" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Leave Type *</label>
                <select required value={createForm.leaveType} onChange={e => setCreateForm(p => ({ ...p, leaveType: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                  {LEAVE_TYPES.slice(1).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">From Date *</label>
                <input required type="date" value={createForm.startDate} onChange={e => setCreateForm(p => ({ ...p, startDate: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">To Date *</label>
                <input required type="date" value={createForm.endDate} onChange={e => setCreateForm(p => ({ ...p, endDate: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Destination</label>
                <input type="text" value={createForm.destination} onChange={e => setCreateForm(p => ({ ...p, destination: e.target.value }))}
                  placeholder="City / address of destination" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Student Contact</label>
                <input type="tel" value={createForm.contactPhone} onChange={e => setCreateForm(p => ({ ...p, contactPhone: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Parent Contact</label>
                <input type="tel" value={createForm.parentContact} onChange={e => setCreateForm(p => ({ ...p, parentContact: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Reason *</label>
                <Textarea required rows={3} value={createForm.reason} onChange={e => setCreateForm(p => ({ ...p, reason: e.target.value }))}
                  placeholder="Reason for leave…" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Submitting…</> : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/20 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

export { Route };
