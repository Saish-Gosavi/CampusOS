import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PagePlaceholder } from "@/components/admin/PagePlaceholder";
const Route = createFileRoute("/super-admin/settings")({
  component: () => <PagePlaceholder
    title="Settings"
    description="Portal-wide preferences, branding, and integrations."
    icon={Settings}
    tint="#2563EB"
    breadcrumbs={[{ label: "Settings" }]}
  />
});
export {
  Route
};
