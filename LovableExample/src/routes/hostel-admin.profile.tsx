import { createFileRoute } from "@tanstack/react-router";
import { UserCircle2 } from "lucide-react";
import { HostelPagePlaceholder } from "@/components/hostel/HostelPagePlaceholder";

export const Route = createFileRoute("/hostel-admin/profile")({
  component: () => (
    <HostelPagePlaceholder
      title="Profile"
      description="Manage your Hostel Admin account and security preferences."
      icon={UserCircle2}
      tint="#7B4CED"
      breadcrumbs={[{ label: "Profile" }]}
    />
  ),
});
