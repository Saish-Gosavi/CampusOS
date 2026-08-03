import { useEffect, useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  CalendarClock,
  Timer,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { globalNoticeApi } from "@/services/api";

// ─── Route ────────────────────────────────────────────────────────────────────
const Route = createFileRoute("/super-admin/notices")({
  component: NoticesPage,
});

const TINT = "#7B4CED";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getNoticeStatus(notice) {
  if (!notice.isActive) return "inactive";
  if (notice.scheduledAt) {
    return new Date(notice.scheduledAt) > new Date() ? "scheduled" : "published";
  }
  return "published";
}

function StatusBadge({ status, scheduledAt }) {
  const config = {
    published: { icon: CheckCircle2, label: "Published", color: "text-emerald-600", bg: "bg-emerald-500/10" },
    scheduled: { icon: CalendarClock, label: `Scheduled`, color: "text-blue-600", bg: "bg-blue-500/10" },
    inactive:  { icon: XCircle, label: "Inactive", color: "text-muted-foreground", bg: "bg-muted" },
  };
  const c = config[status] || config.published;
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${c.bg} ${c.color}`}>
      <Icon className="h-3 w-3" />
      {c.label}
      {status === "scheduled" && scheduledAt && (
        <span className="ml-0.5 opacity-80">
          {new Date(scheduledAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
        </span>
      )}
    </span>
  );
}

// Format a Date to datetime-local input value (YYYY-MM-DDTHH:mm)
function toDateTimeLocal(date) {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function NoticesPage() {
  const [view, setView] = useState("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [preview, setPreview] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await globalNoticeApi.getAll();
      const rows = Array.isArray(res) ? res : res?.data ?? [];
      setNotices(rows);
    } catch (err) {
      console.error("[Notices] load error:", err);
      toast.error(err?.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return notices.filter((n) => {
      // status filter
      if (statusFilter !== "all") {
        const s = getNoticeStatus(n);
        if (s !== statusFilter) return false;
      }
      // text search
      if (search.trim()) {
        const q = search.toLowerCase();
        return n.title.toLowerCase().includes(q) || (n.content && n.content.toLowerCase().includes(q));
      }
      return true;
    });
  }, [search, statusFilter, notices]);

  // counts
  const counts = useMemo(() => {
    const c = { all: notices.length, published: 0, scheduled: 0, inactive: 0 };
    notices.forEach((n) => { c[getNoticeStatus(n)]++; });
    return c;
  }, [notices]);

  const handleSubmit = async (values) => {
    try {
      if (view === "edit") {
        await globalNoticeApi.update(editTarget.id, values);
        toast.success("Notice updated");
      } else {
        toast.success(values.scheduledAt ? "Notice scheduled" : "Notice published");
        await globalNoticeApi.create(values);
      }
      setView("list");
      setEditTarget(null);
      load();
    } catch (err) {
      console.error("[Notices] submit error:", err);
      toast.error(err?.message || "Operation failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await globalNoticeApi.delete(deleteTarget.id);
      toast.success("Notice deleted");
      setDeleteTarget(null);
      load();
    } catch (err) {
      console.error("[Notices] delete error:", err);
      toast.error(err?.message || "Delete failed");
    }
  };

  // ── form view ──────────────────────────────────────────────────────────────
  if (view === "create" || view === "edit") {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${TINT}22`, color: TINT }}>
                <Megaphone className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{view === "edit" ? "Edit Notice" : "Create Notice"}</h1>
                <p className="text-sm text-muted-foreground">Broadcast to all college admins.</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setView("list"); setEditTarget(null); }}>Cancel</Button>
          </div>
        </div>
        <NoticeForm initial={editTarget} onSubmit={handleSubmit} onPreview={setPreview} />
        {preview && <NoticePreviewOverlay notice={preview} onClose={() => setPreview(null)} />}
      </div>
    );
  }

  // ── list view ──────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      {/* page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mt-3 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${TINT}22`, color: TINT }}>
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Global Notices</h1>
              <p className="text-sm text-muted-foreground">Broadcast announcements to all college admins.</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button style={{ backgroundColor: TINT }} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90" onClick={() => setView("create")}>
            <Plus className="h-4 w-4" /> New Notice
          </Button>
        </div>
      </div>

      {/* search + filter bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notices…" className="h-10 pl-9" />
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {["all", "published", "scheduled", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f
                  ? "bg-[#7B4CED] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {/* content */}
      {loading ? (
        <div className="grid place-items-center py-20 text-sm text-muted-foreground">Loading notices…</div>
      ) : filtered.length === 0 ? (
        <div className="grid place-items-center rounded-xl border border-dashed border-border bg-card py-20 text-center">
          <Megaphone className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {search || statusFilter !== "all" ? "No notices match your filter" : "No notices yet — create the first one!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((n) => (
            <NoticeCard
              key={n.id}
              notice={n}
              onEdit={() => { setEditTarget(n); setView("edit"); }}
              onDelete={() => setDeleteTarget(n)}
              onPreview={() => setPreview(n)}
            />
          ))}
        </div>
      )}

      {deleteTarget && <ConfirmDeleteDialog notice={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {preview && <NoticePreviewOverlay notice={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

// ─── Notice Card ──────────────────────────────────────────────────────────────
function NoticeCard({ notice, onEdit, onDelete, onPreview }) {
  const status = getNoticeStatus(notice);
  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ background: `${TINT}22`, color: TINT }}>
          <Megaphone className="h-4 w-4" />
        </span>
        <StatusBadge status={status} scheduledAt={notice.scheduledAt} />
      </div>

      <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground">{notice.title}</h3>
      {notice.content && <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{notice.content}</p>}

      {/* schedule info */}
      {status === "scheduled" && notice.scheduledAt && (
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-600 font-medium">
          <Clock className="h-3 w-3" />
          Publishes {new Date(notice.scheduledAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </div>
      )}

      {/* deadline info */}
      {notice.expiresAt && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
          <Timer className="h-3 w-3" />
          Auto-deletes {new Date(notice.expiresAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        </div>
      )}

      <div className="mt-3 border-t border-border pt-3 text-[11px] text-muted-foreground">
        Created {new Date(notice.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
        {notice.createdBy?.name ? ` • ${notice.createdBy.name}` : ""}
      </div>

      <div className="mt-3 flex items-center justify-end gap-1">
        <button title="Preview" onClick={onPreview} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground">
          <Eye className="h-4 w-4" />
        </button>
        <button title="Edit" onClick={onEdit} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground">
          <Edit2 className="h-4 w-4" />
        </button>
        <button title="Delete" onClick={onDelete} className="grid h-8 w-8 place-items-center rounded-md text-[#DC2626] transition hover:bg-[#EF4444]/10">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Notice Form ──────────────────────────────────────────────────────────────
function NoticeForm({ initial, onSubmit, onPreview }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [publishMode, setPublishMode] = useState(
    initial?.scheduledAt ? "schedule" : "now"
  );
  const [scheduledAt, setScheduledAt] = useState(
    initial?.scheduledAt ? toDateTimeLocal(initial.scheduledAt) : ""
  );

  // Deadline / Expiration state
  const [hasDeadline, setHasDeadline] = useState(!!initial?.expiresAt);
  const [expiresAt, setExpiresAt] = useState(
    initial?.expiresAt ? toDateTimeLocal(initial.expiresAt) : ""
  );

  const [saving, setSaving] = useState(false);

  // Minimum datetime for scheduling = now + 5 minutes
  const minScheduleDateTime = useMemo(() => {
    const d = new Date(Date.now() + 5 * 60000);
    return toDateTimeLocal(d);
  }, []);

  // Minimum datetime for deadline = scheduled time or now + 10 minutes
  const minDeadlineDateTime = useMemo(() => {
    const baseTime = publishMode === "schedule" && scheduledAt ? new Date(scheduledAt).getTime() : Date.now();
    const d = new Date(baseTime + 5 * 60000);
    return toDateTimeLocal(d);
  }, [publishMode, scheduledAt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (publishMode === "schedule" && !scheduledAt) {
      toast.error("Please select a date and time for scheduling");
      return;
    }
    if (publishMode === "schedule" && new Date(scheduledAt) <= new Date()) {
      toast.error("Scheduled time must be in the future");
      return;
    }
    if (hasDeadline && !expiresAt) {
      toast.error("Please select a deadline date and time");
      return;
    }
    if (hasDeadline && new Date(expiresAt) <= new Date()) {
      toast.error("Deadline time must be in the future");
      return;
    }
    if (hasDeadline && publishMode === "schedule" && scheduledAt && new Date(expiresAt) <= new Date(scheduledAt)) {
      toast.error("Deadline time must be after the scheduled publish time");
      return;
    }

    setSaving(true);
    await onSubmit({
      title: title.trim(),
      content: content.trim(),
      isActive,
      scheduledAt: publishMode === "schedule" && scheduledAt ? new Date(scheduledAt).toISOString() : null,
      expiresAt: hasDeadline && expiresAt ? new Date(expiresAt).toISOString() : null,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Title <span className="text-[#DC2626]">*</span></label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter notice title…" className="h-11" maxLength={150} />
        <p className="text-right text-[11px] text-muted-foreground">{title.length}/150</p>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write the notice body here…"
          rows={6}
          className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* isActive toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => setIsActive((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? "bg-[#EAB308]" : "bg-muted"}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-6" : "translate-x-1"}`} />
        </button>
        <span className="text-sm text-foreground">{isActive ? "Active (visible to admins)" : "Inactive (hidden)"}</span>
      </div>

      {/* ── Publish Mode ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/30 p-4">
        <label className="text-sm font-medium text-foreground">When to publish</label>
        <div className="flex gap-3">
          <label
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              publishMode === "now" ? "border-[#EAB308] bg-[#EAB308]/5 shadow-sm" : "border-border hover:bg-muted/50"
            }`}
          >
            <input
              type="radio"
              name="publishMode"
              value="now"
              checked={publishMode === "now"}
              onChange={() => setPublishMode("now")}
              className="sr-only"
            />
            <span className={`grid h-9 w-9 place-items-center rounded-lg ${publishMode === "now" ? "bg-[#EAB308]/20 text-[#EAB308]" : "bg-muted text-muted-foreground"}`}>
              <Megaphone className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Publish Now</p>
              <p className="text-xs text-muted-foreground">Visible immediately</p>
            </div>
          </label>

          <label
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
              publishMode === "schedule" ? "border-blue-500 bg-blue-500/5 shadow-sm" : "border-border hover:bg-muted/50"
            }`}
          >
            <input
              type="radio"
              name="publishMode"
              value="schedule"
              checked={publishMode === "schedule"}
              onChange={() => setPublishMode("schedule")}
              className="sr-only"
            />
            <span className={`grid h-9 w-9 place-items-center rounded-lg ${publishMode === "schedule" ? "bg-blue-500/20 text-blue-600" : "bg-muted text-muted-foreground"}`}>
              <CalendarClock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">Schedule</p>
              <p className="text-xs text-muted-foreground">Publish at a specific time</p>
            </div>
          </label>
        </div>

        {/* Datetime picker (shown only for schedule) */}
        {publishMode === "schedule" && (
          <div className="mt-1 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">
              Publish Date & Time <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              min={minScheduleDateTime}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {scheduledAt && (
              <p className="text-xs text-blue-600">
                Will publish on {new Date(scheduledAt).toLocaleString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Deadline / Expiration Settings ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-amber-500/5 p-4 border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-foreground">Notice Deadline / Expiration</p>
              <p className="text-xs text-muted-foreground">Notice will be automatically deleted on the deadline date & time</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={hasDeadline}
            onClick={() => {
              setHasDeadline((v) => !v);
              if (hasDeadline) setExpiresAt("");
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${hasDeadline ? "bg-amber-500" : "bg-muted"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${hasDeadline ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {hasDeadline && (
          <div className="mt-2 flex flex-col gap-1.5 border-t border-amber-500/10 pt-3">
            <label className="text-xs font-medium text-foreground">
              Deadline Date & Time <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              min={minDeadlineDateTime}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            {expiresAt && (
              <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Will be automatically deleted on {new Date(expiresAt).toLocaleString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onPreview({ title, content, isActive, scheduledAt: publishMode === "schedule" ? scheduledAt : null, expiresAt: hasDeadline ? expiresAt : null, createdAt: new Date().toISOString() })}
        >
          <Eye className="mr-1.5 h-4 w-4" /> Preview
        </Button>
        <Button type="submit" style={{ backgroundColor: publishMode === "schedule" ? "#2563EB" : TINT }} className="font-semibold text-white hover:opacity-90" disabled={saving}>
          {saving
            ? "Saving…"
            : publishMode === "schedule"
              ? (initial ? "Update Schedule" : "Schedule Notice")
              : (initial ? "Update Notice" : "Publish Notice")}
        </Button>
      </div>
    </form>
  );
}

// ─── Preview Overlay ──────────────────────────────────────────────────────────
function NoticePreviewOverlay({ notice, onClose }) {
  const status = getNoticeStatus(notice);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Notice Preview</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted">✕</button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: `${TINT}22`, color: TINT }}>
              <Megaphone className="h-4 w-4" />
            </span>
            <StatusBadge status={status} scheduledAt={notice.scheduledAt} />
          </div>
          <h3 className="text-xl font-semibold text-foreground">{notice.title || "(no title)"}</h3>
          {notice.content ? (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{notice.content}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">No content provided.</p>
          )}
          {notice.scheduledAt && (
            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
              <CalendarClock className="h-3.5 w-3.5" />
              Scheduled for {new Date(notice.scheduledAt).toLocaleString("en-IN")}
            </div>
          )}
          {notice.expiresAt && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
              <Timer className="h-3.5 w-3.5" />
              Deadline: Auto-deletes on {new Date(notice.expiresAt).toLocaleString("en-IN")}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground">
            {notice.createdAt ? `Created ${new Date(notice.createdAt).toLocaleString("en-IN")}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────
function ConfirmDeleteDialog({ notice, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-foreground">Delete Notice</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-semibold text-foreground">"{notice.title}"</span>? This action cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm} className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">Delete</Button>
        </div>
      </div>
    </div>
  );
}

export { Route };
