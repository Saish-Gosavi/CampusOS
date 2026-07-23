import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  BedDouble,
  DoorOpen,
  DoorClosed,
  MessageSquareWarning,
  IndianRupee,
  UserPlus,
  Megaphone,
  FilePlus2,
  ArrowRight,
  CalendarDays,
  UserCheck,
  Plus
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { HostelBreadcrumbs } from "@/components/hostel/HostelBreadcrumbs";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { StatusPill } from "@/components/hostel/StatusPill";
import {
  complaintOverview,
  hostelActivities,
  leaveRequestOverview,
  leaveRequests,
  notices,
  occupancyByBlock,
  students
} from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/")({
  component: HostelDashboard
});
const stats = [
  { label: "Total Students", value: "265", delta: "+18 this month", trend: "up", icon: Users, tint: "#2563EB" },
  { label: "Total Rooms", value: "180", delta: "4 blocks", trend: "up", icon: DoorClosed, tint: "#7B4CED" },
  { label: "Occupied Rooms", value: "142", delta: "+6 this week", trend: "up", icon: BedDouble, tint: "#3B82F6" },
  { label: "Available Rooms", value: "38", delta: "-4 this week", trend: "down", icon: DoorOpen, tint: "#22C55E" },
  { label: "Pending Complaints", value: "9", delta: "+2 today", trend: "down", icon: MessageSquareWarning, tint: "#EF4444" },
  { label: "Pending Leave Requests", value: "8", delta: "3 awaiting warden", trend: "down", icon: CalendarDays, tint: "#F97316" },
  { label: "Visitors Today", value: "34", delta: "+12 vs yesterday", trend: "up", icon: UserCheck, tint: "#06B6D4" },
  { label: "Fee Collection", value: "\u20B919.8L", delta: "+8% this month", trend: "up", icon: IndianRupee, tint: "#EAB308" }
];
const quickActions = [
  { title: "Add Student", description: "Register a new hostel resident", icon: UserPlus, tint: "#2563EB" },
  { title: "Allocate Room", description: "Assign a bed to a student", icon: BedDouble, tint: "#7B4CED" },
  { title: "Add Room", description: "Create a room in a block", icon: Plus, tint: "#3B82F6" },
  { title: "Generate Fees", description: "Raise a semester invoice", icon: IndianRupee, tint: "#22C55E" },
  { title: "Create Notice", description: "Publish to all blocks", icon: Megaphone, tint: "#EAB308" }
];
function HostelDashboard() {
  const recentStudents = students.slice(0, 5);
  const recentNotices = notices.filter((n) => n.status === "Published").slice(0, 4);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <HostelBreadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Hostel Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Snapshot of residents, rooms, fees, complaints and visitors across all blocks.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          Hostel services running normally
        </span>
      </div>

      {
    /* Stat cards */
  }
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {
    /* Quick actions */
  }
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Common tasks a hostel admin performs every day</p>
          </div>
          <FilePlus2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickActions.map((a) => <QuickActionCard key={a.title} {...a} />)}
        </div>
      </section>

      {
    /* Occupancy + Complaint + Leave overview */
  }
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
    className="lg:col-span-2"
    title="Occupancy by Block"
    description="Occupied vs total capacity"
  >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByBlock} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="occupied" fill="#7B4CED" radius={[6, 6, 0, 0]} />
                <Bar dataKey="capacity" fill="#E5E7EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Complaint Overview" description="Current status breakdown">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complaintOverview} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {complaintOverview.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Leave Request Overview" description="Requests this month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leaveRequestOverview} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {leaveRequestOverview.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
    className="lg:col-span-2"
    title="Recent Leave Requests"
    description="Latest applications awaiting review"
  >
          <ul className="divide-y divide-border">
            {leaveRequests.map((l) => <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{l.student}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {l.room} · {l.from} → {l.to} · {l.reason}
                  </p>
                </div>
                <StatusPill status={l.status} />
              </li>)}
          </ul>
        </ChartCard>
      </div>

      {
    /* Recent activities + recent students */
  }
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
    title="Recent Activity"
    description="Latest events across the hostel"
    action={<button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>}
  >
          <ActivityTimeline items={hostelActivities} />
        </ChartCard>

        <ChartCard
    title="Recent Students"
    description="Latest registered residents"
    action={<Link
      to="/hostel-admin/students"
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/10"
    >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>}
  >
          <ul className="divide-y divide-border">
            {recentStudents.map((s) => <li key={s.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                  {s.photo}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {s.enrollment} · {s.department} · Year {s.year}
                  </p>
                </div>
                <span className="hidden text-xs text-muted-foreground sm:block">Room {s.room}</span>
                <StatusPill status={s.status} />
              </li>)}
          </ul>
        </ChartCard>
      </div>

      {
    /* Recent notices */
  }
      <ChartCard
    title="Recent Notices"
    description="Latest published announcements"
    action={<Link
      to="/hostel-admin/notices"
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/10"
    >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>}
  >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recentNotices.map((n) => <div
    key={n.id}
    className="rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/60"
  >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-[#EAB308]/15 text-[#EAB308]">
                  <Megaphone className="h-4 w-4" />
                </span>
                <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-[10px] font-medium text-[#2563EB]">
                  {n.audience}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-foreground">{n.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
              <p className="mt-3 text-[11px] uppercase tracking-wide text-muted-foreground">{n.publishedAt}</p>
            </div>)}
        </div>
      </ChartCard>
    </div>;
}
export {
  Route
};
