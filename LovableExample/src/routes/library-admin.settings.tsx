import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { LibraryPagePlaceholder } from "@/components/library/LibraryPagePlaceholder";

export const Route = createFileRoute("/library-admin/settings")({
  component: () => (
    <LibraryPagePlaceholder
      title="Settings"
      description="Loan durations, fine rates and notification rules."
      icon={Settings}
      tint="#0D9488"
      breadcrumbs={[{ label: "Settings" }]}
    />
  ),
});
