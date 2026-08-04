import { createFileRoute } from "@/routes/compat";
import { PlusCircle } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { HostelForm } from "@/components/hostel/HostelForm";
const Route = createFileRoute("/hostel-admin/hostels/add")({
  component: AddHostelPage
});
function AddHostelPage() {
  return <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <HostelPageHeader
    title="Add Hostel"
    description="Register a new hostel building on campus."
    icon={PlusCircle}
    tint="#2563EB"
    breadcrumbs={[
      { label: "Hostel Management", to: "/hostel-admin/hostels" },
      { label: "Add Hostel" }
    ]}
  />
      <HostelForm mode="add" />
    </div>;
}
export {
  Route
};
