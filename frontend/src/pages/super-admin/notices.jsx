import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { PagePlaceholder } from "@/components/admin/PagePlaceholder";
const Route = createFileRoute("/super-admin/notices")({
  component: () => <PagePlaceholder
    title="Global Notices"
    description="Publish announcements across colleges and modules."
    icon={Megaphone}
    tint="#EAB308"
    breadcrumbs={[{ label: "Global Notices" }]}
  />
});
export {
  Route
};
