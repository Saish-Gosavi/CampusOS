import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Download,
  BedDouble,
  IdCard
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { students } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/students/")({
  component: StudentsPage
});
const PAGE_SIZE = 6;
function exportCsv(rows) {
  const header = [
    "Name",
    "Enrollment",
    "Department",
    "Year",
    "Gender",
    "Hostel",
    "Room",
    "Contact",
    "Parent Contact",
    "Status"
  ];
  const body = rows.map(
    (s) => [s.name, s.enrollment, s.department, s.year, s.gender, s.hostel, s.room, s.contact, s.parentContact, s.status].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
  );
  const csv = [header.join(","), ...body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
  URL.revokeObjectURL(url);
}
function StudentsPage() {
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("All");
  const [year, setYear] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const depts = useMemo(() => ["All", ...Array.from(new Set(students.map((s) => s.department)))], []);
  const years = ["All", "1", "2", "3", "4"];
  const statuses = ["All", "Active", "On Leave", "Alumni"];
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return students.filter((s) => {
      const matchesQ = !query || s.name.toLowerCase().includes(query) || s.enrollment.toLowerCase().includes(query) || s.room.toLowerCase().includes(query) || s.contact.includes(query);
      const matchesDept = dept === "All" || s.department === dept;
      const matchesYear = year === "All" || String(s.year) === year;
      const matchesStatus = status === "All" || s.status === status;
      return matchesQ && matchesDept && matchesYear && matchesStatus;
    });
  }, [q, dept, year, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Student Management"
    description="Search, filter and manage every hostel resident."
    icon={Users}
    tint="#2563EB"
    breadcrumbs={[{ label: "Student Management" }]}
    action={<div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => exportCsv(filtered)}>
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
            <Button asChild className="bg-[#2563EB] hover:bg-[#1e4fd1]">
              <Link to="/hostel-admin/students/add">
                <Plus className="mr-1.5 h-4 w-4" /> Add Student
              </Link>
            </Button>
          </div>}
  />

      {
    /* Quick summary cards */
  }
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
    { label: "Total", value: students.length, tint: "#2563EB" },
    { label: "Active", value: students.filter((s) => s.status === "Active").length, tint: "#22C55E" },
    { label: "On Leave", value: students.filter((s) => s.status === "On Leave").length, tint: "#EAB308" },
    { label: "Alumni", value: students.filter((s) => s.status === "Alumni").length, tint: "#6B7280" }
  ].map((c) => <div key={c.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold" style={{ color: c.tint }}>
              {c.value}
            </p>
          </div>)}
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
    value={q}
    onChange={(e) => {
      setQ(e.target.value);
      setPage(1);
    }}
    placeholder="Search by name, enrollment, room or contact"
    className="h-10 pl-9"
  />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select value={dept} onChange={(e) => {
    setDept(e.target.value);
    setPage(1);
  }} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
              {depts.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select value={year} onChange={(e) => {
    setYear(e.target.value);
    setPage(1);
  }} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
              {years.map((y) => <option key={y} value={y}>{y === "All" ? "All Years" : `Year ${y}`}</option>)}
            </select>
            <select value={status} onChange={(e) => {
    setStatus(e.target.value);
    setPage(1);
  }} className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground">
              {statuses.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Student</th>
                <th className="px-3 py-2 font-medium">Enrollment</th>
                <th className="px-3 py-2 font-medium">Department</th>
                <th className="px-3 py-2 font-medium">Year</th>
                <th className="px-3 py-2 font-medium">Gender</th>
                <th className="px-3 py-2 font-medium">Hostel</th>
                <th className="px-3 py-2 font-medium">Room</th>
                <th className="px-3 py-2 font-medium">Contact</th>
                <th className="px-3 py-2 font-medium">Parent</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {current.map((s) => <tr key={s.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                        {s.photo}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.enrollment}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.department}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">Year {s.year}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.gender}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.hostel}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.room}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.contact}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{s.parentContact}</td>
                  <td className="px-3 py-3"><StatusPill status={s.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to="/hostel-admin/students/$id" params={{ id: s.id }} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" title="View">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link to="/hostel-admin/students/$id/edit" params={{ id: s.id }} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link to="/hostel-admin/allocation" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#7B4CED]/10 hover:text-[#7B4CED]" title="Allocate Room">
                        <BedDouble className="h-4 w-4" />
                      </Link>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EAB308]/10 hover:text-[#B45309]" title="Generate ID Card">
                        <IdCard className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
              {current.length === 0 && <tr>
                  <td colSpan={11} className="px-3 py-10 text-center text-sm text-muted-foreground">
                    No students match your filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    disabled={page === 1}
    className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-50"
  >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <button
    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    disabled={page === totalPages}
    className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-50"
  >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Route
};
