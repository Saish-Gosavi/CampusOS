import { createFileRoute, notFound } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { RoomForm } from "@/components/hostel/RoomForm";
import { rooms } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/rooms/$id/edit")({
  component: EditRoomPage
});
function EditRoomPage() {
  const { id } = Route.useParams();
  const room = rooms.find((r) => r.id === id);
  if (!room) throw notFound();
  return <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <HostelPageHeader
    title={`Edit Room ${room.number}`}
    description="Update room details, capacity and status."
    icon={Pencil}
    tint="#7B4CED"
    breadcrumbs={[
      { label: "Room Management", to: "/hostel-admin/rooms" },
      { label: `Edit Room ${room.number}` }
    ]}
  />
      <RoomForm mode="edit" room={room} />
    </div>;
}
export {
  Route
};
