import { createFileRoute } from "@/routes/compat";
import { PlusCircle } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { BedForm } from "@/components/hostel/BedForm";
const Route = createFileRoute("/hostel-admin/beds/add")({
  component: AddBedPage
});
function AddBedPage() {
  return <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <HostelPageHeader
    title="Add Bed"
    description="Create a new bed inside a room."
    icon={PlusCircle}
    tint="#2563EB"
    breadcrumbs={[
      { label: "Bed Management", to: "/hostel-admin/beds" },
      { label: "Add Bed" }
    ]}
  />
      <BedForm mode="add" />
    </div>;
}
export {
  Route
};
