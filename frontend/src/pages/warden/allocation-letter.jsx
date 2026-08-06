import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  Loader2,
  Check,
  X
} from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { wardenLetterApi } from "@/services/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import jsPDF from "jspdf";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Route = createFileRoute("/warden/allocation-letter")({
  head: () => ({
    meta: [
      { title: "Letter Allocation Management — Warden · CampusOS" },
      {
        name: "description",
        content: "Review student letter requests, verify hostel allocations, approve/reject, and issue official letters."
      }
    ]
  }),
  component: WardenAllocationLetterPage
});

const TINT = "#7B4CED";
const TABS = [
  { id: "all", label: "All Requests" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "generated", label: "Generated" },
  { id: "rejected", label: "Rejected" }
];

export function WardenAllocationLetterPage() {
  const [requests, setRequests] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Rejection modal
  const [rejectingReq, setRejectingReq] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [reqRes, tempRes] = await Promise.all([
        wardenLetterApi.getRequests(),
        wardenLetterApi.getActiveTemplate().catch(() => null)
      ]);
      setRequests(reqRes?.data || []);
      if (tempRes?.data) {
        setActiveTemplate(tempRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load letter requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await wardenLetterApi.approve(id);
      toast.success("Letter request approved! You can now generate the letter.");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectingReq) return;
    if (!rejectionReason.trim()) {
      return toast.error("Please enter a rejection reason");
    }
    setProcessingId(rejectingReq.id);
    try {
      await wardenLetterApi.reject(rejectingReq.id, rejectionReason.trim());
      toast.success("Request rejected successfully");
      setRejectingReq(null);
      setRejectionReason("");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  const handleGeneratePdf = async (reqItem, isRegenerate = false) => {
    setProcessingId(reqItem.id);
    try {
      const genRes = await wardenLetterApi.generateLetter(reqItem.id);
      const letterData = genRes.data;

      generatePdfDocument(reqItem, letterData, activeTemplate);

      toast.success(isRegenerate ? "Letter regenerated successfully!" : "Allocation letter generated!");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate allocation letter");
    } finally {
      setProcessingId(null);
    }
  };

  const generatePdfDocument = (reqItem, letterData, template) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const purpleHex = [123, 76, 237];

    doc.setFillColor(...purpleHex);
    doc.rect(0, 0, pageWidth, 6, "F");

    let currentY = 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("CAMPUS OS — HOSTEL ALLOCATION LETTER", pageWidth / 2, currentY, { align: "center" });

    currentY += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Official Resident Room Allocation Certificate", pageWidth / 2, currentY, { align: "center" });

    currentY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, currentY, pageWidth - 20, currentY);

    currentY += 10;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, currentY, pageWidth - 40, 22, 3, 3, "F");
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(20, currentY, pageWidth - 40, 22, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(123, 76, 237);
    doc.text(`Reference No: ${letterData?.referenceNo || "AL-2026-OFFICIAL"}`, 25, currentY + 8);
    doc.text(`Issue Date: ${new Date(letterData?.issuedDate || Date.now()).toLocaleDateString()}`, pageWidth - 25, currentY + 8, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Status: Official Allocation Certificate`, 25, currentY + 16);
    doc.text(`Signed By: ${letterData?.signedBy || "Warden Office"}`, pageWidth - 25, currentY + 16, { align: "right" });

    currentY += 32;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Resident & Allocation Details", 20, currentY);

    const studentName = reqItem.student?.fullName || reqItem.student?.user?.name || "N/A";
    const studentEmail = reqItem.student?.user?.email || "N/A";
    const collegeId = reqItem.student?.collegeId || "N/A";

    const alloc = reqItem.student?.allocations?.[0];
    const hostelName = reqItem.hostel?.name || alloc?.bed?.room?.floor?.block?.hostel?.name || "Main Campus Hostel";
    const blockName = alloc?.bed?.room?.floor?.block?.name || "Block A";
    const floorNum = alloc?.bed?.room?.floor?.number ? `Floor ${alloc.bed.room.floor.number}` : "Ground Floor";
    const roomNum = alloc?.bed?.room?.number ? `Room ${alloc.bed.room.number}` : "Unassigned";
    const bedNum = alloc?.bed?.number ? `Bed ${alloc.bed.number}` : "Bed 1";

    currentY += 6;
    doc.setFontSize(9);

    const rows = [
      ["Student Name:", studentName, "Hostel Name:", hostelName],
      ["College ID:", collegeId, "Block / Wing:", blockName],
      ["Email Address:", studentEmail, "Floor / Level:", floorNum],
      ["Approval Status:", "Approved & Valid", "Room & Bed:", `${roomNum} (${bedNum})`]
    ];

    rows.forEach((row) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(row[0], 25, currentY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(row[1], 55, currentY);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(row[2], 115, currentY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(row[3], 150, currentY);

      currentY += 7;
    });

    currentY += 8;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, currentY, pageWidth - 40, 45, 3, 3, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("Rules & Regulations Guidelines", 25, currentY + 8);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const terms = [
      "1. Resident must strictly adhere to hostel curfew rules and maintain peace.",
      "2. Unauthorized transfer of room or bed assignment is strictly prohibited.",
      "3. Residents are responsible for keeping their room and common areas clean.",
      "4. This allocation letter is valid for the academic semester and subject to warden review.",
      "5. Possession of prohibited substances or damaging hostel property will cause immediate cancellation."
    ];
    let termY = currentY + 15;
    terms.forEach((t) => {
      doc.text(t, 25, termY);
      termY += 5.5;
    });

    currentY += 60;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);

    doc.line(25, currentY + 15, 75, currentY + 15);
    doc.text("Student Signature", 32, currentY + 20);

    doc.line(pageWidth - 75, currentY + 15, pageWidth - 25, currentY + 15);
    doc.text("Warden Signature & Stamp", pageWidth - 70, currentY + 20);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated via CampusOS Portal on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save(`Allocation_Letter_${studentName.replace(/\s+/g, "_")}_${letterData?.referenceNo || "REF"}.pdf`);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchesStatus =
        filterStatus === "all"
          ? true
          : r.status.toLowerCase() === filterStatus.toLowerCase();

      const name = r.student?.fullName || r.student?.user?.name || "";
      const email = r.student?.user?.email || "";
      const collegeId = r.student?.collegeId || "";

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collegeId.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [requests, filterStatus, searchQuery]);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "Pending").length,
      approved: requests.filter((r) => r.status === "Approved").length,
      generated: requests.filter((r) => r.status === "Generated").length,
      rejected: requests.filter((r) => r.status === "Rejected").length
    }),
    [requests]
  );

  const stats = [
    { label: "Total Requests", value: counts.total, icon: FileText, tint: "#0EA5E9" },
    { label: "Pending Review", value: counts.pending, icon: Clock, tint: "#F97316" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, tint: "#22C55E" },
    { label: "Letters Generated", value: counts.generated, icon: Sparkles, tint: "#A855F7" }
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Letter Allocation Management"
        description="Review student requests, verify hostel allocations, approve/reject, and issue official letters."
        icon={FileText}
        tint={TINT}
        breadcrumbs={[{ label: "Letter Allocation" }]}
      />

      {/* Stats Cards */}
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

      {/* Tabs + Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Tab Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterStatus(t.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                filterStatus === t.id
                  ? "text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              style={filterStatus === t.id ? { backgroundColor: TINT } : undefined}
            >
              {t.label}
              {t.id === "pending" && counts.pending > 0 && (
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or email…"
              className="h-9 w-64 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mb-2 stroke-1 text-muted-foreground/60" />
              <p className="text-sm font-semibold text-foreground">No requests found</p>
              <p className="text-xs text-muted-foreground">There are no letter requests matching your filter criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/40">
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Student Details</th>
                  <th className="px-4 py-3 font-medium">Hostel & Allocation</th>
                  <th className="px-4 py-3 font-medium">Requested On</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRequests.map((r) => {
                  const studentName = r.student?.fullName || r.student?.user?.name || "Student";
                  const studentEmail = r.student?.user?.email || "";
                  const collegeId = r.student?.collegeId || "N/A";
                  const alloc = r.student?.allocations?.[0];
                  const hostelName = r.hostel?.name || alloc?.bed?.room?.floor?.block?.hostel?.name || "Main Hostel";
                  const roomBed = alloc?.bed?.room?.number ? `Room ${alloc.bed.room.number} (${alloc.bed.number})` : "Unassigned";

                  return (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div className="font-semibold text-foreground">{studentName}</div>
                        <div className="text-xs text-muted-foreground">{studentEmail} · {collegeId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-foreground">{hostelName}</div>
                        <div className="text-xs text-muted-foreground">{roomBed}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} reason={r.rejectionReason} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(r.id)}
                                disabled={processingId === r.id}
                                className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                              >
                                <Check className="h-3.5 w-3.5" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setRejectingReq(r);
                                  setRejectionReason("");
                                }}
                                disabled={processingId === r.id}
                                className="h-8 gap-1 font-medium"
                              >
                                <X className="h-3.5 w-3.5" /> Reject
                              </Button>
                            </>
                          )}

                          {r.status === "Approved" && (
                            <Button
                              size="sm"
                              onClick={() => handleGeneratePdf(r)}
                              disabled={processingId === r.id}
                              className="h-8 gap-1.5 bg-[#7B4CED] hover:bg-[#6a3fd1] text-white font-semibold"
                            >
                              <Sparkles className="h-3.5 w-3.5" /> Generate Letter
                            </Button>
                          )}

                          {r.status === "Generated" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleGeneratePdf(r, true)}
                                disabled={processingId === r.id}
                                className="h-8 gap-1 font-medium"
                              >
                                <RefreshCw className="h-3 w-3" /> Regenerate
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleGeneratePdf(r, false)}
                                className="h-8 gap-1 bg-[#7B4CED] hover:bg-[#6a3fd1] text-white font-semibold"
                              >
                                <Download className="h-3 w-3" /> Download PDF
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Reject Reason Dialog */}
      <Dialog open={!!rejectingReq} onOpenChange={(open) => !open && setRejectingReq(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Letter Request</DialogTitle>
            <DialogDescription>
              Specify the reason for rejecting the allocation letter request for{" "}
              <span className="font-semibold text-foreground">
                {rejectingReq?.student?.fullName || rejectingReq?.student?.user?.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingReq(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectSubmit}
              disabled={processingId === rejectingReq?.id}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status, reason }) {
  const s = (status || "").toLowerCase();
  if (s === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    );
  }
  if (s === "generated") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400">
        <Sparkles className="h-3 w-3" /> Letter Issued
      </span>
    );
  }
  if (s === "rejected") {
    return (
      <span
        title={reason ? `Reason: ${reason}` : "Rejected"}
        className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-500 cursor-help"
      >
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-500">
      <Clock className="h-3 w-3" /> Pending Review
    </span>
  );
}

export { Route };
