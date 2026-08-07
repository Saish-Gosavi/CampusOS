import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  UserRoundCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  Clock,
  Check,
  X,
  Loader2,
  Users,
  Filter,
  Plus,
} from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { visitorApi, userApi } from "@/services/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Route = createFileRoute("/warden/visitors")({
  head: () => ({
    meta: [
      { title: "Visitor Management — Warden · CampusOS" },
      {
        name: "description",
        content: "Review and approve visitor requests submitted by students.",
      },
    ],
  }),
  component: VisitorsPage,
});

const TINT = "#210963";
const TABS = ["Pending", "History"];

function VisitorsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Pending");
  const [q, setQ] = useState("");

  // Review dialog state
  const [reviewing, setReviewing] = useState(null); // { row, action: "Approved"|"Rejected" }
  const [wardenRemarks, setWardenRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Detail view
  const [viewing, setViewing] = useState(null);

  // Add Visitor state
  const [addingVisitor, setAddingVisitor] = useState(false);
  const [addForm, setAddForm] = useState({
    studentName: "",
    fullName: "",
    relationship: "",
    visitorPhone: "",
    purpose: "",
    checkIn: "",
  });
  const [adding, setAdding] = useState(false);
  const [studentsList, setStudentsList] = useState([]);

  /* ── Fetch all visitor records ── */
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await visitorApi.getAll();
      const apiData = Array.isArray(res?.data) ? res.data : [];
      setRows(
        apiData.map((item) => ({
          id: item.id,
          visitorName: item.fullName || "Visitor",
          visitorPhone: item.visitorPhone || "N/A",
          visitorIdProof: item.visitorIdProof || "N/A",
          relation: item.relationship || "Guardian",
          student: item.studentName || "Student",
          purpose: item.purpose || "General visit",
          status: item.status || "Pending",
          wardenRemarks: item.wardenRemarks || "",
          reviewedBy: item.reviewedBy || null,
          visitDate: item.checkIn
            ? new Date(item.checkIn).toLocaleDateString()
            : new Date().toLocaleDateString(),
          entryTime: item.checkIn
            ? new Date(item.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "N/A",
          exitTime: item.checkOut
            ? new Date(item.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "N/A",
          requestedOn: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
        }))
      );
    } catch {
      toast.error("Failed to load visitor requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const fetchStudents = async () => {
      try {
        const res = await userApi.getStudents();
        setStudentsList(res.data || []);
      } catch (error) {
        console.error("Failed to load students list", error);
      }
    };
    fetchStudents();
  }, [loadData]);

  /* ── Filtered rows ── */
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (tab === "Pending" && r.status !== "Pending") return false;
      if (tab === "History" && r.status === "Pending") return false;
      if (q) {
        const s = q.toLowerCase();
        if (
          !r.visitorName.toLowerCase().includes(s) &&
          !r.student.toLowerCase().includes(s) &&
          !r.visitorPhone.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [rows, tab, q]);

  /* ── Counts ── */
  const counts = useMemo(
    () => ({
      pending: rows.filter((r) => r.status === "Pending").length,
      approved: rows.filter((r) => r.status === "Approved" || r.status === "Checked-In").length,
      rejected: rows.filter((r) => r.status === "Rejected").length,
      total: rows.length,
    }),
    [rows]
  );

  const stats = [
    { label: "Total Requests", value: counts.total, icon: Users, tint: "#0EA5E9" },
    { label: "Pending Review", value: counts.pending, icon: Clock, tint: "#F97316" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, tint: "#22C55E" },
    { label: "Rejected", value: counts.rejected, icon: XCircle, tint: "#EF4444" },
  ];

  /* ── Open review dialog ── */
  const openReview = (row, action) => {
    setReviewing({ row, action });
    setWardenRemarks("");
  };

  /* ── Submit warden decision ── */
  const submitReview = async () => {
    if (!reviewing || submitting) return;
    const { row, action } = reviewing;

    if (action === "Rejected" && !wardenRemarks.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setSubmitting(true);
    try {
      await visitorApi.wardenReview(row.id, {
        status: action,
        wardenRemarks: wardenRemarks.trim() || null,
        reviewedBy: "Warden",
      });

      // Optimistic update
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id
            ? {
                ...r,
                status: action,
                wardenRemarks: wardenRemarks.trim(),
                reviewedBy: "Warden",
              }
            : r
        )
      );

      toast.success(
        action === "Approved"
          ? `✅ Approved — ${row.visitorName}`
          : `❌ Rejected — ${row.visitorName}`
      );
      setReviewing(null);
      setWardenRemarks("");
    } catch {
      toast.error("Failed to submit decision. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Submit new visitor ── */
  const submitAddVisitor = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await visitorApi.create({
        studentName: addForm.studentName,
        fullName: addForm.fullName,
        relationship: addForm.relationship,
        visitorPhone: addForm.visitorPhone || null,
        purpose: addForm.purpose || null,
        checkIn: addForm.checkIn || null,
      });
      toast.success("Visitor added successfully!");
      setAddingVisitor(false);
      setAddForm({
        studentName: "",
        fullName: "",
        relationship: "",
        visitorPhone: "",
        purpose: "",
        checkIn: "",
      });
      loadData(); // Reload to fetch full mapped item
    } catch (error) {
      toast.error("Failed to add visitor. Check inputs.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Visitor Management"
        description="Review pending visitor requests and approve or reject them on behalf of students."
        icon={UserRoundCheck}
        tint={TINT}
        breadcrumbs={[{ label: "Visitor Management" }]}
        action={
          <Button onClick={() => setAddingVisitor(true)} style={{ backgroundColor: TINT, color: "white" }}>
            <Plus className="mr-2 h-4 w-4" /> Add Visitor
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
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
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Tab bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                tab === t
                  ? "text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={tab === t ? { backgroundColor: TINT } : undefined}
            >
              {t}
              {t === "Pending" && counts.pending > 0 && (
                <span
                  className="ml-1.5 rounded-full px-1.5 py-0.5 text-xs font-bold"
                  style={{ backgroundColor: "#F97316", color: "#fff" }}
                >
                  {counts.pending}
                </span>
              )}
            </button>
          ))}

          {/* Search */}
          <div className="relative ml-auto">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search visitor or student…"
              className="h-9 w-64 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40">
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Visitor</th>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Relation</th>
                  <th className="px-4 py-3 font-medium">Visit Date</th>
                  <th className="px-4 py-3 font-medium">Purpose</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  {tab === "History" && (
                    <th className="px-4 py-3 font-medium">Reviewed By</th>
                  )}
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30">
                    {/* Visitor */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
                          style={{
                            background: `linear-gradient(135deg, ${TINT}, #7B4CED)`,
                          }}
                        >
                          {r.visitorName
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{r.visitorName}</p>
                          <p className="truncate text-xs text-muted-foreground">{r.visitorPhone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{r.student}</p>
                    </td>

                    {/* Relation */}
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: `${TINT}1A`, color: TINT }}
                      >
                        {r.relation}
                      </span>
                    </td>

                    {/* Visit Date */}
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.visitDate}</td>

                    {/* Purpose */}
                    <td className="max-w-[160px] truncate px-4 py-3 text-muted-foreground" title={r.purpose}>
                      {r.purpose}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>

                    {/* Reviewed By (History only) */}
                    {tab === "History" && (
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                        {r.reviewedBy || "—"}
                      </td>
                    )}

                    {/* Actions */}
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewing(r)}
                          title="View Details"
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {r.status === "Pending" && (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={tab === "History" ? 8 : 7}
                      className="px-4 py-12 text-center text-sm text-muted-foreground"
                    >
                      {tab === "Pending"
                        ? "No pending visitor requests. All caught up! 🎉"
                        : "No historical records found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── View Details Dialog ── */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserRoundCheck className="h-5 w-5" style={{ color: TINT }} />
                  {viewing.visitorName}
                </DialogTitle>
                <DialogDescription>
                  Visiting {viewing.student} · Requested on {viewing.requestedOn}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoRow label="Phone" value={viewing.visitorPhone} />
                <InfoRow label="ID Proof" value={viewing.visitorIdProof} />
                <InfoRow label="Relation" value={viewing.relation} />
                <InfoRow label="Visit Date" value={viewing.visitDate} />
                <InfoRow label="Entry" value={viewing.entryTime} />
                <InfoRow label="Exit" value={viewing.exitTime} />
                <div className="col-span-2">
                  <InfoRow label="Purpose" value={viewing.purpose} />
                </div>
                <div className="col-span-2 flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <div className="mt-1">
                      <StatusPill status={viewing.status} />
                    </div>
                  </div>
                  {viewing.reviewedBy && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Reviewed by</p>
                      <p className="text-sm font-medium text-foreground">{viewing.reviewedBy}</p>
                    </div>
                  )}
                </div>
                {viewing.wardenRemarks && (
                  <div className="col-span-2 rounded-lg border border-border bg-muted/30 p-3">
                    <p className="text-xs text-muted-foreground">Warden Remarks</p>
                    <p className="mt-1 text-sm text-foreground">{viewing.wardenRemarks}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                {viewing.status === "Pending" ? (
                  <>
                    <Button
                      variant="outline"
                      className="text-[#EF4444] hover:text-[#EF4444]"
                      onClick={() => {
                        const r = viewing;
                        setViewing(null);
                        openReview(r, "Rejected");
                      }}
                    >
                      <X className="mr-1.5 h-4 w-4" /> Reject
                    </Button>
                    <Button
                      className="bg-[#22C55E] hover:bg-[#16a34a] text-white"
                      onClick={() => {
                        const r = viewing;
                        setViewing(null);
                        openReview(r, "Approved");
                      }}
                    >
                      <Check className="mr-1.5 h-4 w-4" /> Approve
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setViewing(null)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Approve / Reject Confirmation Dialog ── */}
      <Dialog open={!!reviewing} onOpenChange={(o) => !o && setReviewing(null)}>
        <DialogContent>
          {reviewing && (
            <>
              <DialogHeader>
                <DialogTitle
                  className={reviewing.action === "Approved" ? "text-[#22C55E]" : "text-[#EF4444]"}
                >
                  {reviewing.action === "Approved" ? "✅ Approve" : "❌ Reject"} visitor request
                </DialogTitle>
                <DialogDescription>
                  <span className="font-medium">{reviewing.row.visitorName}</span> visiting{" "}
                  <span className="font-medium">{reviewing.row.student}</span> on{" "}
                  {reviewing.row.visitDate}
                </DialogDescription>
              </DialogHeader>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                  Warden Remarks{" "}
                  {reviewing.action === "Rejected" && (
                    <span className="text-[#EF4444]">* (required for rejection)</span>
                  )}
                </label>
                <Textarea
                  value={wardenRemarks}
                  onChange={(e) => setWardenRemarks(e.target.value)}
                  rows={3}
                  placeholder={
                    reviewing.action === "Approved"
                      ? "Optional notes for the Hostel Admin…"
                      : "Reason for rejecting this request…"
                  }
                />
              </div>

              <DialogFooter>
                <div className="flex gap-2">
                <Button variant="outline" onClick={() => setReviewing(null)} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  onClick={submitReview}
                  disabled={submitting}
                  style={
                    reviewing.action === "Approved"
                      ? { backgroundColor: "#22C55E", color: "white" }
                      : { backgroundColor: "#EF4444", color: "white" }
                  }
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : reviewing.action === "Approved" ? (
                    "Confirm Approval"
                  ) : (
                    "Confirm Rejection"
                  )}
                </Button>
              </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add Visitor Dialog ── */}
      <Dialog open={addingVisitor} onOpenChange={setAddingVisitor}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add Walk-in Visitor</DialogTitle>
            <DialogDescription>Manually log a new visitor request for a student.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submitAddVisitor}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visitor Full Name <span className="text-red-500">*</span></label>
                  <Input 
                    required 
                    placeholder="E.g. John Doe"
                    value={addForm.fullName} 
                    onChange={e => setAddForm({...addForm, fullName: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Student Name <span className="text-red-500">*</span></label>
                  <Input 
                    list="students-list"
                    placeholder="Search or enter student name..."
                    value={addForm.studentName}
                    onChange={(e) => setAddForm({ ...addForm, studentName: e.target.value })}
                    required
                  />
                  <datalist id="students-list">
                    {studentsList.map((st) => (
                      <option key={st.id} value={st.profile?.name || st.name || st.email} />
                    ))}
                  </datalist>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Relationship <span className="text-red-500">*</span></label>
                  <Input 
                    required 
                    placeholder="E.g. Father, Mother"
                    value={addForm.relationship} 
                    onChange={e => setAddForm({...addForm, relationship: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visitor Phone</label>
                  <Input 
                    placeholder="Optional"
                    value={addForm.visitorPhone} 
                    onChange={e => setAddForm({...addForm, visitorPhone: e.target.value})} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expected Check-in Date</label>
                <Input 
                  type="date"
                  value={addForm.checkIn} 
                  onChange={e => setAddForm({...addForm, checkIn: e.target.value})} 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Purpose of Visit</label>
                <Textarea 
                  placeholder="Optional details about the visit..."
                  value={addForm.purpose} 
                  onChange={e => setAddForm({...addForm, purpose: e.target.value})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setAddingVisitor(false)} disabled={adding}>
                Cancel
              </Button>
              <Button type="submit" disabled={adding} style={{ backgroundColor: TINT, color: "white" }}>
                {adding ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Visitor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

export { Route };
