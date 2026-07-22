import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageSquareWarning, Plus, Paperclip } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusPill } from "@/components/hostel/StatusPill";
import { myComplaints } from "@/lib/student-data";

export const Route = createFileRoute("/student/complaints")({
  head: () => ({ meta: [{ title: "Complaints — Student Portal" }] }),
  component: ComplaintsPage,
});

function ComplaintsPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
        title="Complaints"
        description="Report hostel issues and track resolution"
        icon={MessageSquareWarning}
        tint="#EF4444"
        breadcrumbs={[{ label: "Hostel", to: "/student/room" }, { label: "Complaints" }]}
        action={
          <Button onClick={() => setOpen((v) => !v)} className="bg-[#2563EB] hover:bg-[#1d4fd8]">
            <Plus className="mr-2 h-4 w-4" /> {open ? "Close form" : "Raise complaint"}
          </Button>
        }
      />

      {open && (
        <form
          onSubmit={(e) => { e.preventDefault(); setOpen(false); }}
          className="rounded-xl border border-border bg-card p-5 shadow-sm"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">New complaint</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Category</Label>
              <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Electrical</option><option>Plumbing</option><option>Furniture</option>
                <option>Cleaning</option><option>Wi-Fi</option><option>Other</option>
              </select>
            </div>
            <div>
              <Label>Priority</Label>
              <select className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea rows={4} placeholder="Describe the issue in detail..." />
            </div>
            <div className="sm:col-span-2">
              <Label>Attachment</Label>
              <div className="mt-1.5 grid place-items-center rounded-lg border border-dashed border-border p-6 text-center">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium">Drop a photo or click to attach</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB (placeholder)</p>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#2563EB] hover:bg-[#1d4fd8]">Submit complaint</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {myComplaints.map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-[#EF4444]/10 px-2.5 py-1 text-xs font-semibold text-[#EF4444]">
                {c.category}
              </span>
              <StatusPill status={c.status} />
            </div>
            <p className="mt-3 text-sm text-foreground">{c.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Raised {new Date(c.raisedOn).toDateString()}</span>
              <StatusPill status={c.priority} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
