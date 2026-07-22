import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  Megaphone,
  Pencil,
  Trash2,
  Pin,
  Paperclip,
  Calendar,
  Users,
  Building2,
  ArrowLeft,
  Download,
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { notices } from "@/lib/hostel-data";
import { toast } from "sonner";

export const Route = createFileRoute("/hostel-admin/notices/$id/")({
  loader: ({ params }) => {
    const notice = notices.find((n) => n.id === params.id);
    if (!notice) throw notFound();
    return { notice };
  },
  component: PreviewNoticePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-10 text-center text-sm text-muted-foreground">Notice not found.</div>
  ),
});

const TINT = "#EAB308";

function PreviewNoticePage() {
  const { notice } = Route.useLoaderData();
  const navigate = useNavigate();

  const remove = () => {
    toast.success(`Notice "${notice.title}" deleted`);
    navigate({ to: "/hostel-admin/notices" });
  };

  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <HostelPageHeader
        title="Preview Notice"
        description="How this notice appears to residents."
        icon={Megaphone}
        tint={TINT}
        breadcrumbs={[
          { label: "Notice Board", to: "/hostel-admin/notices" },
          { label: "Preview" },
        ]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/hostel-admin/notices">
              <Button variant="outline"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back</Button>
            </Link>
            <Link to="/hostel-admin/notices/$id/edit" params={{ id: notice.id }}>
              <Button variant="outline"><Pencil className="mr-1.5 h-4 w-4" /> Edit</Button>
            </Link>
            <Button className="bg-[#EF4444] text-white hover:bg-[#dc2626]" onClick={remove}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div
            className="flex items-center justify-between px-6 py-4 text-white"
            style={{ background: "linear-gradient(90deg, #282648 0%, #211160 100%)" }}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/10">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-white/70">CampusOS · VPPCOE</p>
                <p className="text-sm font-semibold">Official Hostel Notice</p>
              </div>
            </div>
            {notice.pinned && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs">
                <Pin className="h-3 w-3" /> Pinned
              </span>
            )}
          </div>

          <div className="flex flex-col gap-5 p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ backgroundColor: "#EAB3081A", color: "#B45309" }}
              >
                {notice.category}
              </span>
              <StatusPill status={notice.status} />
              <span className="text-xs text-muted-foreground">· Published {notice.publishedAt}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">{notice.title}</h1>

            <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground">{notice.body}</p>

            {notice.attachment && (
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-background text-muted-foreground">
                    <Paperclip className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{notice.attachment.name}</p>
                    <p className="text-xs text-muted-foreground">{notice.attachment.size}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button>
              </div>
            )}

            <div className="mt-2 border-t border-border pt-4 text-sm text-muted-foreground">
              <p>Issued by <span className="font-medium text-foreground">{notice.author}</span></p>
              <p className="mt-0.5 text-xs">For queries, contact the Hostel Warden Office.</p>
            </div>
          </div>
        </article>

        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground">Publishing Details</h3>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div><p className="text-muted-foreground">Audience</p><p className="font-medium text-foreground">{notice.audience}</p></div>
              </li>
              <li className="flex items-start gap-2">
                <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div><p className="text-muted-foreground">Category</p><p className="font-medium text-foreground">{notice.category}</p></div>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div><p className="text-muted-foreground">Publish Date</p><p className="font-medium text-foreground">{notice.publishDate}</p></div>
              </li>
              <li className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div><p className="text-muted-foreground">Expiry Date</p><p className="font-medium text-foreground">{notice.expiryDate || "—"}</p></div>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground">Distribution</h3>
            <p className="mt-2 text-xs text-muted-foreground">Reach estimate for the selected audience.</p>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-foreground">312</p>
                <p className="text-[11px] text-muted-foreground">Recipients</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">248</p>
                <p className="text-[11px] text-muted-foreground">Delivered</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">176</p>
                <p className="text-[11px] text-muted-foreground">Viewed</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
