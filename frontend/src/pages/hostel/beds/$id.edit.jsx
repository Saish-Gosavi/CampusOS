import { createFileRoute, Link, useParams } from "@/routes/compat";
import { Pencil } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { BedForm } from "@/components/hostel/BedForm";
import { Button } from "@/components/ui/button";
import { beds } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/beds/$id/edit")({
  component: EditBedPage
});
function EditBedPage() {
  const { id } = useParams({ from: "/hostel-admin/beds/$id/edit" });
  const bed = beds.find((b) => b.id === id);
  if (!bed) {
    return <div className="mx-auto max-w-[1100px]">
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">Bed not found.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/hostel-admin/beds">Back to Beds</Link>
          </Button>
        </div>
      </div>;
  }
  return <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <HostelPageHeader
    title={`Edit Bed ${bed.number}`}
    description="Update bed allocation, status, or assignment."
    icon={Pencil}
    tint="#2563EB"
    breadcrumbs={[
      { label: "Bed Management", to: "/hostel-admin/beds" },
      { label: `Edit ${bed.number}` }
    ]}
  />
      <BedForm mode="edit" bed={bed} />
    </div>;
}
export {
  Route
};
