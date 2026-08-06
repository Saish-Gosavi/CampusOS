import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Printer,
  Building,
  User,
  Calendar,
  CheckCircle2,
  FileCheck,
  Edit3,
  Upload,
  File,
  AlertCircle,
  Eye,
} from "lucide-react";
import { allotmentLetterApi, allotmentTemplateApi } from "@/services/api";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = {
  component: HostelRoomAllotmentLetterPage,
};

// ─── Section definitions ────────────────────────────────────────────────────
const SECTIONS = [
  { key: "header", label: "Letter Header" },
  { key: "footer", label: "Letter Footer" },
  { key: "main",   label: "College Logo" },
  { key: "terms",  label: "College Stamp" },
];

// ─── SectionUploadRow ────────────────────────────────────────────────────────
function SectionUploadRow({ section, uploadedFileName, uploadedUrl, onUploaded }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [localFileName, setLocalFileName] = useState(uploadedFileName || null);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync whenever parent refreshes saved data
  useEffect(() => {
    setLocalFileName(uploadedFileName || null);
    if (uploadedFileName) setStatus("success");
  }, [uploadedFileName]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    // Always reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
    if (!file) return;

    // Client-side validation
    if (file.type !== "application/pdf") {
      setStatus("error");
      setErrorMsg("Only PDF files are accepted.");
      toast.error("Only PDF files are accepted.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus("error");
      setErrorMsg("PDF must be under 10 MB.");
      toast.error("PDF must be under 10 MB.");
      return;
    }

    setStatus("uploading");
    setProgress(0);
    setErrorMsg("");

    try {
      const res = await allotmentTemplateApi.uploadSection(
        section.key,
        file,
        (pct) => setProgress(pct)
      );

      if (res?.data) {
        setLocalFileName(file.name);
        setStatus("success");
        setProgress(100);
        toast.success(`"${section.label}" uploaded successfully.`);
        onUploaded?.(res.data);
      }
    } catch (err) {
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        "Upload failed. Please try again.";
      setStatus("error");
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-muted/30">
      {/* Row header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{section.label}</p>
            <p className="text-xs text-muted-foreground">PDF only · Max 10 MB</p>
          </div>
        </div>

        {/* Upload / Replace button */}
        <Button
          type="button"
          variant={localFileName ? "outline" : "default"}
          size="sm"
          className="gap-1.5 shrink-0"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
        >
          {status === "uploading" ? (
            <>
              <div className="h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Uploading…
            </>
          ) : localFileName ? (
            <>
              <Upload className="h-3.5 w-3.5" />
              Replace
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              Upload PDF
            </>
          )}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Progress bar */}
      {status === "uploading" && (
        <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Success: file name */}
      {status === "success" && localFileName && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate font-medium">{localFileName}</span>
          {uploadedUrl && (
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-primary underline shrink-0"
            >
              View
            </a>
          )}
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{errorMsg}</span>
        </div>
      )}

      {/* Not yet uploaded */}
      {status === "idle" && !localFileName && (
        <p className="text-xs text-muted-foreground italic">No file uploaded yet.</p>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
function HostelRoomAllotmentLetterPage() {
  const [letters, setLetters] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  /* ── fetch data ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lettersRes, templateRes] = await Promise.allSettled([
        allotmentLetterApi.getAll(),
        allotmentTemplateApi.getActive(),
      ]);

      if (lettersRes.status === "fulfilled" && lettersRes.value?.data) {
        setLetters(Array.isArray(lettersRes.value.data) ? lettersRes.value.data : []);
      }
      if (templateRes.status === "fulfilled" && templateRes.value?.data) {
        setActiveTemplate(templateRes.value.data);
      }
    } catch {
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── when any section upload completes, update local state immediately ── */
  const handleSectionUploaded = useCallback((updatedTemplate) => {
    setActiveTemplate(updatedTemplate);
  }, []);

  /* ── delete entire format template ── */
  const handleDeleteTemplate = async () => {
    if (!activeTemplate) return;
    if (!confirm("Are you sure you want to delete the active allotment format? This cannot be undone.")) return;
    try {
      await allotmentTemplateApi.delete(activeTemplate.id);
      toast.success("Allotment format deleted successfully.");
      setActiveTemplate(null);
    } catch {
      toast.error("Failed to delete template format.");
    }
  };

  /* ── delete individual letter ── */
  const handleDeleteLetter = async (id) => {
    if (!confirm("Delete this allotment letter?")) return;
    try {
      await allotmentLetterApi.delete(id);
      toast.success("Letter deleted.");
      fetchData();
    } catch {
      toast.error("Failed to delete letter.");
    }
  };

  const handlePrint = () => window.print();

  /* ── filtered letters ── */
  const filteredLetters = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return letters;
    return letters.filter((l) => {
      const name = l.allocation?.student?.fullName || "";
      const ref = l.referenceNo || "";
      return name.toLowerCase().includes(q) || ref.toLowerCase().includes(q);
    });
  }, [letters, searchQuery]);

  /* ── whether any section PDF has been uploaded ── */
  const hasAnySectionUploaded =
    activeTemplate &&
    (activeTemplate.headerPdfName ||
      activeTemplate.footerPdfName ||
      activeTemplate.mainPdfName ||
      activeTemplate.termsPdfName);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 md:p-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Room Allotment Letters
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage and use official room allotment letter PDF formats.
            </p>
          </div>
        </div>

        <Button onClick={() => setIsFormatModalOpen(true)} className="gap-2">
          {hasAnySectionUploaded ? (
            <Edit3 className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {hasAnySectionUploaded ? "Edit Format" : "Generate Format"}
        </Button>
      </div>

      {/* ── Active Format Banner ── */}
      {hasAnySectionUploaded && (
        <Card className="border border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FileCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground truncate">
                    {activeTemplate.name}
                  </p>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 uppercase shrink-0">
                    Active Format
                  </span>
                </div>
                {/* Section status pills */}
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {SECTIONS.map((sec) =>
                    activeTemplate[`${sec.key}PdfName`] ? (
                      <span
                        key={sec.key}
                        className="flex items-center gap-1 text-xs text-emerald-600"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {sec.label}
                      </span>
                    ) : (
                      <span
                        key={sec.key}
                        className="flex items-center gap-1 text-xs text-muted-foreground"
                      >
                        <File className="h-3 w-3" />
                        {sec.label}
                      </span>
                    )
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Saved by {activeTemplate.user?.name || "Admin"} on{" "}
                  {new Date(
                    activeTemplate.updatedAt || activeTemplate.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                onClick={() => setIsViewModalOpen(true)}
                title="View Format PDFs"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                onClick={handleDeleteTemplate}
                title="Delete Format"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Search ── */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name or reference ID..."
              className="pl-9 bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Letters Grid ── */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : filteredLetters.length === 0 ? (
        <Card className="border-dashed border-2 border-border p-12 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-3" />
          <h3 className="font-semibold text-lg">No Allotment Letters Found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Generated letters for students will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLetters.map((l) => {
            const student = l.allocation?.student || l.letterRequest?.student;
            const studentName = student?.fullName || student?.user?.name || "Assigned Student";
            const studentId = student?.collegeId || "N/A";
            const hostelName = l.allocation?.bed?.room?.floor?.block?.hostel?.name || l.letterRequest?.hostel?.name || "Main Campus Hostel";
            const roomNum = l.allocation?.bed?.room?.number || "Unassigned";
            const bedNum = l.allocation?.bed?.number || "Unassigned";
            const startDate = l.allocation?.startDate ? new Date(l.allocation.startDate).toLocaleDateString() : null;
            const endDate = l.allocation?.endDate ? new Date(l.allocation.endDate).toLocaleDateString() : null;
            const wardenName = l.generatedBy?.name || l.signedBy || "Warden Office";
            const status = l.letterRequest?.status || "Approved";

            return (
              <Card
                key={l.id}
                className="border-border bg-card shadow-sm hover:border-primary/45 transition-colors"
              >
                <CardContent className="p-5 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {l.referenceNo}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(l.issuedDate).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-foreground mb-1">
                      {studentName}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Student ID: {studentId}
                    </p>

                    <div className="space-y-2 border-t border-border pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building className="h-4 w-4 text-purple-500" />
                        <span>Hostel: {hostelName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 text-blue-500" />
                        <span>
                          Room: {roomNum} | Bed: {bedNum}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-emerald-500" />
                        <span>
                          {startDate && endDate ? `Valid: ${startDate} – ${endDate}` : `Status: ${status}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground border-t border-dashed border-border pt-2 mt-2">
                        <span className="text-xs text-slate-500">
                          Issued By: <strong className="text-foreground">{wardenName}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t border-border pt-4 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => {
                        setSelectedLetter(l);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Preview & Print
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => handleDeleteLetter(l.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ───────── Format Editor Modal — 4 PDF Sections ───────── */}
      <Dialog open={isFormatModalOpen} onOpenChange={setIsFormatModalOpen}>
        <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Room Allotment Letter Format
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a PDF for each section. Files are saved to the server
              immediately — they persist across refresh, logout, and restart.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            {SECTIONS.map((section) => (
              <SectionUploadRow
                key={section.key}
                section={section}
                uploadedFileName={
                  activeTemplate?.[`${section.key}PdfName`] || null
                }
                uploadedUrl={
                  activeTemplate?.[`${section.key}PdfUrl`] || null
                }
                onUploaded={handleSectionUploaded}
              />
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormatModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsFormatModalOpen(false);
                fetchData();
                toast.success("Format saved.");
              }}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ───────── View Format Modal (Read-Only PDFs) ───────── */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              View Room Allotment Format
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Active format section PDFs uploaded to the server.
            </p>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            {SECTIONS.map((sec) => {
              const fileName = activeTemplate?.[`${sec.key}PdfName`];
              const fileUrl = activeTemplate?.[`${sec.key}PdfUrl`];
              return (
                <div
                  key={sec.key}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {sec.label}
                      </p>
                      {fileName ? (
                        <p className="text-xs text-emerald-600 font-medium truncate">
                          {fileName}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          Not uploaded
                        </p>
                      )}
                    </div>
                  </div>

                  {fileUrl && (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                        <Eye className="h-3.5 w-3.5" />
                        View PDF
                      </Button>
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-3 border-t border-border">
            <Button
              type="button"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ───────── Preview & Print Modal ───────── */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-[700px] w-full p-0 overflow-hidden">
          <div className="p-6 overflow-y-auto max-h-[80vh]" id="allotment-print-section">
            <div className="text-center pb-6 border-b border-gray-300">
              <h2 className="text-2xl font-bold tracking-wide uppercase">
                CampusOS University Portal
              </h2>
              <p className="text-xs text-muted-foreground uppercase">
                Official Hostel Room Allotment Letter
              </p>
            </div>

            {selectedLetter && (
              <div className="pt-6 space-y-6">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="font-bold">Reference No:</p>
                    <p className="font-mono text-primary font-semibold">
                      {selectedLetter.referenceNo}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">Issued Date:</p>
                    <p>
                      {new Date(selectedLetter.issuedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold border-b border-border pb-1.5">
                    Student Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Full Name:</span>
                      <p className="font-medium">
                        {selectedLetter.allocation?.student?.fullName ||
                          selectedLetter.letterRequest?.student?.fullName ||
                          selectedLetter.letterRequest?.student?.user?.name ||
                          "Student Name"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">College ID:</span>
                      <p className="font-medium">
                        {selectedLetter.allocation?.student?.collegeId ||
                          selectedLetter.letterRequest?.student?.collegeId ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold border-b border-border pb-1.5">
                    Allotment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Hostel:</span>
                      <p className="font-medium">
                        {selectedLetter.allocation?.bed?.room?.floor?.block?.hostel?.name ||
                          selectedLetter.letterRequest?.hostel?.name ||
                          "Main Campus Hostel"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Room & Bed No:</span>
                      <p className="font-medium">
                        Room{" "}
                        {selectedLetter.allocation?.bed?.room?.number || "Unassigned"}{" "}
                        | Bed {selectedLetter.allocation?.bed?.number || "Unassigned"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Allocation Valid Till / Status:
                      </span>
                      <p className="font-medium">
                        {selectedLetter.allocation?.endDate
                          ? new Date(selectedLetter.allocation.endDate).toLocaleDateString()
                          : (selectedLetter.letterRequest?.status || "Approved")}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedLetter.terms && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm border-b border-border pb-1">
                      Terms & Conditions
                    </h4>
                    <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">
                      {selectedLetter.terms}
                    </p>
                  </div>
                )}

                <div className="pt-12 flex justify-between items-end">
                  <div className="text-xs text-muted-foreground">
                    <p>Signature of Student</p>
                    <div className="w-36 border-b border-gray-400 mt-8" />
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Authorized Signatory</p>
                    <p className="font-bold text-foreground mt-4">
                      {selectedLetter.generatedBy?.name || selectedLetter.signedBy || "Warden Office"}
                    </p>
                    <div className="w-36 border-b border-gray-400 mt-2 ml-auto" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted px-6 py-4 flex justify-end gap-2 border-t border-border">
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" />
              Print Letter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default HostelRoomAllotmentLetterPage;
