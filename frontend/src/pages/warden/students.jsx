import { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  Users,
  Search,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  Building,
  UserCheck,
  BedDouble,
  GraduationCap
} from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { wardenStudentApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/warden/students")({
  component: StudentsPage
});

const PER_PAGE = 8;
const TINT = "#2563EB";

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await wardenStudentApi.getAll();
      const data = res?.data || res || [];
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load students:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const userStatus = s.user?.status || s.status || "active";
      if (status !== "All" && userStatus.toLowerCase() !== status.toLowerCase()) return false;
      if (q) {
        const t = q.toLowerCase();
        const nameMatch = (s.fullName || s.name || "").toLowerCase().includes(t);
        const collegeIdMatch = (s.collegeId || s.enrollment || "").toLowerCase().includes(t);
        const emailMatch = (s.user?.email || s.email || "").toLowerCase().includes(t);
        const phoneMatch = (s.phone || "").toLowerCase().includes(t);
        return nameMatch || collegeIdMatch || emailMatch || phoneMatch;
      }
      return true;
    });
  }, [students, q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleOpenView = (student) => {
    setSelectedStudent(student);
    setIsViewOpen(true);
  };

  const handleExportCSV = () => {
    if (!filtered.length) {
      toast.error("No student records to export.");
      return;
    }
    const headers = ["ID,Full Name,College ID,Email,Phone,Hostel,Status\n"];
    const rows = filtered.map((s) => {
      const hostel = s.user?.hostel?.name || "N/A";
      const statusStr = s.user?.status || "active";
      return `"${s.id}","${s.fullName || ""}","${s.collegeId || ""}","${s.user?.email || ""}","${s.phone || ""}","${hostel}","${statusStr}"\n`;
    });
    const blob = new Blob([headers.concat(rows).join("")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Warden_Students_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Student roster CSV downloaded.");
  };

  const getInitials = (name) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getRoomInfo = (student) => {
    const alloc = student.allocations?.[0];
    if (!alloc || !alloc.bed) return "Unallocated";
    const bed = alloc.bed;
    const room = bed.room;
    const block = room?.floor?.block;
    return `Room ${room?.number || "N/A"} (${block?.name || "Block"}) - Bed ${bed.number || ""}`;
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Students"
        description="Read-only roster of resident students in your assigned hostels."
        icon={Users}
        tint={TINT}
        breadcrumbs={[{ label: "Students" }]}
        action={
          <Button variant="outline" onClick={handleExportCSV}>
            <Download className="mr-1.5 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        {/* Search & Filter Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, college ID, email or phone..."
              className="h-10 pl-9"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-3 pr-2">Student</th>
                <th className="py-3 pr-2">College ID</th>
                <th className="py-3 pr-2">Contact Info</th>
                <th className="py-3 pr-2">Allocated Room</th>
                <th className="py-3 pr-2">Status</th>
                <th className="py-3 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    Loading student residents...
                  </td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    No student residents found.
                  </td>
                </tr>
              ) : (
                paged.map((s) => {
                  const studentStatus = s.user?.status || s.status || "active";
                  return (
                    <tr key={s.id} className="border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                            {getInitials(s.fullName)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{s.fullName}</p>
                            <p className="truncate text-xs text-muted-foreground">{s.user?.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-2 font-mono text-xs font-semibold text-primary">{s.collegeId}</td>
                      <td className="py-3 pr-2 text-xs">
                        <p className="font-medium text-foreground">{s.phone || "N/A"}</p>
                        <p className="text-muted-foreground">{s.user?.hostel?.name || "Assigned Hostel"}</p>
                      </td>
                      <td className="py-3 pr-2 text-xs font-medium">{getRoomInfo(s)}</td>
                      <td className="py-3 pr-2">
                        <StatusPill status={studentStatus} />
                      </td>
                      <td className="py-3 pr-2">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View resident profile"
                            onClick={() => handleOpenView(s)}
                            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {paged.length} of {filtered.length} residents
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Resident Profile Modal */}
      {isViewOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-sm font-bold text-white">
                  {getInitials(selectedStudent.fullName)}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-muted-foreground">College ID: {selectedStudent.collegeId}</p>
                </div>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 bg-muted/20">
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</p>
                  <p className="font-medium text-foreground truncate">{selectedStudent.user?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Contact</p>
                  <p className="font-medium text-foreground">{selectedStudent.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Building className="h-3.5 w-3.5" /> Hostel</p>
                  <p className="font-medium text-foreground">{selectedStudent.user?.hostel?.name || "Assigned Hostel"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><UserCheck className="h-3.5 w-3.5" /> Status</p>
                  <StatusPill status={selectedStudent.user?.status || selectedStudent.status || "active"} />
                </div>
              </div>

              <div className="rounded-lg border border-border p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5 text-primary" /> Room Allocation Details
                </p>
                <p className="text-sm font-medium text-foreground">{getRoomInfo(selectedStudent)}</p>
              </div>

              {selectedStudent.department && (
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1 flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 text-purple-600" /> Academic Details
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {selectedStudent.department} {selectedStudent.year ? `· ${selectedStudent.year}` : ""}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-end">
              <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
