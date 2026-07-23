import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, FileText, Save, Send, Eye } from "lucide-react";
const TINT = "#EAB308";
const audiences = ["All Blocks", "Block A", "Block B", "Block C", "Block D", "Wardens", "Staff"];
const categories = ["General", "Maintenance", "Event", "Emergency", "Academic"];
function NoticeForm({ initial, onSubmit, onPreview }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [audience, setAudience] = useState(initial?.audience ?? "All Blocks");
  const [category, setCategory] = useState(initial?.category ?? "General");
  const [publishDate, setPublishDate] = useState(initial?.publishDate ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate ?? "");
  const [attachment, setAttachment] = useState(initial?.attachment ?? null);
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const values = { title, body, audience, category, publishDate, expiryDate, attachment, pinned };
  const handle = (status) => (e) => {
    e.preventDefault();
    onSubmit(values, status);
  };
  return <form className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]" onSubmit={handle("Published")}>
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Notice Content</h2>
        <p className="text-xs text-muted-foreground">Write a clear title and detailed message for residents.</p>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Water shutdown on Friday" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Description *</label>
            <textarea
    value={body}
    onChange={(e) => setBody(e.target.value)}
    rows={10}
    className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground"
    placeholder="Provide full context, timings, action required..."
  />
            <p className="mt-1 text-[11px] text-muted-foreground">{body.length} characters</p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Attachment (optional)</label>
            {attachment ? <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-3 py-2">
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{attachment.name}</span>
                  <span className="text-xs text-muted-foreground">· {attachment.size}</span>
                </div>
                <button
    type="button"
    onClick={() => setAttachment(null)}
    className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-background hover:text-foreground"
  >
                  <X className="h-4 w-4" />
                </button>
              </div> : <button
    type="button"
    onClick={() => setAttachment({ name: "attachment.pdf", size: "128 KB" })}
    className="flex w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-muted/20 px-4 py-6 text-sm text-muted-foreground hover:bg-muted/40"
  >
                <Upload className="h-5 w-5" />
                <span>Click to upload a file (PDF, JPG, PNG)</span>
                <span className="text-[11px]">Max 5 MB · placeholder</span>
              </button>}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Publishing Details</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Target Audience</label>
              <select
    value={audience}
    onChange={(e) => setAudience(e.target.value)}
    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
  >
                {audiences.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Category</label>
              <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
  >
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Publish Date</label>
                <Input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Expiry Date</label>
                <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
              <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
              <span className="text-foreground">Pin this notice to the top</span>
            </label>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-base font-semibold text-foreground">Actions</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Button type="submit" style={{ backgroundColor: TINT }} className="text-slate-900 hover:opacity-90">
              <Send className="mr-1.5 h-4 w-4" /> Publish Notice
            </Button>
            <Button type="button" variant="outline" onClick={handle("Draft")}>
              <Save className="mr-1.5 h-4 w-4" /> Save as Draft
            </Button>
            {onPreview && <Button type="button" variant="ghost" onClick={() => onPreview(values)}>
                <Eye className="mr-1.5 h-4 w-4" /> Preview
              </Button>}
          </div>
        </div>
      </div>
    </form>;
}
export {
  NoticeForm
};
