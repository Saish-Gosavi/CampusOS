import { Megaphone, Paperclip, Pin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { StatusPill } from "@/components/hostel/StatusPill";
function NoticePreviewDialog({ values, onClose }) {
  return <Dialog open={!!values} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Notice Preview</DialogTitle>
        </DialogHeader>
        {values && <article className="overflow-hidden rounded-xl border border-border bg-card">
            <div
    className="flex items-center justify-between px-5 py-3 text-white"
    style={{ background: "linear-gradient(90deg, #282648 0%, #211160 100%)" }}
  >
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                <span className="text-xs font-semibold">CampusOS · Hostel Notice</span>
              </div>
              {values.pinned && <Pin className="h-4 w-4" />}
            </div>
            <div className="flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#EAB308]/10 px-2 py-0.5 text-[11px] font-medium text-[#B45309]">
                  {values.category}
                </span>
                <StatusPill status="Published" />
                <span className="text-xs text-muted-foreground">· for {values.audience}</span>
              </div>
              <h3 className="text-xl font-bold text-foreground">{values.title || "Untitled notice"}</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {values.body || "Notice description will appear here."}
              </p>
              {values.attachment && <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{values.attachment.name}</span>
                  <span className="text-xs text-muted-foreground">· {values.attachment.size}</span>
                </div>}
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
                <span>Publish: {values.publishDate || "\u2014"}</span>
                <span>Expiry: {values.expiryDate || "\u2014"}</span>
              </div>
            </div>
          </article>}
      </DialogContent>
    </Dialog>;
}
export {
  NoticePreviewDialog
};
