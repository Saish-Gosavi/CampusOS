import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Printer,
  Upload,
  ImagePlus,
  X,
  Building,
  User,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  Download,
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
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = {
  component: HostelRoomAllotmentLetterPage,
};

/* ─────────────────────────── helpers ─────────────────────────── */
const formatBytes = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const fileTypeLabel = (mime) => {
  if (!mime) return "Unknown";
  if (mime.includes("pdf")) return "PDF";
  if (mime.includes("wordprocessingml") || mime.includes("msword")) return "DOCX";
  if (mime.includes("png")) return "PNG";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "JPG";
  return mime.split("/")[1]?.toUpperCase() || "File";
};

const ALLOWED_TEMPLATE = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];
const ALLOWED_IMAGE = ["image/png", "image/jpeg", "image/jpg"];

/* ─────────────────────────── component ─────────────────────────── */
function HostelRoomAllotmentLetterPage() {
  const [letters, setLetters] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Upload form state
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [templateFile, setTemplateFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  /* ── fetch ── */
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
    } catch (err) {
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  /* ── drag & drop ── */
  const onTemplateDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!ALLOWED_TEMPLATE.includes(file.type)) {
      toast.error("Only PDF or DOCX files are allowed for the template.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Template file must be under 10 MB.");
      return;
    }
    setTemplateFile(file);
  };

  const onImageDrop = (e) => {
    e.preventDefault();
    setImageDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE.includes(file.type)) {
      toast.error("Only PNG or JPG images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setImageFile(file);
  };

  const onTemplateFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_TEMPLATE.includes(file.type)) {
      toast.error("Only PDF or DOCX files are allowed for the template.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Template file must be under 10 MB.");
      return;
    }
    setTemplateFile(file);
  };

  const onImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_IMAGE.includes(file.type)) {
      toast.error("Only PNG or JPG images are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setImageFile(file);
  };

  /* ── reset form ── */
  const resetForm = () => {
    setTemplateName("");
    setTemplateDesc("");
    setTemplateFile(null);
    setImageFile(null);
    setShowReplaceConfirm(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  /* ── submit upload ── */
  const handleUpload = async (replaceExisting = false) => {
    if (!templateName.trim()) {
      toast.error("Template name is required.");
      return;
    }
    if (!templateFile) {
      toast.error("Please upload a PDF or DOCX template file.");
      return;
    }

    // If active template exists and replace not confirmed yet → show confirm
    if (activeTemplate && !replaceExisting) {
      setShowReplaceConfirm(true);
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("name", templateName.trim());
      if (templateDesc.trim()) fd.append("description", templateDesc.trim());
      fd.append("templateFile", templateFile);
      if (imageFile) fd.append("templateImage", imageFile);
      fd.append("replaceExisting", String(replaceExisting));

      const res = await allotmentTemplateApi.upload(fd);

      if (res?.data) {
        toast.success("Template uploaded and saved successfully!");
        setActiveTemplate(res.data);
        setIsUploadOpen(false);
        resetForm();
        fetchData();
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Upload failed. Please try again.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  /* ── delete template ── */
  const handleDeleteTemplate = async () => {
    if (!activeTemplate) return;
    if (!confirm(`Are you sure you want to delete the template "${activeTemplate.name}"? This cannot be undone.`)) return;
    try {
      await allotmentTemplateApi.delete(activeTemplate.id);
      toast.success("Template deleted successfully.");
      setActiveTemplate(null);
      fetchData();
    } catch {
      toast.error("Failed to delete template.");
    }
  };

  /* ── delete letter ── */
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

  /* ─────────── render ─────────── */
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 md:p-6">
      {/* Header */}
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
              Upload, manage, and use official allotment letter templates.
            </p>
          </div>
        </div>

        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Generate Format
        </Button>
      </div>

      {/* Active Template Banner */}
      {activeTemplate && (
        <Card className="border border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FileCheck className="h-5 w-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{activeTemplate.name}</p>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 uppercase">
                    Active
                  </span>
                  <span className="rounded-full bg-muted text-muted-foreground text-xs font-mono px-2 py-0.5 uppercase">
                    {activeTemplate.fileType}
                  </span>
                </div>
                {activeTemplate.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">{activeTemplate.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  Uploaded by {activeTemplate.user?.name || "Admin"} on{" "}
                  {new Date(activeTemplate.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {activeTemplate.fileUrl && (
                <a
                  href={activeTemplate.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setIsUploadOpen(true)}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                onClick={handleDeleteTemplate}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
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

      {/* Letters grid */}
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
          {filteredLetters.map((l) => (
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
                    {l.allocation?.student?.fullName || "Assigned Student"}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Student ID: {l.allocation?.student?.collegeId || "N/A"}
                  </p>

                  <div className="space-y-2 border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4 text-purple-500" />
                      <span>
                        Hostel:{" "}
                        {l.allocation?.bed?.room?.floor?.block?.hostel?.name ||
                          "Main Campus Hostel"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4 text-blue-500" />
                      <span>
                        Room: {l.allocation?.bed?.room?.number || "Room"} | Bed:{" "}
                        {l.allocation?.bed?.number || "Bed"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-emerald-500" />
                      <span>
                        Valid: {new Date(l.allocation?.startDate).toLocaleDateString()} –{" "}
                        {new Date(l.allocation?.endDate).toLocaleDateString()}
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
          ))}
        </div>
      )}

      {/* ───────── Upload Allotment Format Modal ───────── */}
      <Dialog
        open={isUploadOpen}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
          }
          setIsUploadOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[580px] max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Upload Allotment Format</DialogTitle>
            <DialogDescription>
              Upload an official PDF or DOCX template. Only one template is active at a time.
            </DialogDescription>
          </DialogHeader>

          {/* Replace warning */}
          {activeTemplate && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-amber-600" />
              <span>
                An active template <strong>"{activeTemplate.name}"</strong> already exists.
                Uploading a new one will replace it after confirmation.
              </span>
            </div>
          )}

          <div className="space-y-5 pt-1">
            {/* Template Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" htmlFor="tpl-name">
                Template Name <span className="text-rose-500">*</span>
              </label>
              <Input
                id="tpl-name"
                placeholder="e.g. Boys Hostel Allotment Letter 2025-26"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold" htmlFor="tpl-desc">
                Description{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                id="tpl-desc"
                placeholder="Brief description of this template..."
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
                rows={2}
                maxLength={500}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">
                {templateDesc.length}/500
              </p>
            </div>

            {/* Template file drag & drop */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">
                Template File <span className="text-rose-500">*</span>
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                  (PDF or DOCX — max 10 MB)
                </span>
              </label>

              {templateFile ? (
                <div className="flex items-center gap-3 rounded-lg border border-primary/40 bg-primary/5 px-4 py-3">
                  <FileCheck className="h-8 w-8 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{templateFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {fileTypeLabel(templateFile.type)} · {formatBytes(templateFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onTemplateDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-colors ${
                    dragOver
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  <Upload
                    className={`h-8 w-8 transition-colors ${
                      dragOver ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <p className="text-sm font-medium">
                    Drag & drop here, or{" "}
                    <span className="text-primary underline underline-offset-2">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground">PDF or DOCX · Max 10 MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={onTemplateFileChange}
              />
            </div>

            {/* Optional image upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">
                Header / Letterhead Image{" "}
                <span className="text-muted-foreground font-normal">(optional · PNG or JPG · max 5 MB)</span>
              </label>

              {imageFile ? (
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3">
                  <ImagePlus className="h-7 w-7 text-blue-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{imageFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {fileTypeLabel(imageFile.type)} · {formatBytes(imageFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      if (imageInputRef.current) imageInputRef.current.value = "";
                    }}
                    className="rounded-md p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setImageDragOver(true); }}
                  onDragLeave={() => setImageDragOver(false)}
                  onDrop={onImageDrop}
                  onClick={() => imageInputRef.current?.click()}
                  className={`flex items-center gap-3 rounded-lg border border-dashed px-4 py-4 cursor-pointer transition-colors ${
                    imageDragOver
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/10 hover:border-primary/40 hover:bg-muted/20"
                  }`}
                >
                  <ImagePlus className="h-6 w-6 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Drop an image or{" "}
                      <span className="text-primary underline underline-offset-2">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground">PNG · JPG · max 5 MB</p>
                  </div>
                </div>
              )}

              <input
                ref={imageInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                className="hidden"
                onChange={onImageFileChange}
              />
            </div>

            {/* Replace confirmation inline */}
            {showReplaceConfirm && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-rose-800">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
                  <div>
                    <p className="font-semibold">Replace existing template?</p>
                    <p className="text-xs mt-0.5">
                      The current template <strong>"{activeTemplate?.name}"</strong> will be
                      permanently deactivated and its file deleted. This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowReplaceConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
                    disabled={uploading}
                    onClick={() => handleUpload(true)}
                  >
                    {uploading ? "Uploading..." : "Yes, Replace & Save"}
                  </Button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {!showReplaceConfirm && (
              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsUploadOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleUpload(false)}
                  disabled={uploading || !templateFile || !templateName.trim()}
                  className="gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Save Template
                    </>
                  )}
                </Button>
              </div>
            )}
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
                    <p>{new Date(selectedLetter.issuedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold border-b border-border pb-1.5">Student Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Full Name:</span>
                      <p className="font-medium">
                        {selectedLetter.allocation?.student?.fullName || "Student Name"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">College ID:</span>
                      <p className="font-medium">
                        {selectedLetter.allocation?.student?.collegeId || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold border-b border-border pb-1.5">Allotment Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Hostel:</span>
                      <p className="font-medium">
                        {selectedLetter.allocation?.bed?.room?.floor?.block?.hostel?.name ||
                          "Main Campus Hostel"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Room & Bed No:</span>
                      <p className="font-medium">
                        Room {selectedLetter.allocation?.bed?.room?.number || "Room"} | Bed{" "}
                        {selectedLetter.allocation?.bed?.number || "Bed"}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Allocation Valid Till:</span>
                      <p className="font-medium">
                        {new Date(selectedLetter.allocation?.endDate).toLocaleDateString()}
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
                    <p className="font-bold text-foreground mt-4">{selectedLetter.signedBy}</p>
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
