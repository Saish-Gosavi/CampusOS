import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Pin } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { hostelNoticesFeed } from "@/lib/student-data";
const Route = createFileRoute("/student/hostel-notices")({
  head: () => ({ meta: [{ title: "Hostel Notices \u2014 Student Portal" }] }),
  component: HostelNoticesPage
});
function HostelNoticesPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Hostel Notices"
    description="Announcements from your warden and hostel admin"
    icon={Megaphone}
    tint="#2563EB"
    breadcrumbs={[{ label: "Hostel", to: "/student/room" }, { label: "Notices" }]}
  />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hostelNoticesFeed.map((n) => <div key={n.id} className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            {n.pinned && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#EF4444]/10 px-2 py-0.5 text-[10px] font-semibold text-[#EF4444]">
                <Pin className="h-3 w-3" /> Pinned
              </span>}
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
              {n.category}
            </span>
            <h3 className="mt-3 text-base font-semibold text-foreground">{n.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{n.body}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
              <span>{n.audience}</span>
              <span>{new Date(n.publishedOn).toDateString()}</span>
            </div>
          </div>)}
      </div>
    </div>;
}
export {
  Route
};
