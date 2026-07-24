import { createFileRoute } from "@tanstack/react-router";
import { UserCircle2 } from "lucide-react";
import { LibraryPagePlaceholder } from "@/components/library/LibraryPagePlaceholder";
const Route = createFileRoute("/library-admin/profile")({
  component: () => <LibraryPagePlaceholder
    title="Profile"
    description="Your library admin profile and contact preferences."
    icon={UserCircle2}
    tint="#0D9488"
    breadcrumbs={[{ label: "Profile" }]}
  />
});
export {
  Route
};
