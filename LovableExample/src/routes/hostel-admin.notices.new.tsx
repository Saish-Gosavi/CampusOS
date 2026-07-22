import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { NoticeForm, type NoticeFormValues } from "@/components/hostel/NoticeForm";
import { NoticePreviewDialog } from "@/components/hostel/NoticePreviewDialog";
import { toast } from "sonner";

export const Route = createFileRoute("/hostel-admin/notices/new")({
  component: CreateNoticePage,
});

function CreateNoticePage() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<NoticeFormValues | null>(null);

  const handleSubmit = (values: NoticeFormValues, status: "Published" | "Draft" | "Scheduled" | "Expired") => {
    if (!values.title.trim() || !values.body.trim()) {
      toast.error("Title and description are required");
      return;
    }
    toast.success(status === "Draft" ? "Notice saved as draft" : `Notice published to ${values.audience}`);
    navigate({ to: "/hostel-admin/notices" });
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Create Notice"
        description="Compose a new notice and target the right audience."
        icon={Megaphone}
        tint="#EAB308"
        breadcrumbs={[{ label: "Notice Board", to: "/hostel-admin/notices" }, { label: "Create" }]}
      />
      <NoticeForm onSubmit={handleSubmit} onPreview={setPreview} />
      <NoticePreviewDialog values={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
