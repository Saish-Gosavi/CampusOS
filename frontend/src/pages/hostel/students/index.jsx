import React, { useState } from "react";
import { createFileRoute } from "@/routes/compat";
import { Search, GraduationCap } from "lucide-react";
import { StudentTable } from "@/components/hostel/students/StudentTable";
import { AddStudentDialog } from "@/components/hostel/students/AddStudentDialog";

const Route = createFileRoute("/hostel-admin/students")({
  component: StudentManagementPage
});

function StudentManagementPage() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.enrollmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.room && s.room.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Student Management
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage all enrolled hostel students, view their records, and allocate rooms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddStudentDialog onAddStudent={handleAddStudent} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card shadow-sm p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, enrollment ID, or room..."
              className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <StudentTable students={filteredStudents} />
      </div>
    </div>
  );
}

export default StudentManagementPage;
export { Route };
