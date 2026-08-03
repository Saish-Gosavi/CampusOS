import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  UserRoundCheck,
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
  IdCard,
  CalendarDays,
  LogIn,
  LogOut,
  Plus,
  Download
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
import {
  visitorRequests as seed
} from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/hostel-admin/visitors")({
  head: () => ({
    meta: [
      { title: "Visitor Management \u2014 Hostel Admin \xB7 CampusOS" },
      {
        name: "description",
        content: "Manage hostel visitor requests, approvals, on-campus check-in / check-out and full visitor history."
      }
    ]
  }),
  component: VisitorsPage
});
const TINT = "#0EA5E9";
function VisitorsPage() {
  const [rows, setRows] = useState(seed);
  const [tab, setTab] = useState("Requests");
  const [q, setQ] = useState("");
  const [relation, setRelation] = useState("All");
  const [viewing, setViewing] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [remarks, setRemarks] = useState("");
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (tab === "Requests" && r.status !== "Pending") return false;
      if (tab === "Approval" && !(r.status === "Approved" || r.status === "Checked-In"))
        return false;
      if (tab === "History" && !(r.status === "Checked-Out" || r.status === "Rejected" || r.status === "Expired"))
        return false;
      if (relation !== "All" && r.relation !== relation) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!r.visitorName.toLowerCase().includes(s) && !r.student.toLowerCase().includes(s) && !r.enrollment.toLowerCase().includes(s) && !r.room.toLowerCase().includes(s) && !r.visitorPhone.toLowerCase().includes(s))
          return false;
      }
      return true;
    });
  }, [rows, tab, relation, q]);
  const counts = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((r) => r.status === "Pending").length,
      approved: rows.filter(
        (r) => r.status === "Approved" || r.status === "Checked-In"
      ).length,
      onCampus: rows.filter((r) => r.status === "Checked-In").length,
      rejected: rows.filter((r) => r.status === "Rejected").length
    }),
    [rows]
  );
  const stats = [
    { label: "Total Visitors", value: counts.total, icon: UserRoundCheck, tint: "#0EA5E9" },
    { label: "Pending", value: counts.pending, icon: Clock, tint: "#EAB308" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, tint: "#22C55E" },
    { label: "On Campus", value: counts.onCampus, icon: LogIn, tint: "#7B4CED" },
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
          remarks: remarks.trim() || (action === "Approved" ? "Approved \u2014 visitor allowed on campus." : "Rejected."),
          reviewedBy: "Hostel Admin",
          reviewedOn: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
        } : r
      )
    );
    toast.success(
      `${action === "Approved" ? "Approved" : "Rejected"} \u2014 ${row.visitorName}`
    );
    setReviewing(null);
    setRemarks("");
  };
  const setStatus = (row, status, msg) => {
    setRows(
      (prev) => prev.map((r) => r.id === row.id ? { ...r, status } : r)
    );
    toast.success(msg);
  };
  const relations = ["All", "Father", "Mother", "Sibling", "Guardian", "Relative", "Friend", "Other"];
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Visitor Management"
    description="Approve visitor requests, track on-campus visitors and review historical entries."
    icon={UserRoundCheck}
    tint={TINT}
    breadcrumbs={[{ label: "Visitor Management" }]}
  />

      {
    /* Stats */
  }
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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
          {["Requests", "Approval", "History"].map((t) => <button
    key={t}
    onClick={() => setTab(t)}
    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${tab === t ? "text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
    style={tab === t ? { backgroundColor: TINT } : void 0}
  >
              {t === "Requests" ? "Visitor Requests" : t === "Approval" ? "Visitor Approval" : "Visitor History"}
            </button>)}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
    value={q}
    onChange={(e) => setQ(e.target.value)}
    placeholder="Search visitor, student, room…"
    className="h-9 w-64 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
  />
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
    value={relation}
    onChange={(e) => setRelation(e.target.value)}
    className="h-9 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
  >
                {relations.map((t) => <option key={t} value={t}>
                    {t === "All" ? "All Relations" : t}
                  </option>)}
              </select>
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="h-9" style={{ backgroundColor: TINT }}>
              <Plus className="mr-1.5 h-4 w-4" /> New Request
            </Button>
          </div>
        </div>

        {
    /* Table */
  }
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Visitor</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Relation</th>
                <th className="px-4 py-3 font-medium">Visit Date</th>
                <th className="px-4 py-3 font-medium">Entry</th>
                <th className="px-4 py-3 font-medium">Exit</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
    style={{ background: `linear-gradient(135deg, ${TINT}, #7B4CED)` }}
  >
                        {r.visitorName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{r.visitorName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {r.visitorPhone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground">{r.student}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.enrollment} · {r.room}
                      </p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
    className="rounded-full px-2 py-0.5 text-xs font-medium"
    style={{ backgroundColor: `${TINT}1A`, color: TINT }}
  >
                      {r.relation}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.visitDate}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.entryTime}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.exitTime}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusPill status={r.status} />
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
                      {r.status === "Approved" && <button
    onClick={() => setStatus(r, "Checked-In", `${r.visitorName} checked in`)}
    title="Check-In"
    className="grid h-8 w-8 place-items-center rounded-lg text-[#1D4ED8] hover:bg-primary/80/10"
  >
                          <LogIn className="h-4 w-4" />
                        </button>}
                      {r.status === "Checked-In" && <button
    onClick={() => setStatus(r, "Checked-Out", `${r.visitorName} checked out`)}
    title="Check-Out"
    className="grid h-8 w-8 place-items-center rounded-lg text-[#4B5563] hover:bg-muted"
  >
                          <LogOut className="h-4 w-4" />
                        </button>}
                    </div>
                  </td>
                </tr>)}
              {filtered.length === 0 && <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No visitor entries match the current filters.
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
                  <UserRoundCheck className="h-5 w-5" style={{ color: TINT }} />
                  Visitor Request · {viewing.visitorName}
                </DialogTitle>
                <DialogDescription>
                  Requested on {viewing.requestedOn} · Visit {viewing.visitDate}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={User} label="Visitor" value={viewing.visitorName} />
                <InfoRow icon={Phone} label="Visitor Phone" value={viewing.visitorPhone} />
                <InfoRow icon={IdCard} label="ID Proof" value={viewing.visitorIdProof} />
                <InfoRow icon={User} label="Relation" value={viewing.relation} />
                <InfoRow icon={User} label="Student" value={`${viewing.student} \xB7 ${viewing.enrollment}`} />
                <InfoRow icon={User} label="Room" value={`${viewing.hostel} \xB7 ${viewing.room}`} />
                <InfoRow icon={CalendarDays} label="Visit Date" value={viewing.visitDate} />
                <InfoRow
    icon={Clock}
    label="Slot"
    value={`${viewing.entryTime} \u2192 ${viewing.exitTime}`}
  />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Purpose of Visit</p>
                <p className="mt-1 text-sm text-foreground">{viewing.purpose}</p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusPill status={viewing.status} />
                  </div>
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
                  </> : <Button variant="outline" onClick={() => setViewing(null)}>
                    Close
                  </Button>}
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
                  {reviewing.action === "Approved" ? "Approve" : "Reject"} visitor request
                </DialogTitle>
                <DialogDescription>
                  {reviewing.row.visitorName} → {reviewing.row.student} · {reviewing.row.visitDate}{" "}
                  ({reviewing.row.entryTime}–{reviewing.row.exitTime})
                </DialogDescription>
              </DialogHeader>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Remarks{" "}
                  {reviewing.action === "Rejected" && <span className="text-[#EF4444]">*</span>}
                </label>
                <Textarea
    value={remarks}
    onChange={(e) => setRemarks(e.target.value)}
    rows={4}
    placeholder={reviewing.action === "Approved" ? "Optional notes for gate security\u2026" : "Reason for rejection\u2026"}
  />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setReviewing(null)}>
                  Cancel
                </Button>
                <Button
    onClick={submitReview}
    disabled={reviewing.action === "Rejected" && !remarks.trim()}
    className={reviewing.action === "Approved" ? "bg-[#22C55E] hover:bg-[#16a34a]" : "bg-[#EF4444] hover:bg-[#dc2626]"}
  >
                  {reviewing.action === "Approved" ? <>
                      <Check className="mr-1.5 h-4 w-4" /> Approve
                    </> : <>
                      <X className="mr-1.5 h-4 w-4" /> Reject
                    </>}
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
  return <div className="flex items-start gap-2.5 rounded-lg border border-border p-3">
      <span
    className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
    style={{ backgroundColor: `${TINT}1A`, color: TINT }}
  >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>;
}
export {
  Route
};
