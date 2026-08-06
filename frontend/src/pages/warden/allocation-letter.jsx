import React, { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  Building,
  User,
  BedDouble,
  ShieldCheck,
  Printer,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { wardenLetterApi } from "@/services/api";
import jsPDF from "jspdf";

const Route = createFileRoute("/warden/allocation-letter")({
  component: WardenAllocationLetterPage
});

export function WardenAllocationLetterPage() {
  const [requests, setRequests] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectingReq, setRejectingReq] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, tempRes] = await Promise.all([
        wardenLetterApi.getRequests(),
        wardenLetterApi.getActiveTemplate().catch(() => null)
      ]);
      setRequests(reqRes.data || []);
      if (tempRes?.data) {
        setActiveTemplate(tempRes.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load letter requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
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
      // 1. Call API to generate & record in backend DB
      const genRes = await wardenLetterApi.generateLetter(reqItem.id);
      const letterData = genRes.data;

      // 2. Generate PDF client side using jsPDF with Official Template metadata
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

  // Generate PDF document using jsPDF
  const generatePdfDocument = (reqItem, letterData, template) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Primary Brand Purple Color
    const purpleHex = [123, 76, 237];

    // Header Background Accent Bar
    doc.setFillColor(...purpleHex);
    doc.rect(0, 0, pageWidth, 6, "F");

    // Header Title
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

    // Decorative line
    currentY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, currentY, pageWidth - 20, currentY);

    // Reference Details Box
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

    // Student & Allocation Details Grid
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
    doc.setFillColor(255, 255, 255);
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

    // Terms & Conditions Box
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

    // Signatures Section
    currentY += 60;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);

    doc.line(25, currentY + 15, 75, currentY + 15);
    doc.text("Student Signature", 32, currentY + 20);

    doc.line(pageWidth - 75, currentY + 15, pageWidth - 25, currentY + 15);
    doc.text("Warden Signature & Stamp", pageWidth - 70, currentY + 20);

    // Footer Accent
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated via CampusOS Portal on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    // Save PDF
    doc.save(`Allocation_Letter_${studentName.replace(/\s+/g, "_")}_${letterData?.referenceNo || "REF"}.pdf`);
  };

  // Filter logic
  const filteredRequests = requests.filter((r) => {
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

  // KPI Calculations
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const generatedCount = requests.filter((r) => r.status === "Generated").length;

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 w-full min-h-full pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7B4CED]/10 text-[#7B4CED]">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Letter Allocation Management
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Review student requests, verify hostel allocations, approve/reject, and issue official letters.
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#7B4CED]" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Requests</span>
            <FileText className="h-5 w-5 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{totalCount}</div>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Pending Review</span>
            <Clock className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-800">{pendingCount}</div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Approved</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-800">{approvedCount}</div>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">Letters Generated</span>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-purple-800">{generatedCount}</div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: "all", label: "All Requests" },
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Approved" },
            { id: "generated", label: "Generated" },
            { id: "rejected", label: "Rejected" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterStatus(t.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                filterStatus === t.id
                  ? "bg-[#7B4CED] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student or email..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs outline-none focus:border-[#7B4CED]"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-xs text-slate-400">
            Loading allocation letter requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
            <FileText className="h-10 w-10 mb-2 stroke-1 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No requests found</p>
            <p className="text-xs text-slate-400">There are no letter requests matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Student Details</th>
                  <th className="px-4 py-3">Hostel & Allocation</th>
                  <th className="px-4 py-3">Requested On</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((r) => {
                  const studentName = r.student?.fullName || r.student?.user?.name || "Student";
                  const studentEmail = r.student?.user?.email || "";
                  const collegeId = r.student?.collegeId || "N/A";
                  const alloc = r.student?.allocations?.[0];
                  const hostelName = r.hostel?.name || alloc?.bed?.room?.floor?.block?.hostel?.name || "Main Hostel";
                  const roomBed = alloc?.bed?.room?.number ? `Room ${alloc.bed.room.number} (${alloc.bed.number})` : "Unassigned";

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-4 py-3 font-medium">
                        <div className="font-bold text-slate-900">{studentName}</div>
                        <div className="text-[11px] text-slate-400">{studentEmail} · {collegeId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{hostelName}</div>
                        <div className="text-[11px] text-slate-500">{roomBed}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={r.status} reason={r.rejectionReason} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(r.id)}
                                disabled={processingId === r.id}
                                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => setRejectingReq(r)}
                                disabled={processingId === r.id}
                                className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
                              >
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </button>
                            </>
                          )}

                          {r.status === "Approved" && (
                            <button
                              onClick={() => handleGeneratePdf(r)}
                              disabled={processingId === r.id}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#7B4CED] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#6a3fd1] disabled:opacity-50"
                            >
                              <Sparkles className="h-3.5 w-3.5" /> Generate Letter
                            </button>
                          )}

                          {r.status === "Generated" && (
                            <>
                              <button
                                onClick={() => handleGeneratePdf(r, true)}
                                disabled={processingId === r.id}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
                              >
                                <RefreshCw className="h-3 w-3" /> Regenerate
                              </button>
                              <button
                                onClick={() => handleGeneratePdf(r, false)}
                                className="inline-flex items-center gap-1 rounded-lg bg-[#7B4CED] px-2.5 py-1 text-xs font-bold text-white shadow-sm hover:bg-[#6a3fd1]"
                              >
                                <Download className="h-3 w-3" /> Download PDF
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Reason Modal */}
      {rejectingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Reject Letter Request</h3>
            <p className="mt-1 text-xs text-slate-500">
              Please specify the reason for rejecting this allocation letter request for{" "}
              <span className="font-bold text-slate-800">
                {rejectingReq.student?.fullName || rejectingReq.student?.user?.name}
              </span>
              .
            </p>
            <form onSubmit={handleRejectSubmit} className="mt-4 flex flex-col gap-3">
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-rose-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingReq(null);
                    setRejectionReason("");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId === rejectingReq.id}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, reason }) {
  const s = (status || "").toLowerCase();
  if (s === "approved") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">
        <CheckCircle2 className="h-3 w-3" /> Approved
      </span>
    );
  }
  if (s === "generated") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-600">
        <Sparkles className="h-3 w-3" /> Letter Issued
      </span>
    );
  }
  if (s === "rejected") {
    return (
      <span
        title={reason ? `Reason: ${reason}` : "Rejected"}
        className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 cursor-help"
      >
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">
      <Clock className="h-3 w-3" /> Pending Review
    </span>
  );
}

export { Route };
