import { createFileRoute } from "@tanstack/react-router";
import { UserCircle2 } from "lucide-react";
import { PagePlaceholder } from "@/components/admin/PagePlaceholder";

export const Route = createFileRoute("/super-admin/profile")({
  component: () => (
    <PagePlaceholder
      title="Profile"
      description="Manage your Super Admin identity and security settings."
      icon={UserCircle2}
      tint="#7B4CED"
      breadcrumbs={[{ label: "Profile" }]}
    />
  ),
});
