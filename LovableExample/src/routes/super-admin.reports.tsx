import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PagePlaceholder } from "@/components/admin/PagePlaceholder";

export const Route = createFileRoute("/super-admin/reports")({
  component: () => (
    <PagePlaceholder
      title="Reports"
      description="Cross-module analytics, exports, and scheduled reports."
      icon={BarChart3}
      tint="#3B82F6"
      breadcrumbs={[{ label: "Reports" }]}
    />
  ),
});
