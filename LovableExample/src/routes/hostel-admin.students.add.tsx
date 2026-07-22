import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StudentForm } from "@/components/hostel/StudentForm";

export const Route = createFileRoute("/hostel-admin/students/add")({
  component: AddStudentPage,
});

function AddStudentPage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <HostelPageHeader
        title="Add Student"
        description="Register a new hostel resident with academic and guardian details."
        icon={UserPlus}
        tint="#2563EB"
        breadcrumbs={[
          { label: "Student Management", to: "/hostel-admin/students" },
          { label: "Add Student" },
        ]}
      />
      <StudentForm mode="add" />
    </div>
  );
}
