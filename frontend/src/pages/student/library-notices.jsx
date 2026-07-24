import { createFileRoute } from "@tanstack/react-router";
import { BookUp, Pin } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { libraryNoticesFeed } from "@/lib/student-data";
const Route = createFileRoute("/student/library-notices")({
  head: () => ({ meta: [{ title: "Library Notices \u2014 Student Portal" }] }),
  component: LibraryNoticesPage
});
function LibraryNoticesPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Library Notices"
    description="Announcements from the central library"
    icon={BookUp}
    tint="#0D9488"
    breadcrumbs={[{ label: "Library", to: "/student/books" }, { label: "Notices" }]}
  />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {libraryNoticesFeed.map((n) => <div key={n.id} className="relative rounded-xl border border-border bg-card p-5 shadow-sm">
            {n.pinned && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#EF4444]/10 px-2 py-0.5 text-[10px] font-semibold text-[#EF4444]">
                <Pin className="h-3 w-3" /> Pinned
              </span>}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0D9488]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#0D9488]">
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
