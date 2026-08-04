import React, { useState, useEffect, useMemo, useCallback } from "react";
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

function HostelRoomAllotmentLetterPage() {
  const [letters, setLetters] = useState([]);
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Format editor state
  const [formatText, setFormatText] = useState("");
  const [saving, setSaving] = useState(false);

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
    } catch (err) {
      toast.error("Failed to load page data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* ── open format modal ── */
  const handleOpenFormatModal = () => {
    setFormatText(activeTemplate?.description || "");
    setIsFormatModalOpen(true);
  };

  /* ── save format text ── */
  const handleSaveFormat = async () => {
    if (!formatText.trim()) {
      toast.error("Please enter format text before saving.");
      return;
    }
    setSaving(true);
    try {
      const res = await allotmentTemplateApi.saveFormat({
        name: "Room Allotment Letter Format",
        content: formatText.trim(),
      });

      if (res?.data) {
        toast.success("Room allotment letter format saved successfully!");
        setActiveTemplate(res.data);
        setIsFormatModalOpen(false);
        fetchData();
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save format.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /* ── delete template ── */
  const handleDeleteTemplate = async () => {
    if (!activeTemplate) return;
    if (!confirm(`Are you sure you want to delete the active allotment format? This cannot be undone.`)) return;
    try {
      await allotmentTemplateApi.delete(activeTemplate.id);
      toast.success("Allotment format deleted successfully.");
      setActiveTemplate(null);
      fetchData();
    } catch {
      toast.error("Failed to delete template format.");
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
              Manage and use official room allotment letter text formats.
            </p>
          </div>
        </div>

        <Button onClick={handleOpenFormatModal} className="gap-2">
          {activeTemplate ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {activeTemplate ? "Edit Format" : "Generate Format"}
        </Button>
      </div>

      {/* Active Format Banner */}
      {activeTemplate && (
        <Card className="border border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                <FileCheck className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground truncate">{activeTemplate.name}</p>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 uppercase shrink-0">
                    Active Format
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Saved by {activeTemplate.user?.name || "Admin"} on{" "}
                  {new Date(activeTemplate.updatedAt || activeTemplate.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
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

      {/* ───────── Format Editor Modal (Notes Style) ───────── */}
      <Dialog open={isFormatModalOpen} onOpenChange={setIsFormatModalOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Room Allotment Letter Format
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            <textarea
              value={formatText}
              onChange={(e) => setFormatText(e.target.value)}
              placeholder="Type or paste the allotment letter format here..."
              rows={14}
              className="w-full rounded-xl border border-border bg-background p-4 text-sm font-mono leading-relaxed outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner resize-y min-h-[280px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormatModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveFormat}
              disabled={saving}
              className="gap-2"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Save
                </>
              )}
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
