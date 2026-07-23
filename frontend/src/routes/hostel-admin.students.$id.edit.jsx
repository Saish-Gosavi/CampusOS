import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StudentForm } from "@/components/hostel/StudentForm";
import { Button } from "@/components/ui/button";
import { students } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/students/$id/edit")({
  loader: ({ params }) => {
    const student = students.find((s) => s.id === params.id);
    if (!student) throw notFound();
    return { student };
  },
  component: EditStudentPage,
  notFoundComponent: () => <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="text-xl font-semibold text-foreground">Student not found</h2>
      <Button asChild className="mt-4"><Link to="/hostel-admin/students">Back to list</Link></Button>
    </div>
});
function EditStudentPage() {
  const { student } = Route.useLoaderData();
  return <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <HostelPageHeader
    title={`Edit \u2014 ${student.name}`}
    description="Update the student's academic, guardian and hostel record."
    icon={Pencil}
    tint="#2563EB"
    breadcrumbs={[
      { label: "Student Management", to: "/hostel-admin/students" },
      { label: student.name, to: `/hostel-admin/students/${student.id}` },
      { label: "Edit" }
    ]}
  />
      <StudentForm mode="edit" initial={student} />
    </div>;
}
export {
  Route
};
