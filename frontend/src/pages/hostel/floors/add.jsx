import { createFileRoute } from "@/routes/compat";
import { PlusCircle } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { FloorForm } from "@/components/hostel/FloorForm";
const Route = createFileRoute("/hostel-admin/floors/add")({
  component: AddFloorPage
});
function AddFloorPage() {
  return <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <HostelPageHeader
    title="Add Floor"
    description="Create a new floor within a block."
    icon={PlusCircle}
    tint="#7B4CED"
    breadcrumbs={[
      { label: "Floor Management", to: "/hostel-admin/floors" },
      { label: "Add Floor" }
    ]}
  />
      <FloorForm mode="add" />
    </div>;
}
export {
  Route
};
