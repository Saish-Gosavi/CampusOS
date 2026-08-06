import { useEffect, useMemo, useState, useCallback } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  UserRoundCheck,
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
  Download,
  Loader2,
  ShieldCheck,
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
  DialogFooter,
} from "@/components/ui/dialog";
import { visitorApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/hostel-admin/visitors")({
  head: () => ({
    meta: [
      { title: "Visitor Management — Hostel Admin · CampusOS" },
      {
        name: "description",
        content:
          "View warden-processed visitor requests. Manage on-campus check-in and check-out.",
      },
    ],
  }),
  component: VisitorsPage,
});

const TINT = "#0EA5E9";

function VisitorsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Approved");
  const [q, setQ] = useState("");
  const [relation, setRelation] = useState("All");
  const [viewing, setViewing] = useState(null);

  /* ── Fetch all records from API ── */
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
          enrollment: "N/A",
          hostel: "Main Campus Hostel",
          room: "N/A",
          visitDate: item.checkIn
            ? new Date(item.checkIn).toLocaleDateString()
            : new Date().toLocaleDateString(),
          entryTime: item.checkIn
            ? new Date(item.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "N/A",
          exitTime: item.checkOut
            ? new Date(item.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "N/A",
          purpose: item.purpose || "General visit",
          status: item.status || "Pending",
          remarks: item.remarks || "",
          wardenRemarks: item.wardenRemarks || "",
          reviewedBy: item.reviewedBy || null,
          requestedOn: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : new Date().toLocaleDateString(),
        }))
      );
    } catch {
      toast.error("Failed to load visitor records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ── Tab filter logic ── */
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      // Approved tab: Warden-approved requests (including checked-in)
      if (tab === "Approved" && !(r.status === "Approved" || r.status === "Checked-In")) return false;
      // Rejected tab: Warden-rejected requests
      if (tab === "Rejected" && r.status !== "Rejected") return false;
      // History: all records
      if (relation !== "All" && r.relation !== relation) return false;
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
  }, [rows, tab, relation, q]);

  /* ── Stats ── */
  const counts = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((r) => r.status === "Pending").length,
      approved: rows.filter((r) => r.status === "Approved" || r.status === "Checked-In").length,
      onCampus: rows.filter((r) => r.status === "Checked-In").length,
      rejected: rows.filter((r) => r.status === "Rejected").length,
    }),
    [rows]
  );

  const stats = [
    { label: "Total Visitors", value: counts.total, icon: UserRoundCheck, tint: "#0EA5E9" },
    { label: "Pending (Warden)", value: counts.pending, icon: Clock, tint: "#EAB308" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, tint: "#22C55E" },
    { label: "On Campus", value: counts.onCampus, icon: LogIn, tint: "#7B4CED" },
    { label: "Rejected", value: counts.rejected, icon: XCircle, tint: "#EF4444" },
  ];

  /* ── Check-In / Check-Out (Admin action after warden approval) ── */
  const setStatus = async (row, status, msg) => {
    try {
      await visitorApi.update(row.id, { status });
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
      toast.success(msg);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  /* ── Export CSV ── */
  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No visitor data to export.");
      return;
    }
    const headers = ["Visitor Name", "Phone", "Relation", "Student", "Visit Date", "Status", "Reviewed By", "Purpose"];
    const csvRows = filtered.map((r) => [
      `"${r.visitorName}"`,
      `"${r.visitorPhone}"`,
      `"${r.relation}"`,
      `"${r.student}"`,
      `"${r.visitDate}"`,
      `"${r.status}"`,
      `"${r.reviewedBy || ""}"`,
      `"${r.purpose.replace(/"/g, '""')}"`,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...csvRows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", `Visitor_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Visitor report exported.");
  };

  const relations = ["All", "Father", "Mother", "Sibling", "Guardian", "Relative", "Friend", "Other"];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Visitor Management"
        description="View visitor requests processed by the Warden. Manage on-campus check-in and check-out."
        icon={UserRoundCheck}
        tint={TINT}
        breadcrumbs={[{ label: "Visitor Management" }]}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
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

      {/* Warden-pending notice */}
      {counts.pending > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-800/40 dark:bg-amber-900/20">
          <Clock className="h-4 w-4 shrink-0 text-amber-500" />
          <p className="text-amber-800 dark:text-amber-300">
            <span className="font-semibold">{counts.pending} request{counts.pending !== 1 ? "s" : ""}</span>{" "}
            pending Warden review — they will appear here once actioned.
          </p>
        </div>
      )}

      {/* Tabs + Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Tab bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          {["Approved", "Rejected", "History"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t ? "text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              style={tab === t ? { backgroundColor: TINT } : undefined}
            >
              {t}
            </button>
          ))}

          {/* Filters */}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search visitor, student…"
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
                {relations.map((t) => (
                  <option key={t} value={t}>
                    {t === "All" ? "All Relations" : t}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={handleExport}>
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
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
                  <th className="px-4 py-3 font-medium">Entry</th>
                  <th className="px-4 py-3 font-medium">Exit</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Reviewed By</th>
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
                          style={{ background: `linear-gradient(135deg, ${TINT}, #7B4CED)` }}
                        >
                          {r.visitorName.split(" ").map((p) => p[0]).join("").slice(0, 2)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{r.visitorName}</p>
                          <p className="truncate text-xs text-muted-foreground">{r.visitorPhone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="px-4 py-3">
                      <p className="truncate font-medium text-foreground">{r.student}</p>
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

                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.visitDate}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.entryTime}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.exitTime}</td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-4 py-3">
                      <StatusPill status={r.status} />
                    </td>

                    {/* Reviewed By */}
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">
                      {r.reviewedBy ? (
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" />
                          {r.reviewedBy}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">Pending</span>
                      )}
                    </td>

                    {/* Actions — only View + Check-In/Out */}
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewing(r)}
                          title="View"
                          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {r.status === "Approved" && (
                          <button
                            onClick={() => setStatus(r, "Checked-In", `${r.visitorName} checked in`)}
                            title="Check-In"
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#7B4CED] hover:bg-[#7B4CED]/10"
                          >
                            <LogIn className="h-4 w-4" />
                          </button>
                        )}
                        {r.status === "Checked-In" && (
                          <button
                            onClick={() => setStatus(r, "Checked-Out", `${r.visitorName} checked out`)}
                            title="Check-Out"
                            className="grid h-8 w-8 place-items-center rounded-lg text-[#4B5563] hover:bg-muted"
                          >
                            <LogOut className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      {tab === "Approved"
                        ? "No approved visitor requests yet. Awaiting Warden decisions."
                        : tab === "Rejected"
                        ? "No rejected requests."
                        : "No visitor records found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── View Detail Dialog ── */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserRoundCheck className="h-5 w-5" style={{ color: TINT }} />
                  Visitor Request · {viewing.visitorName}
                </DialogTitle>
                <DialogDescription>
                  Requested on {viewing.requestedOn} · Visit {viewing.visitDate}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoRow icon={User} label="Visitor" value={viewing.visitorName} />
                <InfoRow icon={Phone} label="Visitor Phone" value={viewing.visitorPhone} />
                <InfoRow icon={IdCard} label="ID Proof" value={viewing.visitorIdProof} />
                <InfoRow icon={User} label="Relation" value={viewing.relation} />
                <InfoRow icon={User} label="Student" value={viewing.student} />
                <InfoRow icon={CalendarDays} label="Visit Date" value={viewing.visitDate} />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-muted-foreground">Purpose of Visit</p>
                <p className="mt-1 text-sm text-foreground">{viewing.purpose}</p>
              </div>

              {/* Status + Warden review */}
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusPill status={viewing.status} />
                  </div>
                </div>
                {viewing.reviewedBy && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Reviewed by Warden</p>
                    <p className="text-sm font-medium text-foreground">{viewing.reviewedBy}</p>
                  </div>
                )}
              </div>

              {viewing.wardenRemarks && (
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" /> Warden Remarks
                  </p>
                  <p className="mt-1 text-sm text-foreground">{viewing.wardenRemarks}</p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setViewing(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border p-3">
      <span
        className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg"
        style={{ backgroundColor: `${TINT}1A`, color: TINT }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value || "—"}</p>
      </div>
    </div>
  );
}

export { Route };
