import { useState } from "react";
import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { NoticeForm } from "@/components/hostel/NoticeForm";
import { NoticePreviewDialog } from "@/components/hostel/NoticePreviewDialog";
import { notices } from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/hostel-admin/notices/$id/edit")({
  loader: ({ params }) => {
    const notice = notices.find((n) => n.id === params.id);
    if (!notice) throw notFound();
    return { notice };
  },
  component: EditNoticePage,
  notFoundComponent: () => <div className="mx-auto max-w-md p-10 text-center text-sm text-muted-foreground">Notice not found.</div>
});
function EditNoticePage() {
  const { notice } = Route.useLoaderData();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const handleSubmit = (values, status) => {
    if (!values.title.trim() || !values.body.trim()) {
      toast.error("Title and description are required");
      return;
    }
    toast.success(status === "Draft" ? "Draft updated" : "Notice updated");
    navigate({ to: "/hostel-admin/notices" });
  };
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Edit Notice"
    description={`Update "${notice.title}" and republish.`}
    icon={Megaphone}
    tint="#EAB308"
    breadcrumbs={[
      { label: "Notice Board", to: "/hostel-admin/notices" },
      { label: "Edit" }
    ]}
  />
      <NoticeForm initial={notice} onSubmit={handleSubmit} onPreview={setPreview} />
      <NoticePreviewDialog values={preview} onClose={() => setPreview(null)} />
    </div>;
}
export {
  Route
};
