import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { Megaphone, Plus, Search, Edit2, Trash2, Eye, Pin, Loader2 } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { NoticeForm } from "@/components/hostel/NoticeForm";
import { NoticePreviewDialog } from "@/components/hostel/NoticePreviewDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { noticeApi } from "@/services/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const Route = createFileRoute("/warden/notices")({
  component: NoticesPage
});
const TINT = "#210963";
function NoticesPage() {
  const [view, setView] = useState("list");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState(null);
  
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await noticeApi.getNotices();
      setNotices(res.data.map(mapBackendToFrontend));
    } catch (error) {
      toast.error("Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  const mapBackendToFrontend = (n) => ({
    id: n.id,
    title: n.title,
    body: n.content || "",
    category: n.priority,
    audience: n.hostelId ? "Hostel Only" : "Global",
    publishDate: n.scheduledAt ? new Date(n.scheduledAt).toLocaleDateString() : new Date(n.createdAt).toLocaleDateString(),
    expiryDate: n.expiresAt ? new Date(n.expiresAt).toLocaleDateString() : null,
    pinned: n.priority === "Urgent",
    status: n.isActive ? (n.scheduledAt && new Date(n.scheduledAt) > new Date() ? "Draft" : "Published") : "Archived",
    hostelId: n.hostelId
  });

  const editing = notices.find((n) => n.id === editId);

  const filtered = useMemo(() => {
    return notices.filter((n) => {
      if (cat !== "All" && n.category !== cat) return false;
      if (q) {
        const t = q.toLowerCase();
        return n.title.toLowerCase().includes(t) || n.body.toLowerCase().includes(t);
      }
      return true;
    });
  }, [q, cat, notices]);

  const pinned = filtered.filter((n) => n.pinned);
  const regular = filtered.filter((n) => !n.pinned);

  const handleSubmit = async (values, status) => {
    try {
      const payload = {
        title: values.title,
        content: values.body,
        priority: values.category || "General",
        isActive: status !== "Draft",
        scheduledAt: values.publishDate ? new Date(values.publishDate).toISOString() : null,
        expiresAt: values.expiryDate ? new Date(values.expiryDate).toISOString() : null,
        // Audience parsing is tricky because Warden can only create for their hostel, but we'll let backend handle it via token
      };

      if (view === "edit") {
        await noticeApi.updateNotice(editId, payload);
        toast.success(status === "Draft" ? "Draft updated" : "Notice updated");
      } else {
        await noticeApi.createNotice(payload);
        toast.success(status === "Draft" ? "Draft saved" : "Notice published");
      }
      await fetchNotices();
      setView("list");
      setEditId(null);
    } catch (error) {
      toast.error("Failed to save notice");
    }
  };

  const handleDelete = async (id) => {
    try {
      await noticeApi.deleteNotice(id);
      toast.success("Notice deleted");
      await fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete notice");
    }
  };
  if (view === "create" || view === "edit") {
    return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <WardenPageHeader
      title={view === "edit" ? "Edit Notice" : "Create Notice"}
      description={view === "edit" ? "Update the notice details and republish." : "Compose a new hostel notice for residents."}
      icon={Megaphone}
      tint={TINT}
      breadcrumbs={[{ label: "Notice Board", to: "/warden/notices" }, { label: view === "edit" ? "Edit" : "Create" }]}
      action={<Button variant="outline" onClick={() => {
        setView("list");
        setEditId(null);
      }}>Cancel</Button>}
    />
        <NoticeForm initial={editing} onSubmit={handleSubmit} onPreview={setPreview} />
        <NoticePreviewDialog values={preview} onClose={() => setPreview(null)} />
      </div>;
  }
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Notice Board"
    description="Publish, edit and manage hostel notices for your residents."
    icon={Megaphone}
    tint={TINT}
    breadcrumbs={[{ label: "Notice Board" }]}
    action={<Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90" onClick={() => setView("create")}>
            <Plus className="mr-1.5 h-4 w-4" /> New Notice
          </Button>}
  />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/50" />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notices..." className="h-10 pl-9" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {["All", "General", "Maintenance", "Event", "Emergency", "Academic"].map((c) => <button
    key={c}
    onClick={() => setCat(c)}
    className={cn(
      "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
      cat === c ? "bg-[#210963] text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
    )}
  >{c}</button>)}
        </div>
      </div>

      {pinned.length > 0 && <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground"><Pin className="h-4 w-4 text-[#210963]" /> Pinned</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pinned.map((n) => <NoticeCard key={n.id} notice={n} onEdit={() => {
    setEditId(n.id);
    setView("edit");
  }} onDelete={() => handleDelete(n.id)} onPreview={() => setPreview({ title: n.title, body: n.body, audience: n.audience, category: n.category, publishDate: n.publishDate, expiryDate: n.expiryDate ?? "", attachment: n.attachment ?? null, pinned: !!n.pinned })} />)}
          </div>
        </section>}

      <section>
        {pinned.length > 0 && <h2 className="mb-3 text-sm font-semibold text-foreground">All Notices</h2>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {regular.map((n) => <NoticeCard key={n.id} notice={n} onEdit={() => {
    setEditId(n.id);
    setView("edit");
  }} onDelete={() => handleDelete(n.id)} onPreview={() => setPreview({ title: n.title, body: n.body, audience: n.audience, category: n.category, publishDate: n.publishDate, expiryDate: n.expiryDate ?? "", attachment: n.attachment ?? null, pinned: !!n.pinned })} />)}
        </div>
        {regular.length === 0 && pinned.length === 0 && <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            No notices found
          </div>}
      </section>
        </>
      )}

      <NoticePreviewDialog values={preview} onClose={() => setPreview(null)} />
    </div>;
}
function NoticeCard({ notice, onEdit, onDelete, onPreview }) {
  return <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#210963]/10 text-[#210963]">
          <Megaphone className="h-4 w-4" />
        </span>
        <div className="flex items-center gap-2">
          {notice.pinned && <Pin className="h-3.5 w-3.5 text-[#210963]" />}
          <StatusPill status={notice.status} />
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground">{notice.title}</h3>
      <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{notice.body}</p>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">{notice.audience}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">{notice.category}</span>
      </div>
      <div className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
        {notice.publishDate}{notice.expiryDate ? ` \u2192 ${notice.expiryDate}` : ""}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1">
        <button onClick={onPreview} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-4 w-4" /></button>
        <button onClick={onEdit} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Edit2 className="h-4 w-4" /></button>
        <button onClick={onDelete} className="grid h-8 w-8 place-items-center rounded-md text-[#DC2626] hover:bg-[#EF4444]/10"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>;
}
export {
  Route
};
