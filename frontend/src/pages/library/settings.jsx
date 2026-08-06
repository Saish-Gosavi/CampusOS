import { createFileRoute } from "@/routes/compat";
import { Settings } from "lucide-react";
import { LibraryPagePlaceholder } from "@/components/library/LibraryPagePlaceholder";
const Route = createFileRoute("/library-admin/settings")({
  component: () => <LibraryPagePlaceholder
    title="Settings"
    description="Loan durations, fine rates and notification rules."
    icon={Settings}
    tint="#0D9488"
    breadcrumbs={[{ label: "Settings" }]}
  />
});
export {
  Route
};
