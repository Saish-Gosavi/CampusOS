import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus, Search, Edit2, Trash2, Eye, Pin } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { NoticeForm, type NoticeFormValues } from "@/components/hostel/NoticeForm";
import { NoticePreviewDialog } from "@/components/hostel/NoticePreviewDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { notices } from "@/lib/hostel-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/warden/notices")({
  component: NoticesPage,
});

const TINT = "#EAB308";

type View = "list" | "create" | "edit";

function NoticesPage() {
  const [view, setView] = useState<View>("list");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [editId, setEditId] = useState<string | null>(null);
  const [preview, setPreview] = useState<NoticeFormValues | null>(null);

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
  }, [q, cat]);

  const pinned = filtered.filter((n) => n.pinned);
  const regular = filtered.filter((n) => !n.pinned);

  const handleSubmit = (_values: NoticeFormValues, status: string) => {
    toast.success(status === "Draft" ? "Draft saved" : `Notice ${view === "edit" ? "updated" : "published"}`);
    setView("list");
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    toast.success(`Notice ${id} deleted`);
  };

  if (view === "create" || view === "edit") {
    return (
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
        <WardenPageHeader
          title={view === "edit" ? "Edit Notice" : "Create Notice"}
          description={view === "edit" ? "Update the notice details and republish." : "Compose a new hostel notice for residents."}
          icon={Megaphone}
          tint={TINT}
          breadcrumbs={[{ label: "Notice Board", to: "/warden/notices" }, { label: view === "edit" ? "Edit" : "Create" }]}
          action={<Button variant="outline" onClick={() => { setView("list"); setEditId(null); }}>Cancel</Button>}
        />
        <NoticeForm initial={editing} onSubmit={handleSubmit} onPreview={setPreview} />
        <NoticePreviewDialog values={preview} onClose={() => setPreview(null)} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Notice Board"
        description="Publish, edit and manage hostel notices for your residents."
        icon={Megaphone}
        tint={TINT}
        breadcrumbs={[{ label: "Notice Board" }]}
        action={
          <Button style={{ backgroundColor: TINT }} className="text-slate-900 hover:opacity-90" onClick={() => setView("create")}>
            <Plus className="mr-1.5 h-4 w-4" /> New Notice
          </Button>
        }
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notices..." className="h-10 pl-9" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {["All", "General", "Maintenance", "Event", "Emergency", "Academic"].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                cat === c ? "bg-[#EAB308] text-slate-900 shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >{c}</button>
          ))}
        </div>
      </div>

      {pinned.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground"><Pin className="h-4 w-4 text-[#EAB308]" /> Pinned</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pinned.map((n) => <NoticeCard key={n.id} notice={n} onEdit={() => { setEditId(n.id); setView("edit"); }} onDelete={() => handleDelete(n.id)} onPreview={() => setPreview({ title: n.title, body: n.body, audience: n.audience as any, category: n.category as any, publishDate: n.publishDate, expiryDate: n.expiryDate ?? "", attachment: n.attachment ?? null, pinned: !!n.pinned })} />)}
          </div>
        </section>
      )}

      <section>
        {pinned.length > 0 && <h2 className="mb-3 text-sm font-semibold text-foreground">All Notices</h2>}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {regular.map((n) => <NoticeCard key={n.id} notice={n} onEdit={() => { setEditId(n.id); setView("edit"); }} onDelete={() => handleDelete(n.id)} onPreview={() => setPreview({ title: n.title, body: n.body, audience: n.audience as any, category: n.category as any, publishDate: n.publishDate, expiryDate: n.expiryDate ?? "", attachment: n.attachment ?? null, pinned: !!n.pinned })} />)}
        </div>
        {regular.length === 0 && pinned.length === 0 && (
          <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card py-16 text-center text-sm text-muted-foreground">
            No notices found
          </div>
        )}
      </section>

      <NoticePreviewDialog values={preview} onClose={() => setPreview(null)} />
    </div>
  );
}

function NoticeCard({ notice, onEdit, onDelete, onPreview }: { notice: (typeof notices)[number]; onEdit: () => void; onDelete: () => void; onPreview: () => void }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#EAB308]/15 text-[#EAB308]">
          <Megaphone className="h-4 w-4" />
        </span>
        <div className="flex items-center gap-2">
          {notice.pinned && <Pin className="h-3.5 w-3.5 text-[#EAB308]" />}
          <StatusPill status={notice.status} />
        </div>
      </div>
      <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground">{notice.title}</h3>
      <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{notice.body}</p>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
        <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 font-medium text-[#2563EB]">{notice.audience}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-muted-foreground">{notice.category}</span>
      </div>
      <div className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
        {notice.publishDate}{notice.expiryDate ? ` → ${notice.expiryDate}` : ""}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1">
        <button onClick={onPreview} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-4 w-4" /></button>
        <button onClick={onEdit} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Edit2 className="h-4 w-4" /></button>
        <button onClick={onDelete} className="grid h-8 w-8 place-items-center rounded-md text-[#DC2626] hover:bg-[#EF4444]/10"><Trash2 className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
