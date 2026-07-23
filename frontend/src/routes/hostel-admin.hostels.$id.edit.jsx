import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { HostelForm } from "@/components/hostel/HostelForm";
import { Button } from "@/components/ui/button";
import { hostels } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/hostels/$id/edit")({
  loader: ({ params }) => {
    const hostel = hostels.find((h) => h.id === params.id);
    if (!hostel) throw notFound();
    return { hostel };
  },
  component: EditHostelPage,
  notFoundComponent: () => <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="text-xl font-semibold text-foreground">Hostel not found</h2>
      <Button asChild className="mt-4"><Link to="/hostel-admin/hostels">Back to hostels</Link></Button>
    </div>
});
function EditHostelPage() {
  const { hostel } = Route.useLoaderData();
  return <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <HostelPageHeader
    title={`Edit \u2014 ${hostel.name}`}
    description="Update hostel details and warden assignment."
    icon={Pencil}
    tint="#2563EB"
    breadcrumbs={[
      { label: "Hostel Management", to: "/hostel-admin/hostels" },
      { label: hostel.name, to: `/hostel-admin/hostels/${hostel.id}` },
      { label: "Edit" }
    ]}
  />
      <HostelForm mode="edit" initial={hostel} />
    </div>;
}
export {
  Route
};
