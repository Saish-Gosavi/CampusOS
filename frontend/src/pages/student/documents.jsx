import React, { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { FileText, Download, Clock, CheckCircle2, XCircle, Sparkles, RefreshCw, Send } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { toast } from "sonner";
import { studentLetterApi, wardenLetterApi } from "@/services/api";
import jsPDF from "jspdf";

const Route = createFileRoute("/student/documents")({
  head: () => ({ meta: [{ title: "Documents — Student Portal" }] }),
  component: DocumentsPage
});

function DocumentsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await studentLetterApi.getRequests();
      setRequests(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequestSubmit = async () => {
    setSubmitting(true);
    try {
      await studentLetterApi.submitRequest();
      toast.success("Hostel Allocation Letter request submitted successfully!");
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit letter request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPdf = (r) => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Primary Brand Purple Color
    doc.setFillColor(123, 76, 237);
    doc.rect(0, 0, pageWidth, 6, "F");

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42);
    doc.text("CAMPUS OS — HOSTEL ALLOCATION LETTER", pageWidth / 2, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Official Resident Room Allocation Certificate", pageWidth / 2, 27, { align: "center" });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(20, 33, pageWidth - 20, 33);

    // Reference Box
    const refNo = r.allotmentLetter?.referenceNo || "AL-2026-OFFICIAL";
    const issuedDate = new Date(r.allotmentLetter?.issuedDate || Date.now()).toLocaleDateString();

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(20, 38, pageWidth - 40, 22, 3, 3, "F");
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(20, 38, pageWidth - 40, 22, 3, 3, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(123, 76, 237);
    doc.text(`Reference No: ${refNo}`, 25, 46);
    doc.text(`Issue Date: ${issuedDate}`, pageWidth - 25, 46, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Status: Official Allocation Certificate`, 25, 54);
    doc.text(`Signed By: ${r.allotmentLetter?.signedBy || "Warden Office"}`, pageWidth - 25, 54, { align: "right" });

    // Details Grid
    let currentY = 70;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Resident & Allocation Details", 20, currentY);

    const hostelName = r.hostel?.name || "Main Campus Hostel";

    const rows = [
      ["Hostel Name:", hostelName, "Status:", "Approved & Valid"],
      ["Issued Date:", issuedDate, "Signed By:", r.allotmentLetter?.signedBy || "Warden Office"]
    ];

    currentY += 8;
    rows.forEach((row) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(row[0], 25, currentY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(row[1], 60, currentY);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139);
      doc.text(row[2], 115, currentY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(15, 23, 42);
      doc.text(row[3], 150, currentY);

      currentY += 7;
    });

    // Terms
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

    // Footer
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated via CampusOS Portal on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save(`Hostel_Allocation_Letter_${refNo}.pdf`);

    // Log download event
    wardenLetterApi.logDownload(r.allotmentLetter?.id, refNo).catch(() => {});
  };

  const hasActiveRequest = requests.some((r) => ["Pending", "Approved"].includes(r.status));

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6 pb-10">
      <StudentPageHeader
        title="Documents & Certificates"
        description="Official hostel room allocation letters, receipts, and approvals."
        icon={FileText}
        tint="#7B4CED"
        breadcrumbs={[{ label: "Documents" }]}
      />

      {/* Hostel Allocation Letter Section */}
      <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50/50 via-white to-slate-50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7B4CED] text-white shadow-md">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Hostel Allocation Letter</h2>
              <p className="text-xs text-slate-500">
                Submit a request to Warden for your official room allocation certificate.
              </p>
            </div>
          </div>

          <button
            onClick={handleRequestSubmit}
            disabled={submitting || hasActiveRequest}
            className="inline-flex items-center gap-2 rounded-xl bg-[#7B4CED] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#6a3fd1] disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {submitting ? "Submitting..." : hasActiveRequest ? "Request Active" : "Request Allocation Letter"}
          </button>
        </div>

        {/* Requests List */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Your Allocation Letter Requests</h3>
          {loading ? (
            <div className="py-6 text-center text-xs text-slate-400">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
              No allocation letter requests submitted yet. Click "Request Allocation Letter" above to request one.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {r.hostel?.name || "Hostel Allocation Letter"}
                      </p>
                      <p className="text-xs text-slate-400">
                        Requested on {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {r.status === "Pending" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600">
                        <Clock className="h-3.5 w-3.5" /> Pending Warden Approval
                      </span>
                    )}

                    {r.status === "Approved" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approved — Awaiting Letter Generation
                      </span>
                    )}

                    {r.status === "Rejected" && (
                      <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600">
                          <XCircle className="h-3.5 w-3.5" /> Request Rejected
                        </span>
                        {r.rejectionReason && (
                          <span className="text-[11px] font-medium text-rose-500 mt-1">
                            Reason: {r.rejectionReason}
                          </span>
                        )}
                      </div>
                    )}

                    {r.status === "Generated" && (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600">
                          <Sparkles className="h-3.5 w-3.5" /> Letter Ready
                        </span>
                        <button
                          onClick={() => handleDownloadPdf(r)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#7B4CED] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-[#6a3fd1]"
                        >
                          <Download className="h-3.5 w-3.5" /> Download PDF
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Route };
