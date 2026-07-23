import { createFileRoute, notFound } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { FloorForm } from "@/components/hostel/FloorForm";
import { floors } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/floors/$id/edit")({
  component: EditFloorPage
});
function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
function EditFloorPage() {
  const { id } = Route.useParams();
  const floor = floors.find((f) => f.id === id);
  if (!floor) throw notFound();
  const label = `${ordinal(floor.number)} Floor`;
  return <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <HostelPageHeader
    title={`Edit ${label}`}
    description="Update floor details, room count and status."
    icon={Pencil}
    tint="#7B4CED"
    breadcrumbs={[
      { label: "Floor Management", to: "/hostel-admin/floors" },
      { label: `Edit ${label}` }
    ]}
  />
      <FloorForm mode="edit" floor={floor} />
    </div>;
}
export {
  Route
};
