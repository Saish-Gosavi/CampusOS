import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Users, Search, Eye, DoorClosed, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { students } from "@/lib/hostel-data";
const Route = createFileRoute("/warden/students")({
  component: StudentsPage
});
const PER_PAGE = 6;
const TINT = "#2563EB";
function StudentsPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const departments = useMemo(() => ["All", ...Array.from(new Set(students.map((s) => s.department)))], []);
  const filtered = useMemo(() => {
    return students.filter((s) => {
      if (dept !== "All" && s.department !== dept) return false;
      if (status !== "All" && s.status !== status) return false;
      if (q) {
        const t = q.toLowerCase();
        return s.name.toLowerCase().includes(t) || s.enrollment.toLowerCase().includes(t) || s.room.toLowerCase().includes(t);
      }
      return true;
    });
  }, [q, dept, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Students"
    description="Read-only roster of residents in your assigned hostels."
    icon={Users}
    tint={TINT}
    breadcrumbs={[{ label: "Students" }]}
    action={<Button variant="outline">
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>}
  />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => {
    setQ(e.target.value);
    setPage(1);
  }} placeholder="Search by name, enrollment or room..." className="h-10 pl-9" />
          </div>
          <select value={dept} onChange={(e) => {
    setDept(e.target.value);
    setPage(1);
  }} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
            {departments.map((d) => <option key={d}>{d}</option>)}
          </select>
          <select value={status} onChange={(e) => {
    setStatus(e.target.value);
    setPage(1);
  }} className="h-10 rounded-lg border border-border bg-background px-3 text-sm">
            {["All", "Active", "On Leave", "Alumni"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-3 pr-2">Student</th>
                <th className="py-3 pr-2">Enrollment</th>
                <th className="py-3 pr-2">Dept</th>
                <th className="py-3 pr-2">Year</th>
                <th className="py-3 pr-2">Room</th>
                <th className="py-3 pr-2">Contact</th>
                <th className="py-3 pr-2">Guardian</th>
                <th className="py-3 pr-2">Status</th>
                <th className="py-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s) => <tr key={s.id} className="border-b border-border last:border-b-0 hover:bg-muted/40">
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">{s.photo}</span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.hostel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-2 font-mono text-xs">{s.enrollment}</td>
                  <td className="py-3 pr-2">{s.department}</td>
                  <td className="py-3 pr-2">{s.year}</td>
                  <td className="py-3 pr-2 font-medium">{s.room}</td>
                  <td className="py-3 pr-2 text-xs">{s.contact}</td>
                  <td className="py-3 pr-2 text-xs">
                    <p className="font-medium text-foreground">{s.father.name}</p>
                    <p className="text-muted-foreground">{s.parentContact}</p>
                  </td>
                  <td className="py-3 pr-2"><StatusPill status={s.status} /></td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center justify-end gap-1">
                      <button title="View profile" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button title="View room" className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                        <DoorClosed className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>)}
              {paged.length === 0 && <tr><td colSpan={9} className="py-10 text-center text-muted-foreground">No students found</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing {paged.length} of {filtered.length}</p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground">Page {page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Route
};
