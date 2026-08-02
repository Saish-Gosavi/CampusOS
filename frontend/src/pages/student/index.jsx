import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BedDouble,
  CalendarDays,
  MessageSquareWarning,
  IndianRupee,
  BookOpen,
  Clock,
  AlertTriangle,
  Bell,
  Plus,
  UserRoundCheck,
  Search,
  BookMarked,
  ArrowRight,
  Megaphone
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { StatusPill } from "@/components/hostel/StatusPill";
import {
  attendanceTrend,
  hostelNoticesFeed,
  libraryNoticesFeed,
  myBorrowed,
  myComplaints,
  myLeaves,
  studentActivities,
  studentProfile,
  upcomingDueDates
} from "@/lib/student-data";
const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "Dashboard \u2014 Student Portal" },
      { name: "description", content: "Your hostel and library snapshot in one view." }
    ]
  }),
  component: StudentDashboard
});
const stats = [
  { label: "Room Number", value: studentProfile.hostel.room, delta: `${studentProfile.hostel.name}`, trend: "up", icon: BedDouble, tint: "#2563EB" },
  { label: "Leave Requests", value: "1 pending", delta: "2 approved this term", trend: "up", icon: CalendarDays, tint: "#F97316" },
  { label: "Pending Complaints", value: "2", delta: "1 in progress", trend: "down", icon: MessageSquareWarning, tint: "#EF4444" },
  { label: "Hostel Fees", value: "\u20B942,000", delta: "Due 15 Aug", trend: "down", icon: IndianRupee, tint: "#22C55E" },
  { label: "Borrowed Books", value: "3", delta: "1 overdue", trend: "down", icon: BookOpen, tint: "#0D9488" },
  { label: "Books Due Soon", value: "2", delta: "Within a week", trend: "up", icon: Clock, tint: "#7B4CED" },
  { label: "Library Fine", value: "\u20B940", delta: "Pending", trend: "down", icon: AlertTriangle, tint: "#EAB308" },
  { label: "Notifications", value: "6", delta: "3 unread", trend: "up", icon: Bell, tint: "#0EA5E9" }
];
const quickActions = [
  { title: "Apply Leave", description: "Submit a new leave request", icon: CalendarDays, tint: "#F97316", to: "/student/leaves" },
  { title: "Raise Complaint", description: "Report a hostel issue", icon: MessageSquareWarning, tint: "#EF4444", to: "/student/complaints" },
  { title: "Request Visitor Pass", description: "Invite family / guardian", icon: UserRoundCheck, tint: "#06B6D4", to: "/student/visitors" },
  { title: "Search Book", description: "Explore library catalog", icon: Search, tint: "#0D9488", to: "/student/books" },
  { title: "Reserve Book", description: "Hold your next read", icon: BookMarked, tint: "#7B4CED", to: "/student/reserve" },
  { title: "View Fee Details", description: "Payments & receipts", icon: IndianRupee, tint: "#22C55E", to: "/student/fees" }
];
function StudentDashboard() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {studentProfile.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {studentProfile.enrollment} · {studentProfile.department} · {studentProfile.year}
          </p>
        </div>
      </div>

      {
    /* Stats */
  }
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {
    /* Quick actions */
  }
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Quick actions</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((a) => <Link key={a.title} to={a.to}>
              <QuickActionCard title={a.title} description={a.description} icon={a.icon} tint={a.tint} />
            </Link>)}
        </div>
      </div>

      {
    /* Widgets grid */
  }
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Attendance trend" description="Monthly attendance %" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceTrend}>
                <defs>
                  <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" domain={[70, 100]} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid hsl(var(--border))" }} />
                <Area type="monotone" dataKey="present" stroke="#2563EB" strokeWidth={2} fill="url(#attFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Upcoming due dates" description="Stay on top of deadlines">
          <ul className="space-y-3">
            {upcomingDueDates.map((d) => <li key={d.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/60 p-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: `${d.tint}1A`, color: d.tint }}>
                  <Clock className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{d.label}</p>
                  <p className="text-xs text-muted-foreground">{new Date(d.date).toDateString()}</p>
                </div>
              </li>)}
          </ul>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
    title="My borrowed books"
    description="Return before due date"
    action={<Link to="/student/borrowed" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>}
  >
          <ul className="space-y-3">
            {myBorrowed.map((b) => <li key={b.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="grid h-11 w-9 shrink-0 place-items-center rounded-md bg-gradient-to-br from-[#0D9488] to-[#0f766e] text-xs font-bold text-white">
                  {b.cover}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">Due {new Date(b.dueDate).toDateString()}</p>
                </div>
                <StatusPill status={b.status} />
              </li>)}
          </ul>
        </ChartCard>

        <ChartCard
    title="Complaint status"
    description="Latest tickets you raised"
    action={<Link to="/student/complaints" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>}
  >
          <ul className="space-y-3">
            {myComplaints.slice(0, 4).map((c) => <li key={c.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{c.category}</p>
                  <StatusPill status={c.status} />
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">Raised {new Date(c.raisedOn).toDateString()}</p>
              </li>)}
          </ul>
        </ChartCard>

        <ChartCard
    title="Leave status"
    description="Recent applications"
    action={<Link to="/student/leaves" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>}
  >
          <ul className="space-y-3">
            {myLeaves.slice(0, 4).map((l) => <li key={l.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{l.type}</p>
                  <StatusPill status={l.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(l.from).toLocaleDateString()} → {new Date(l.to).toLocaleDateString()}
                </p>
                <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">{l.reason}</p>
              </li>)}
          </ul>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
    title="Hostel notice board"
    description="Latest from your warden"
    className="lg:col-span-1"
    action={<Link to="/student/hostel-notices" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              All <ArrowRight className="h-3 w-3" />
            </Link>}
  >
          <ul className="space-y-3">
            {hostelNoticesFeed.slice(0, 3).map((n) => <li key={n.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-3.5 w-3.5 text-primary" />
                  <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">{new Date(n.publishedOn).toDateString()}</p>
              </li>)}
          </ul>
        </ChartCard>

        <ChartCard
    title="Library notice board"
    description="Announcements from library"
    className="lg:col-span-1"
    action={<Link to="/student/library-notices" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              All <ArrowRight className="h-3 w-3" />
            </Link>}
  >
          <ul className="space-y-3">
            {libraryNoticesFeed.map((n) => <li key={n.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-[#0D9488]" />
                  <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">{new Date(n.publishedOn).toDateString()}</p>
              </li>)}
          </ul>
        </ChartCard>

        <ChartCard title="Recent activity" description="Your latest interactions" className="lg:col-span-1">
          <ActivityTimeline items={studentActivities.slice(0, 6)} />
        </ChartCard>
      </div>
    </div>;
}
void Plus;
export {
  Route
};
