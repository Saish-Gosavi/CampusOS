import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { HostelPagePlaceholder } from "@/components/hostel/HostelPagePlaceholder";
const Route = createFileRoute("/hostel-admin/settings")({
  component: () => <HostelPagePlaceholder
    title="Settings"
    description="Hostel-wide preferences, fee templates and notification rules."
    icon={Settings}
    tint="#2563EB"
    breadcrumbs={[{ label: "Settings" }]}
  />
});
export {
  Route
};
