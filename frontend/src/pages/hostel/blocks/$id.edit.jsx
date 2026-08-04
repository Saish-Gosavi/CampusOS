import { createFileRoute, notFound } from "@/routes/compat";
import { Pencil } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { BlockForm } from "@/components/hostel/BlockForm";
import { blocks } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/blocks/$id/edit")({
  component: EditBlockPage
});
function EditBlockPage() {
  const { id } = Route.useParams();
  const block = blocks.find((b) => b.id === id);
  if (!block) throw notFound();
  return <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <HostelPageHeader
    title={`Edit ${block.name}`}
    description="Update block details and status."
    icon={Pencil}
    tint="#2563EB"
    breadcrumbs={[
      { label: "Block Management", to: "/hostel-admin/blocks" },
      { label: `Edit ${block.name}` }
    ]}
  />
      <BlockForm mode="edit" block={block} />
    </div>;
}
export {
  Route
};
