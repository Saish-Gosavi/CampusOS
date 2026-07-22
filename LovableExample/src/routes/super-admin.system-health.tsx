import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { PagePlaceholder } from "@/components/admin/PagePlaceholder";

export const Route = createFileRoute("/super-admin/system-health")({
  component: () => (
    <PagePlaceholder
      title="System Health"
      description="Monitor uptime, service status, and platform-wide diagnostics."
      icon={Activity}
      tint="#22C55E"
      breadcrumbs={[{ label: "System Health" }]}
    />
  ),
});
