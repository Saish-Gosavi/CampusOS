import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Megaphone,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Search,
  Pin,
  Paperclip,
  Calendar,
  Users,
  Filter,
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { notices as seed, type Notice, type NoticeCategory, type NoticeStatus } from "@/lib/hostel-data";
import { toast } from "sonner";

export const Route = createFileRoute("/hostel-admin/notices/")({
  component: NoticeListPage,
});

const TINT = "#EAB308";

const CATEGORY_TINT: Record<NoticeCategory, string> = {
  General: "#6B7280",
  Maintenance: "#3B82F6",
  Event: "#7B4CED",
  Emergency: "#EF4444",
  Academic: "#0D9488",
};

function NoticeListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Notice[]>(seed);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | NoticeStatus>("All");
  const [category, setCategory] = useState<"All" | NoticeCategory>("All");
  const [toDelete, setToDelete] = useState<Notice | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (status !== "All" && n.status !== status) return false;
      if (category !== "All" && n.category !== category) return false;
      if (q && !`${n.title} ${n.body} ${n.author}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, status, category]);

  const pinned = filtered.filter((n) => n.pinned);
  const regular = filtered.filter((n) => !n.pinned);

  const stats = useMemo(() => ({
    total: items.length,
    published: items.filter((n) => n.status === "Published").length,
    scheduled: items.filter((n) => n.status === "Scheduled").length,
    drafts: items.filter((n) => n.status === "Draft").length,
    expired: items.filter((n) => n.status === "Expired").length,
  }), [items]);

  const confirmDelete = () => {
    if (!toDelete) return;
    setItems((prev) => prev.filter((n) => n.id !== toDelete.id));
    toast.success(`Notice "${toDelete.title}" deleted`);
    setToDelete(null);
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Notice Board"
        description="Create, schedule and broadcast notices to hostel residents."
        icon={Megaphone}
        tint={TINT}
        breadcrumbs={[{ label: "Notice Board" }]}
        action={
          <Link to="/hostel-admin/notices/new">
            <Button style={{ backgroundColor: TINT }} className="text-slate-900 hover:opacity-90">
              <Plus className="mr-1.5 h-4 w-4" /> Create Notice
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          { label: "Total Notices", value: stats.total, tint: "#6B7280" },
          { label: "Published", value: stats.published, tint: "#22C55E" },
          { label: "Scheduled", value: stats.scheduled, tint: "#3B82F6" },
          { label: "Drafts", value: stats.drafts, tint: "#6B7280" },
          { label: "Expired", value: stats.expired, tint: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold" style={{ color: s.tint }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, content or author..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="All">All Status</option>
            <option>Published</option>
            <option>Scheduled</option>
            <option>Draft</option>
            <option>Expired</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
          >
            <option value="All">All Categories</option>
            <option>General</option>
            <option>Maintenance</option>
            <option>Event</option>
            <option>Emergency</option>
            <option>Academic</option>
          </select>
        </div>
      </div>

      {pinned.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Pin className="h-4 w-4" style={{ color: TINT }} /> Pinned Notices
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pinned.map((n) => (
              <NoticeCard
                key={n.id}
                notice={n}
                onView={() => navigate({ to: "/hostel-admin/notices/$id", params: { id: n.id } })}
                onEdit={() => navigate({ to: "/hostel-admin/notices/$id/edit", params: { id: n.id } })}
                onDelete={() => setToDelete(n)}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-foreground">All Notices ({regular.length})</h2>
        {regular.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No notices match the current filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {regular.map((n) => (
              <NoticeCard
                key={n.id}
                notice={n}
                onView={() => navigate({ to: "/hostel-admin/notices/$id", params: { id: n.id } })}
                onEdit={() => navigate({ to: "/hostel-admin/notices/$id/edit", params: { id: n.id } })}
                onDelete={() => setToDelete(n)}
              />
            ))}
          </div>
        )}
      </section>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete notice?</DialogTitle>
            <DialogDescription>
              This will permanently remove "{toDelete?.title}" from the notice board. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button className="bg-[#EF4444] text-white hover:bg-[#dc2626]" onClick={confirmDelete}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoticeCard({
  notice,
  onView,
  onEdit,
  onDelete,
}: {
  notice: Notice;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const catTint = CATEGORY_TINT[notice.category];
  return (
    <article className="group flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div
        className="h-1.5 w-full rounded-t-xl"
        style={{ backgroundColor: catTint }}
      />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: `${catTint}1A`, color: catTint }}
            >
              {notice.category}
            </span>
            {notice.pinned && <Pin className="h-3.5 w-3.5" style={{ color: TINT }} />}
          </div>
          <StatusPill status={notice.status} />
        </div>

        <h3 className="line-clamp-2 text-base font-semibold text-foreground">{notice.title}</h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">{notice.body}</p>

        <div className="mt-auto flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {notice.audience}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> {notice.publishDate} → {notice.expiryDate || "—"}
          </div>
          {notice.attachment && (
            <div className="flex items-center gap-1.5">
              <Paperclip className="h-3.5 w-3.5" /> {notice.attachment.name}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] text-muted-foreground">by {notice.author}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={onView}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Preview"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={onEdit}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
