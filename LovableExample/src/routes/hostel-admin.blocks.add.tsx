import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { BlockForm } from "@/components/hostel/BlockForm";

export const Route = createFileRoute("/hostel-admin/blocks/add")({
  component: AddBlockPage,
});

function AddBlockPage() {
  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <HostelPageHeader
        title="Add Block"
        description="Create a new block inside a hostel building."
        icon={PlusCircle}
        tint="#2563EB"
        breadcrumbs={[
          { label: "Block Management", to: "/hostel-admin/blocks" },
          { label: "Add Block" },
        ]}
      />
      <BlockForm mode="add" />
    </div>
  );
}
