import { createFileRoute } from "@/routes/compat";
import { UserCircle2 } from "lucide-react";
import { InventoryPagePlaceholder } from "@/components/inventory/InventoryPagePlaceholder";
const Route = createFileRoute("/inventory-admin/profile")({
  component: () => <InventoryPagePlaceholder
    title="Profile"
    description="Your inventory admin profile and contact preferences."
    icon={UserCircle2}
    tint="#2563EB"
    breadcrumbs={[{ label: "Profile" }]}
  />
});
export {
  Route
};
