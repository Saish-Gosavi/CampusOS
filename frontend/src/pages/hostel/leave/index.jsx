import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Check,
  X,
  Eye,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Phone,
  MapPin,
  FileText
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { leaveRequests as seed } from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/hostel-admin/leaves")({
  head: () => ({
    meta: [
      { title: "Leave Management \u2014 Hostel Admin \xB7 CampusOS" },
      { name: "description", content: "Review, approve or reject student hostel leave requests." }
    ]
  }),
  component: LeavesPage
});
function LeavesPage() {
  const [rows, setRows] = useState(seed);
  const [tab, setTab] = useState("Pending");
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [viewing, setViewing] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [remarks, setRemarks] = useState("");
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (tab === "History") {
        if (r.status === "Pending") return false;
      } else if (tab !== "All" && r.status !== tab) return false;
      if (type !== "All" && r.leaveType !== type) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!r.student.toLowerCase().includes(s) && !r.enrollment.toLowerCase().includes(s) && !r.room.toLowerCase().includes(s) && !r.reason.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [rows, tab, type, q]);
  const counts = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((r) => r.status === "Pending").length,
      approved: rows.filter((r) => r.status === "Approved").length,
      rejected: rows.filter((r) => r.status === "Rejected").length
    }),
    [rows]
  );
  const stats = [
    { label: "Total Requests", value: counts.total, icon: CalendarDays, tint: "#2563EB" },
    { label: "Pending", value: counts.pending, icon: Clock, tint: "#EAB308" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, tint: "#22C55E" },
    { label: "Rejected", value: counts.rejected, icon: XCircle, tint: "#EF4444" }
  ];
  const openReview = (row, action) => {
    setReviewing({ row, action });
    setRemarks(row.remarks ?? "");
  };
  const submitReview = () => {
    if (!reviewing) return;
    const { row, action } = reviewing;
    setRows(
      (prev) => prev.map(
        (r) => r.id === row.id ? {
          ...r,
          status: action,
          remarks: remarks.trim() || (action === "Approved" ? "Approved." : "Rejected."),
          reviewedBy: "Hostel Admin",
          reviewedOn: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
        } : r
      )
    );
    toast.success(`${action === "Approved" ? "Approved" : "Rejected"} \u2014 ${row.student}`);
    setReviewing(null);
    setRemarks("");
  };
  const leaveTypes = ["All", "Home Visit", "Medical", "Family Function", "Personal", "Emergency", "Academic"];
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Leave Management"
    description="Review, approve or reject hostel leave requests from residents."
    icon={CalendarDays}
    tint="#F97316"
    breadcrumbs={[{ label: "Leave Management" }]}
  />

      {
    /* Stats */
  }
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
    /* Tabs + filters */
  }
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          {["Pending", "Approved", "Rejected", "All", "History"].map((t) => <button
    key={t}
    onClick={() => setTab(t)}
    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === t ? "bg-[#F97316] text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
  >
              {t}
            </button>)}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
    value={q}
    onChange={(e) => setQ(e.target.value)}
    placeholder="Search student, room, reason…"
    className="h-9 w-64 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
  />
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="h-9 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
  >
                {leaveTypes.map((t) => <option key={t} value={t}>
                    {t === "All" ? "All Types" : t}
                  </option>)}
              </select>
            </div>
          </div>
        </div>

        {
    /* Table */
  }
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
              {filtered.map((r) => <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                        {r.student.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{r.student}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {r.enrollment} · {r.room}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full bg-[#F97316]/10 px-2 py-0.5 text-xs font-medium text-[#F97316]">
                      {r.leaveType}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.from}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.to}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.days}</td>
                  <td className="max-w-[240px] px-4 py-3 text-muted-foreground">
                    <p className="truncate">{r.reason}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-xs text-muted-foreground">
                    <p className="truncate">{r.remarks || "\u2014"}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
    onClick={() => setViewing(r)}
    title="View"
    className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
  >
                        <Eye className="h-4 w-4" />
                      </button>
                      {r.status === "Pending" && <>
                          <button
    onClick={() => openReview(r, "Approved")}
    title="Approve"
    className="grid h-8 w-8 place-items-center rounded-lg text-[#22C55E] hover:bg-[#22C55E]/10"
  >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
    onClick={() => openReview(r, "Rejected")}
    title="Reject"
    className="grid h-8 w-8 place-items-center rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10"
  >
                            <X className="h-4 w-4" />
                          </button>
                        </>}
                    </div>
                  </td>
                </tr>)}
              {filtered.length === 0 && <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No leave requests match the current filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* View dialog */
  }
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          {viewing && <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#F97316]" />
                  Leave Request · {viewing.student}
                </DialogTitle>
                <DialogDescription>
                  Applied on {viewing.appliedOn} · {viewing.days} day(s)
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={User} label="Enrollment" value={viewing.enrollment} />
                <InfoRow icon={User} label="Room" value={`${viewing.hostel} \xB7 ${viewing.room}`} />
                <InfoRow icon={CalendarDays} label="From" value={viewing.from} />
                <InfoRow icon={CalendarDays} label="To" value={viewing.to} />
                <InfoRow icon={FileText} label="Leave Type" value={viewing.leaveType} />
                <InfoRow icon={MapPin} label="Destination" value={viewing.destination} />
                <InfoRow icon={Phone} label="Student Contact" value={viewing.contact} />
                <InfoRow icon={Phone} label="Parent Contact" value={viewing.parentContact} />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Reason</p>
                <p className="mt-1 text-sm text-foreground">{viewing.reason}</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <div className="mt-1"><StatusPill status={viewing.status} /></div>
                </div>
                {viewing.reviewedBy && <div className="text-right">
                    <p className="text-xs text-muted-foreground">Reviewed by</p>
                    <p className="text-sm font-medium text-foreground">{viewing.reviewedBy}</p>
                    <p className="text-xs text-muted-foreground">{viewing.reviewedOn}</p>
                  </div>}
              </div>

              {viewing.remarks && <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs font-medium text-muted-foreground">Remarks</p>
                  <p className="mt-1 text-sm text-foreground">{viewing.remarks}</p>
                </div>}

              <DialogFooter>
                {viewing.status === "Pending" ? <>
                    <Button
    variant="outline"
    onClick={() => {
      const r = viewing;
      setViewing(null);
      openReview(r, "Rejected");
    }}
    className="text-[#EF4444] hover:text-[#EF4444]"
  >
                      <X className="mr-1.5 h-4 w-4" /> Reject
                    </Button>
                    <Button
    onClick={() => {
      const r = viewing;
      setViewing(null);
      openReview(r, "Approved");
    }}
    className="bg-[#22C55E] hover:bg-[#16a34a]"
  >
                      <Check className="mr-1.5 h-4 w-4" /> Approve
                    </Button>
                  </> : <Button variant="outline" onClick={() => setViewing(null)}>Close</Button>}
              </DialogFooter>
            </>}
        </DialogContent>
      </Dialog>

      {
    /* Approve / Reject dialog */
  }
      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent>
          {reviewing && <>
              <DialogHeader>
                <DialogTitle>
                  {reviewing.action === "Approved" ? "Approve" : "Reject"} leave request
                </DialogTitle>
                <DialogDescription>
                  {reviewing.row.student} · {reviewing.row.from} → {reviewing.row.to} ({reviewing.row.days} day
                  {reviewing.row.days === 1 ? "" : "s"})
                </DialogDescription>
              </DialogHeader>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Remarks {reviewing.action === "Rejected" && <span className="text-[#EF4444]">*</span>}
                </label>
                <Textarea
    value={remarks}
    onChange={(e) => setRemarks(e.target.value)}
    rows={4}
    placeholder={reviewing.action === "Approved" ? "Optional notes for the resident\u2026" : "Reason for rejection\u2026"}
  />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setReviewing(null)}>Cancel</Button>
                <Button
    onClick={submitReview}
    disabled={reviewing.action === "Rejected" && !remarks.trim()}
    className={reviewing.action === "Approved" ? "bg-[#22C55E] hover:bg-[#16a34a]" : "bg-[#EF4444] hover:bg-[#dc2626]"}
  >
                  {reviewing.action === "Approved" ? <><Check className="mr-1.5 h-4 w-4" /> Approve</> : <><X className="mr-1.5 h-4 w-4" /> Reject</>}
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
