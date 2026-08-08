// complaints.jsx - Resolved version
import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { MessageSquareWarning, Eye, CheckCircle2, Search, Clock, X, Check } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { StatCard } from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useComplaints,
  useApproveComplaint,
  useRejectComplaint,
  useMarkInProgress,
  useResolveComplaint,
  useCloseComplaint,
} from "@/services/queries/complaintHooks";

const Route = createFileRoute("/warden/complaints")({
  component: ComplaintsPage,
});

const TINT = "#EF4444";

function ComplaintsPage() {
  const { data: apiComplaints } = useComplaints();
  const approveMutation = useApproveComplaint();
  const rejectMutation = useRejectComplaint();
  const inProgressMutation = useMarkInProgress();
  const resolveMutation = useResolveComplaint();
  const closeMutation = useCloseComplaint();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [selected, setSelected] = useState(null);
  const [resolution, setResolution] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const rows = useMemo(() => {
    if (apiComplaints && Array.isArray(apiComplaints)) {
      return apiComplaints.map((c) => {
        const statusMap = {
          open: "Open",
          approved: "Approved",
          "in-progress": "In Progress",
          in_progress: "In Progress",
          resolved: "Resolved",
          closed: "Closed",
          rejected: "Rejected",
        };
        const statusCap = statusMap[c.status?.toLowerCase()] || (c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : "Open");
        return {
          id: c.id,
          code: `CMP-${c.id.toString().padStart(4, "0")}`,
          title: c.title,
          description: c.description,
          category: c.category || "Other",
          status: statusCap,
          priority: c.priority?.toLowerCase() || "medium",
          raisedBy: c.student?.user?.name || "Student",
          room: c.student?.allocations?.[0]?.bed?.room?.name || "Room",
          hostel: c.student?.allocations?.[0]?.bed?.room?.floor?.block?.hostel?.name || "Hostel",
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
          resolution: c.resolution || null,
          rejectionReason: c.rejectionReason || null,
          updates: c.updates || [],
        };
      });
    }
    return [];
  }, [apiComplaints]);

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      if (status !== "All" && c.status !== status) return false;
      if (priority !== "All" && c.priority !== priority) return false;
      if (q) {
        const t = q.toLowerCase();
        return (
          c.code.toLowerCase().includes(t) ||
          c.title.toLowerCase().includes(t) ||
          c.raisedBy.toLowerCase().includes(t)
        );
      }
      return true;
    });
  }, [rows, q, status, priority]);

  const openCount = rows.filter((c) => c.status.toLowerCase() === "open").length;
  const inProgressCount = rows.filter((c) => ["in progress", "in_progress", "approved"].includes(c.status.toLowerCase())).length;
  const resolvedCount = rows.filter((c) => c.status.toLowerCase() === "resolved").length;
  const highCount = rows.filter((c) => c.priority.toLowerCase() === "high").length;

  const handleResolve = async () => {
    if (!selected) return;
    try {
      await resolveMutation.mutateAsync({ id: selected.id, resolution });
      toast.success("Complaint resolved");
      setSelected(null);
    } catch (e) {
      toast.error(e?.message || "Failed to resolve");
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Complaint Management"
        description="Track, assign and resolve complaints raised by residents."
        icon={MessageSquareWarning}
        tint={TINT}
        breadcrumbs={[{ label: "Complaints" }]}
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Open" value={String(openCount)} delta="Needs assignment" trend="down" icon={MessageSquareWarning} tint="#EF4444" />
        <StatCard label="In Progress" value={String(inProgressCount)} delta="Under work" trend="up" icon={Clock} tint="#3B82F6" />
        <StatCard label="Resolved" value={String(resolvedCount)} delta="Completed" trend="up" icon={CheckCircle2} tint="#22C55E" />
        <StatCard label="High Priority" value={String(highCount)} delta="Escalated" trend="down" icon={MessageSquareWarning} tint="#F97316" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by code, title or student..." className="h-10 pl-9" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
          {["All", "Open", "Approved", "In Progress", "Resolved", "Closed", "Rejected"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
          {["All", "Low", "Medium", "High"].map((p) => (
            <option key={p}>{p}</option>
          ))}
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
              <th className="py-3 pr-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                <td className="py-3 pr-2 font-mono text-xs">{c.code}</td>
                <td className="py-3 pr-2">
                  <p className="font-medium text-foreground">{c.raisedBy}</p>
                  <p className="text-xs text-muted-foreground">{c.room}</p>
                </td>
                <td className="py-3 pr-2 max-w-xs truncate" title={c.title}>{c.title}</td>
                <td className="py-3 pr-2">{c.category}</td>
                <td className="py-3 pr-2"><StatusPill status={c.priority} /></td>
                <td className="py-3 pr-2"><StatusPill status={c.status} /></td>
                <td className="py-3 pr-2 text-right">
                  <button onClick={() => setSelected(c)} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-sm text-muted-foreground">No complaints found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{selected.code}</p>
                <h3 className="text-lg font-semibold text-foreground">{selected.title}</h3>
                <p className="text-xs text-muted-foreground">{selected.raisedBy} · {selected.room}</p>
              </div>
              <div className="flex gap-2">
                <StatusPill status={selected.priority} />
                <StatusPill status={selected.status} />
              </div>
            </div>
            <p className="mt-3 rounded-lg border border-border bg-muted/40 p-3 text-sm leading-relaxed">{selected.description}</p>
            {selected.status === "Rejected" && selected.rejectionReason && (
              <div className="mt-3 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/5 p-3">
                <p className="text-xs font-semibold text-[#EF4444] uppercase tracking-wider">Rejection Reason</p>
                <p className="mt-1 text-sm text-foreground">{selected.rejectionReason}</p>
              </div>
            )}
            {selected.resolution && (
              <div className="mt-3 rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/5 p-3">
                <p className="text-xs font-semibold text-[#16A34A] uppercase tracking-wider">Resolution</p>
                <p className="mt-1 text-sm text-foreground">{selected.resolution}</p>
              </div>
            )}
            <div className="mt-4 flex flex-col gap-3">
              {selected.status === "Open" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Rejection Reason (optional if approving)</label>
                  <Input value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Required if rejecting..." className="h-10" />
                </div>
              )}
              {selected.status === "In Progress" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Resolution Note</label>
                  <Textarea value={resolution} onChange={(e) => setResolution(e.target.value)} placeholder="How was this resolved?" className="min-h-[80px]" />
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
              <Button variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              {selected.status === "Open" && (
                <>
                  <Button variant="outline" className="text-[#EF4444] hover:bg-[#EF4444]/10 hover:text-[#EF4444]" onClick={async () => {
                    if (!rejectionReason.trim()) { toast.error("Rejection reason is required"); return; }
                    try {
                      await rejectMutation.mutateAsync({ id: selected.id, rejectionReason });
                      toast.success("Complaint rejected");
                      setSelected(null);
                    } catch { toast.error("Failed to reject"); }
                  }}>
                    <X className="mr-1.5 h-4 w-4" /> Reject
                  </Button>
                  <Button className="bg-[#2563EB] text-white hover:bg-[#1D4ED8]" onClick={async () => {
                    try {
                      await approveMutation.mutateAsync(selected.id);
                      toast.success("Complaint approved");
                      setSelected(null);
                    } catch { toast.error("Failed to approve"); }
                  }}>
                    <Check className="mr-1.5 h-4 w-4" /> Approve
                  </Button>
                </>
              )}
              {selected.status === "Approved" && (
                <Button className="bg-[#F59E0B] text-white hover:bg-[#D97706]" onClick={async () => {
                  try {
                    await inProgressMutation.mutateAsync(selected.id);
                    toast.success("Marked In Progress");
                    setSelected(null);
                  } catch { toast.error("Failed to update"); }
                }}>
                  <Clock className="mr-1.5 h-4 w-4" /> Mark In Progress
                </Button>
              )}
              {selected.status === "In Progress" && (
                <Button className="bg-[#22C55E] text-white hover:bg-[#16A34A]" onClick={handleResolve}>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Resolve
                </Button>
              )}
              {selected.status === "Resolved" && (
                <Button variant="outline" onClick={async () => {
                  try {
                    await closeMutation.mutateAsync(selected.id);
                    toast.success("Complaint closed");
                    setSelected(null);
                  } catch { toast.error("Failed to close"); }
                }}>
                  <Check className="mr-1.5 h-4 w-4" /> Close
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
