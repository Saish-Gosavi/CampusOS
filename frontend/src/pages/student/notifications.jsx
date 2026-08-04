import { createFileRoute } from "@/routes/compat";
import { Bell, BedDouble, BookOpen, GraduationCap } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { notificationsFeed } from "@/lib/student-data";
const Route = createFileRoute("/student/notifications")({
  head: () => ({ meta: [{ title: "Notifications \u2014 Student Portal" }] }),
  component: NotificationsPage
});
const iconFor = (src) => src === "Hostel" ? BedDouble : src === "Library" ? BookOpen : GraduationCap;
const tintFor = (src) => src === "Hostel" ? "#2563EB" : src === "Library" ? "#0D9488" : "#7B4CED";
function NotificationsPage() {
  return <div className="mx-auto flex max-w-[1200px] flex-col gap-6">
      <StudentPageHeader
    title="Notifications"
    description="All alerts from hostel, library and college"
    icon={Bell}
    tint="#0EA5E9"
    breadcrumbs={[{ label: "Notifications" }]}
  />

      <div className="rounded-xl border border-border bg-card shadow-sm">
        <ul className="divide-y divide-border">
          {notificationsFeed.map((n) => {
    const Icon = iconFor(n.source);
    const tint = tintFor(n.source);
    return <li key={n.id} className="flex items-start gap-3 p-4 hover:bg-muted/30">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${tint}1A`, color: tint }}>
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                    {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444]" />}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5 font-medium">{n.source}</span>
                    <span>{n.time}</span>
                  </div>
                </div>
              </li>;
  })}
        </ul>
      </div>
    </div>;
}
export {
  Route
};
