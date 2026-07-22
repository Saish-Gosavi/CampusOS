import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DoorOpen,
  DoorClosed,
  LogIn,
  LogOut,
  Search,
  Filter,
  QrCode,
  Plus,
  Download,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users as UsersIcon,
  User,
  MapPin,
  ScanLine,
  History as HistoryIcon,
  Camera,
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
import {
  inOutEntries as seed,
  students,
  type InOutEntry,
  type InOutPurpose,
} from "@/lib/hostel-data";
import { toast } from "sonner";

export const Route = createFileRoute("/hostel-admin/in-out")({
  head: () => ({
    meta: [
      { title: "In-Out Register — Hostel Admin · CampusOS" },
      {
        name: "description",
        content:
          "Track hostel student entry & exit logs, scan QR at the gate, add manual entries and review late returns.",
      },
    ],
  }),
  component: InOutPage,
});

type Tab = "Entry" | "Exit" | "History";
type QuickFilter = "All" | "TodayEntries" | "TodayExits" | "LateReturns";

const TINT = "#7B4CED";
const TODAY = "2026-07-22";

const purposes: (InOutPurpose | "All")[] = [
  "All",
  "Class",
  "Personal",
  "Medical",
  "Home Visit",
  "Sports",
  "Library",
  "Other",
];

function InOutPage() {
  const [rows, setRows] = useState<InOutEntry[]>(seed);
  const [tab, setTab] = useState<Tab>("Entry");
  const [quick, setQuick] = useState<QuickFilter>("All");
  const [q, setQ] = useState("");
  const [purpose, setPurpose] = useState<string>("All");

  const [viewing, setViewing] = useState<InOutEntry | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [studentPickerOpen, setStudentPickerOpen] = useState(false);
  const [studentQ, setStudentQ] = useState("");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      // Tab filter
      if (tab === "Entry") {
        // Entry log = students that returned back today (has in time today)
        if (!(r.inDate === TODAY)) return false;
      } else if (tab === "Exit") {
        // Exit log = students currently outside OR who left today
        if (r.outDate !== TODAY) return false;
      }
      // History tab shows everything

      // Quick filters
      if (quick === "TodayEntries" && r.inDate !== TODAY) return false;
      if (quick === "TodayExits" && r.outDate !== TODAY) return false;
      if (quick === "LateReturns" && !(r.status === "Late Return" || r.status === "Overdue"))
        return false;

      if (purpose !== "All" && r.purpose !== purpose) return false;

      if (q) {
        const s = q.toLowerCase();
        if (
          !r.student.toLowerCase().includes(s) &&
          !r.enrollment.toLowerCase().includes(s) &&
          !r.room.toLowerCase().includes(s) &&
          !r.destination.toLowerCase().includes(s)
        )
          return false;
      }
      return true;
    });
  }, [rows, tab, quick, purpose, q]);

  const counts = useMemo(
    () => ({
      currentlyOut: rows.filter((r) => r.status === "Outside" || r.status === "Overdue").length,
      todayExits: rows.filter((r) => r.outDate === TODAY).length,
      todayEntries: rows.filter((r) => r.inDate === TODAY).length,
      lateReturns: rows.filter((r) => r.status === "Late Return" || r.status === "Overdue").length,
      totalToday: rows.filter((r) => r.outDate === TODAY || r.inDate === TODAY).length,
    }),
    [rows],
  );

  const stats = [
    { label: "Currently Out", value: counts.currentlyOut, icon: DoorOpen, tint: "#3B82F6" },
    { label: "Today's Exits", value: counts.todayExits, icon: LogOut, tint: "#7B4CED" },
    { label: "Today's Entries", value: counts.todayEntries, icon: LogIn, tint: "#22C55E" },
    { label: "Late Returns", value: counts.lateReturns, icon: AlertTriangle, tint: "#EF4444" },
    { label: "Logs Today", value: counts.totalToday, icon: CheckCircle2, tint: "#0EA5E9" },
  ];

  const markReturned = (row: InOutEntry) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const time = `${hh}:${mm}`;
    // Determine late
    const [eh, em] = row.expectedReturn.split(":").map(Number);
    const expected = eh * 60 + em;
    const actual = now.getHours() * 60 + now.getMinutes();
    const late = actual > expected + 5;
    setRows((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              inDate: TODAY,
              inTime: time,
              status: late ? "Late Return" : "Returned",
            }
          : r,
      ),
    );
    toast.success(`${row.student} marked as returned${late ? " (late)" : ""}`);
  };

  const filteredStudents = useMemo(() => {
    if (!studentQ) return students.slice(0, 8);
    const s = studentQ.toLowerCase();
    return students
      .filter(
        (st) =>
          st.name.toLowerCase().includes(s) ||
          st.enrollment.toLowerCase().includes(s) ||
          st.room.toLowerCase().includes(s),
      )
      .slice(0, 12);
  }, [studentQ]);

  const registerExit = (student: (typeof students)[number], form: Partial<InOutEntry>) => {
    const id = `io-${Date.now()}`;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const entry: InOutEntry = {
      id,
      studentId: student.id,
      student: student.name,
      enrollment: student.enrollment,
      hostel: student.hostel,
      room: student.room,
      purpose: (form.purpose as InOutPurpose) ?? "Personal",
      destination: form.destination ?? "—",
      outDate: TODAY,
      outTime: `${hh}:${mm}`,
      expectedReturn: form.expectedReturn ?? "21:00",
      status: "Outside",
      gate: form.gate ?? "Hostel Gate",
      loggedBy: "Hostel Admin",
      method: form.method ?? "Manual",
    };
    setRows((prev) => [entry, ...prev]);
    toast.success(`Exit registered — ${student.name}`);
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="In-Out Register"
        description="Track hostel gate movements — exits, entries, late returns and full history."
        icon={DoorOpen}
        tint={TINT}
        breadcrumbs={[{ label: "In-Out Register" }]}
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

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <QuickCard
          title="QR Scanner"
          desc="Scan student ID card at the gate to auto-log entry or exit."
          icon={QrCode}
          tint="#7B4CED"
          cta="Open Scanner"
          onClick={() => setScannerOpen(true)}
        />
        <QuickCard
          title="Manual Entry"
          desc="Log a gate movement manually when QR scan is unavailable."
          icon={Plus}
          tint="#0EA5E9"
          cta="New Entry"
          onClick={() => setManualOpen(true)}
        />
        <QuickCard
          title="Student Search"
          desc="Find a student and register their exit or return quickly."
          icon={UsersIcon}
          tint="#22C55E"
          cta="Search Student"
          onClick={() => setStudentPickerOpen(true)}
        />
      </div>

      {/* Tabs + filters */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-3">
          {(
            [
              { id: "Entry", label: "Entry Log", icon: LogIn },
              { id: "Exit", label: "Exit Log", icon: LogOut },
              { id: "History", label: "History", icon: HistoryIcon },
            ] as { id: Tab; label: string; icon: typeof LogIn }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
              style={tab === t.id ? { backgroundColor: TINT } : undefined}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search student, room, destination…"
                className="h-9 w-64 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
              />
            </div>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="h-9 rounded-lg border border-border bg-background pl-8 pr-3 text-sm text-foreground"
              >
                {purposes.map((p) => (
                  <option key={p} value={p}>
                    {p === "All" ? "All Purposes" : p}
                  </option>
                ))}
              </select>
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        {/* Quick filter chips */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
          {(
            [
              { id: "All", label: "All" },
              { id: "TodayEntries", label: "Today's Entries" },
              { id: "TodayExits", label: "Today's Exits" },
              { id: "LateReturns", label: "Late Returns" },
            ] as { id: QuickFilter; label: string }[]
          ).map((f) => (
            <button
              key={f.id}
              onClick={() => setQuick(f.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                quick === f.id
                  ? "border-transparent bg-[#7B4CED]/10 text-[#7B4CED]"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Destination</th>
                <th className="px-4 py-3 font-medium">Out</th>
                <th className="px-4 py-3 font-medium">Expected</th>
                <th className="px-4 py-3 font-medium">In</th>
                <th className="px-4 py-3 font-medium">Gate</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white"
                        style={{ background: `linear-gradient(135deg, ${TINT}, #2563EB)` }}
                      >
                        {r.student
                          .split(" ")
                          .map((p) => p[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{r.student}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {r.enrollment} · {r.room}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: `${TINT}1A`, color: TINT }}
                    >
                      {r.purpose}
                    </span>
                  </td>
                  <td className="max-w-[180px] px-4 py-3 text-muted-foreground">
                    <p className="truncate">{r.destination}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">
                    <div className="flex flex-col leading-tight">
                      <span className="font-medium">{r.outTime}</span>
                      <span className="text-xs text-muted-foreground">{r.outDate}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">{r.expectedReturn}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-foreground">
                    {r.inTime ? (
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium">{r.inTime}</span>
                        <span className="text-xs text-muted-foreground">{r.inDate}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                    {r.gate}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setViewing(r)}
                        title="View"
                        className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                      {(r.status === "Outside" || r.status === "Overdue") && (
                        <button
                          onClick={() => markReturned(r)}
                          title="Mark Returned"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#22C55E]/10 px-2.5 py-1.5 text-xs font-medium text-[#16A34A] hover:bg-[#22C55E]/20"
                        >
                          <LogIn className="h-3.5 w-3.5" /> Return
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No entries match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View dialog */}
      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DoorOpen className="h-5 w-5" style={{ color: TINT }} />
                  Gate Log · {viewing.student}
                </DialogTitle>
                <DialogDescription>
                  {viewing.enrollment} · {viewing.hostel} · {viewing.room}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={MapPin} label="Destination" value={viewing.destination} />
                <InfoRow icon={User} label="Purpose" value={viewing.purpose} />
                <InfoRow icon={LogOut} label="Out" value={`${viewing.outDate} · ${viewing.outTime}`} />
                <InfoRow icon={Clock} label="Expected Return" value={viewing.expectedReturn} />
                <InfoRow
                  icon={LogIn}
                  label="Actual Return"
                  value={viewing.inTime ? `${viewing.inDate} · ${viewing.inTime}` : "— Not returned"}
                />
                <InfoRow icon={DoorClosed} label="Gate" value={viewing.gate} />
                <InfoRow icon={ScanLine} label="Method" value={viewing.method} />
                <InfoRow icon={User} label="Logged By" value={viewing.loggedBy} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <StatusPill status={viewing.status} />
                  </div>
                </div>
                {viewing.remarks && (
                  <p className="max-w-[60%] text-right text-xs text-muted-foreground">
                    {viewing.remarks}
                  </p>
                )}
              </div>

              <DialogFooter>
                {(viewing.status === "Outside" || viewing.status === "Overdue") && (
                  <Button
                    onClick={() => {
                      markReturned(viewing);
                      setViewing(null);
                    }}
                    className="bg-[#22C55E] hover:bg-[#16a34a]"
                  >
                    <LogIn className="mr-1.5 h-4 w-4" /> Mark Returned
                  </Button>
                )}
                <Button variant="outline" onClick={() => setViewing(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* QR Scanner placeholder */}
      <Dialog open={scannerOpen} onOpenChange={setScannerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" style={{ color: TINT }} />
              QR Scanner
            </DialogTitle>
            <DialogDescription>
              Point the camera at the student ID card QR code to auto-log entry or exit.
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-square overflow-hidden rounded-xl border-2 border-dashed border-[#7B4CED]/40 bg-gradient-to-br from-[#7B4CED]/5 to-[#2563EB]/5">
            <div className="absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#7B4CED]/10 text-[#7B4CED]">
                  <Camera className="h-8 w-8" />
                </span>
                <p className="text-sm font-medium text-foreground">Camera preview</p>
                <p className="max-w-[220px] text-xs text-muted-foreground">
                  Scanner integration will activate the device camera and decode QR codes here.
                </p>
              </div>
            </div>
            {/* Scanning frame */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute left-0 top-0 h-6 w-6 border-l-2 border-t-2 border-[#7B4CED]" />
              <span className="absolute right-0 top-0 h-6 w-6 border-r-2 border-t-2 border-[#7B4CED]" />
              <span className="absolute bottom-0 left-0 h-6 w-6 border-b-2 border-l-2 border-[#7B4CED]" />
              <span className="absolute bottom-0 right-0 h-6 w-6 border-b-2 border-r-2 border-[#7B4CED]" />
              <span className="absolute left-0 top-1/2 h-0.5 w-full animate-pulse bg-[#7B4CED]/60" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScannerOpen(false)}>
              Close
            </Button>
            <Button
              style={{ backgroundColor: TINT }}
              onClick={() => {
                toast.info("QR Scanner is a placeholder — connect a decoder to enable.");
                setScannerOpen(false);
              }}
            >
              <ScanLine className="mr-1.5 h-4 w-4" /> Simulate Scan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Entry dialog */}
      <ManualEntryDialog
        open={manualOpen}
        onOpenChange={setManualOpen}
        onSubmit={(student, form) => {
          registerExit(student, form);
          setManualOpen(false);
        }}
      />

      {/* Student Search dialog */}
      <Dialog open={studentPickerOpen} onOpenChange={setStudentPickerOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5" style={{ color: TINT }} />
              Student Search
            </DialogTitle>
            <DialogDescription>
              Find a resident by name, enrollment number or room.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={studentQ}
              onChange={(e) => setStudentQ(e.target.value)}
              placeholder="Search students…"
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground"
            />
          </div>
          <div className="max-h-80 overflow-y-auto rounded-lg border border-border">
            {filteredStudents.map((st) => {
              const activeOut = rows.find(
                (r) => r.studentId === st.id && (r.status === "Outside" || r.status === "Overdue"),
              );
              return (
                <div
                  key={st.id}
                  className="flex items-center justify-between border-b border-border p-3 last:border-b-0"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, ${TINT}, #2563EB)` }}
                    >
                      {st.name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{st.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {st.enrollment} · {st.hostel} · {st.room}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {activeOut ? (
                      <Button
                        size="sm"
                        className="bg-[#22C55E] hover:bg-[#16a34a]"
                        onClick={() => {
                          markReturned(activeOut);
                          setStudentPickerOpen(false);
                        }}
                      >
                        <LogIn className="mr-1.5 h-3.5 w-3.5" /> Mark In
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        style={{ backgroundColor: TINT }}
                        onClick={() => {
                          registerExit(st, { purpose: "Personal", destination: "Off-campus", expectedReturn: "21:00" });
                          setStudentPickerOpen(false);
                        }}
                      >
                        <LogOut className="mr-1.5 h-3.5 w-3.5" /> Log Exit
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredStudents.length === 0 && (
              <p className="p-6 text-center text-sm text-muted-foreground">No students found.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
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
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function QuickCard({
  title,
  desc,
  icon: Icon,
  tint,
  cta,
  onClick,
}: {
  title: string;
  desc: string;
  icon: typeof QrCode;
  tint: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--hover)] hover:shadow-md"
      style={{ ["--hover" as string]: tint }}
    >
      <span
        className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
        style={{ backgroundColor: `${tint}1A`, color: tint }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
        <p
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold"
          style={{ color: tint }}
        >
          {cta} →
        </p>
      </div>
    </button>
  );
}

function ManualEntryDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (student: (typeof students)[number], form: Partial<InOutEntry>) => void;
}) {
  const [studentId, setStudentId] = useState<string>(students[0]?.id ?? "");
  const [purpose, setPurpose] = useState<InOutPurpose>("Personal");
  const [destination, setDestination] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("21:00");
  const [gate, setGate] = useState<InOutEntry["gate"]>("Hostel Gate");

  const submit = () => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;
    if (!destination.trim()) {
      toast.error("Please enter a destination.");
      return;
    }
    onSubmit(student, { purpose, destination, expectedReturn, gate, method: "Manual" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" style={{ color: TINT }} />
            Manual Exit Entry
          </DialogTitle>
          <DialogDescription>
            Log a student exit manually when the QR scanner is unavailable.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Student" full>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.enrollment} · {s.room}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Purpose">
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value as InOutPurpose)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            >
              {(["Class", "Personal", "Medical", "Home Visit", "Sports", "Library", "Other"] as InOutPurpose[]).map(
                (p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ),
              )}
            </select>
          </Field>
          <Field label="Gate">
            <select
              value={gate}
              onChange={(e) => setGate(e.target.value as InOutEntry["gate"])}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            >
              <option>Hostel Gate</option>
              <option>Main Gate</option>
              <option>Side Gate</option>
            </select>
          </Field>
          <Field label="Destination" full>
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Sion Hospital, Home, Library…"
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            />
          </Field>
          <Field label="Expected Return">
            <input
              type="time"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            />
          </Field>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} style={{ backgroundColor: TINT }}>
            <LogOut className="mr-1.5 h-4 w-4" /> Register Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
