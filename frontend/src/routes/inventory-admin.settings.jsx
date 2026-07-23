import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { InventoryPagePlaceholder } from "@/components/inventory/InventoryPagePlaceholder";
const Route = createFileRoute("/inventory-admin/settings")({
  component: () => <InventoryPagePlaceholder
    title="Settings"
    description="Reorder thresholds, approval workflows and notification rules."
    icon={Settings}
    tint="#2563EB"
    breadcrumbs={[{ label: "Settings" }]}
  />
});
export {
  Route
};
