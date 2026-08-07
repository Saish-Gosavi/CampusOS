import { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { CalendarDays, CheckCircle2, XCircle, Eye, Search, Loader2, RefreshCw } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { leaveApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/warden/leaves")({
  component: LeavesPage
});

const TINT = "#F97316";
const tabs = ["Pending", "Approved", "Rejected", "History"];

function LeavesPage() {
  const [tab, setTab] = useState("Pending");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      const statusParam = tab === "History" ? "all" : tab.toLowerCase();
      const [leavesRes, statsRes] = await Promise.all([
        leaveApi.getAll({ status: statusParam, search: q }),
        leaveApi.getStats()
      ]);

      const items = leavesRes?.data?.items || leavesRes?.items || leavesRes?.data || [];
      setLeaves(Array.isArray(items) ? items : []);

      const s = statsRes?.data || statsRes || {};
      setStats({
        pending: s.pending || 0,
        approved: s.approved || 0,
        rejected: s.rejected || 0,
        total: s.total || 0
      });
    } catch (err) {
      console.error("Failed to load leaves:", err);
      toast.error(err?.message || "Failed to load leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [tab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLeaveData();
  };

  const counts = {
    Pending: stats.pending,
    Approved: stats.approved,
    Rejected: stats.rejected,
    History: stats.total
  };

  const handleDecide = async (statusAction) => {
    if (!selected) return;
    if (statusAction === "rejected" && !remarks.trim()) {
      return toast.error("Please add remarks for rejecting the leave request");
    }

    setSubmitting(true);
    try {
      await leaveApi.updateStatus(selected.id, {
        status: statusAction,
        remarks: remarks.trim()
      });
      toast.success(`Leave request ${statusAction} successfully`);
      setSelected(null);
      setRemarks("");
      fetchLeaveData();
    } catch (err) {
      toast.error(err?.message || `Failed to update leave status`);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateDays = (start, end) => {
    if (!start || !end) return "1";
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diff = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `${diff}` : "1";
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-2 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <WardenPageHeader
          title="Leave Requests"
          description="Approve, reject and review leave applications from your residents."
          icon={CalendarDays}
          tint={TINT}
          breadcrumbs={[{ label: "Leave Requests" }]}
        />
        <button
          onClick={fetchLeaveData}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors",
              tab === t ? "text-white shadow-sm font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            style={tab === t ? { backgroundColor: TINT } : undefined}
          >
            {t}
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-bold">{counts[t]}</span>
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search student, enrollment, reason..."
            className="h-10 pl-9 pr-4 text-xs"
          />
        </form>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-xs text-muted-foreground">Loading leave applications...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-left uppercase tracking-wide text-muted-foreground bg-muted/40 border-b border-border">
                <tr>
                  <th className="p-3 font-semibold">Student</th>
                  <th className="p-3 font-semibold">Room</th>
                  <th className="p-3 font-semibold">Leave Type</th>
                  <th className="p-3 font-semibold">From</th>
                  <th className="p-3 font-semibold">To</th>
                  <th className="p-3 font-semibold">Days</th>
                  <th className="p-3 font-semibold">Reason</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaves.map((l) => {
                  const studentName = l.student?.fullName || l.studentName || "Student";
                  const collegeId = l.student?.collegeId || l.studentId || "N/A";
                  const roomNo = l.student?.allocations?.[0]?.bed?.room?.number || l.room || "N/A";
                  const fromDate = l.startDate ? new Date(l.startDate).toLocaleDateString() : l.from || "N/A";
                  const toDate = l.endDate ? new Date(l.endDate).toLocaleDateString() : l.to || "N/A";
                  const statusFormatted = l.status ? l.status.charAt(0).toUpperCase() + l.status.slice(1) : "Pending";

                  return (
                    <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <p className="font-semibold text-foreground">{studentName}</p>
                        <p className="text-[11px] text-muted-foreground">{collegeId}</p>
                      </td>
                      <td className="p-3 font-medium text-foreground">{roomNo}</td>
                      <td className="p-3 font-medium text-foreground">{l.leaveType || "Personal"}</td>
                      <td className="p-3 text-muted-foreground">{fromDate}</td>
                      <td className="p-3 text-muted-foreground">{toDate}</td>
                      <td className="p-3 font-medium">{calculateDays(l.startDate, l.endDate)} Days</td>
                      <td className="p-3 max-w-xs truncate text-muted-foreground" title={l.reason}>
                        {l.reason || "N/A"}
                      </td>
                      <td className="p-3">
                        <StatusPill status={statusFormatted} />
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setSelected(l);
                              setRemarks(l.remarks || "");
                            }}
                            title="View details"
                            className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {l.status?.toLowerCase() === "pending" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelected(l);
                                  setRemarks("");
                                }}
                                title="Approve / Decision"
                                className="grid h-7 w-7 place-items-center rounded-md bg-[#22C55E]/10 text-[#16A34A] hover:bg-[#22C55E]/20"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelected(l);
                                  setRemarks("");
                                }}
                                title="Reject"
                                className="grid h-7 w-7 place-items-center rounded-md bg-[#EF4444]/10 text-[#DC2626] hover:bg-[#EF4444]/20"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {leaves.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-muted-foreground">
                      No leave requests found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Decision / Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div>
              <h3 className="text-lg font-bold text-foreground">{selected.student?.fullName || selected.studentName || "Student"}</h3>
              <p className="text-xs text-muted-foreground">
                ID: {selected.student?.collegeId || selected.studentId} · Room: {selected.student?.allocations?.[0]?.bed?.room?.number || "N/A"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-y border-border py-3">
              <div><p className="text-muted-foreground">Leave Type</p><p className="font-semibold">{selected.leaveType || "Personal"}</p></div>
              <div><p className="text-muted-foreground">Total Days</p><p className="font-semibold">{calculateDays(selected.startDate, selected.endDate)} Days</p></div>
              <div><p className="text-muted-foreground">From Date</p><p className="font-semibold">{selected.startDate ? new Date(selected.startDate).toLocaleDateString() : "N/A"}</p></div>
              <div><p className="text-muted-foreground">To Date</p><p className="font-semibold">{selected.endDate ? new Date(selected.endDate).toLocaleDateString() : "N/A"}</p></div>
              <div className="col-span-2"><p className="text-muted-foreground">Destination Address</p><p className="font-semibold">{selected.destination || "Not specified"}</p></div>
              <div className="col-span-2"><p className="text-muted-foreground">Reason</p><p className="text-foreground bg-muted/40 p-2 rounded border border-border">{selected.reason}</p></div>
              <div><p className="text-muted-foreground">Student Contact</p><p className="font-semibold">{selected.contactPhone || selected.student?.phone || "N/A"}</p></div>
              <div><p className="text-muted-foreground">Parent Contact</p><p className="font-semibold">{selected.parentContact || "N/A"}</p></div>
            </div>

            {selected.remarks && selected.status !== "pending" && (
              <div className="rounded border border-border bg-muted/30 p-2.5 text-xs">
                <p className="font-semibold text-muted-foreground">Warden Remarks ({selected.reviewedBy || "Warden"})</p>
                <p className="text-foreground mt-0.5">{selected.remarks}</p>
              </div>
            )}

            {selected.status?.toLowerCase() === "pending" && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Warden Decision Remarks</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background p-2.5 text-xs outline-none focus:border-primary"
                  placeholder="Add approval or rejection remarks..."
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>Close</Button>
              {selected.status?.toLowerCase() === "pending" && (
                <>
                  <Button
                    disabled={submitting}
                    variant="outline"
                    size="sm"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={() => handleDecide("rejected")}
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button
                    disabled={submitting}
                    size="sm"
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => handleDecide("approved")}
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
