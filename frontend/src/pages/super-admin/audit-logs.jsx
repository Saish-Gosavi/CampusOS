import { createFileRoute } from "@tanstack/react-router";
import { ScrollText } from "lucide-react";
import { PagePlaceholder } from "@/components/admin/PagePlaceholder";
const Route = createFileRoute("/super-admin/audit-logs")({
  component: () => <PagePlaceholder
    title="Audit Logs"
    description="Track every change made by admins across the portal."
    icon={ScrollText}
    tint="#7B4CED"
    breadcrumbs={[{ label: "Audit Logs" }]}
  />
});
export {
  Route
};
