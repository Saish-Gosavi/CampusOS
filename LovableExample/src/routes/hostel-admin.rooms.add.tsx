import { createFileRoute } from "@tanstack/react-router";
import { PlusCircle } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { RoomForm } from "@/components/hostel/RoomForm";

export const Route = createFileRoute("/hostel-admin/rooms/add")({
  component: AddRoomPage,
});

function AddRoomPage() {
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <HostelPageHeader
        title="Add Room"
        description="Create a new room within a floor."
        icon={PlusCircle}
        tint="#7B4CED"
        breadcrumbs={[
          { label: "Room Management", to: "/hostel-admin/rooms" },
          { label: "Add Room" },
        ]}
      />
      <RoomForm mode="add" />
    </div>
  );
}
