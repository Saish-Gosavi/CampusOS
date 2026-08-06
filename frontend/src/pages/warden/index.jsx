import { createFileRoute, Link } from "@/routes/compat";
import {
  Users,
  BedDouble,
  DoorOpen,
  MessageSquareWarning,
  Megaphone,
  ArrowRight,
  CalendarDays,
  UserCheck,
  Armchair,
  Wrench,
  CheckCircle2,
  XCircle,
  UserPlus,
  Eye,
  Bell
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
  occupancyByBlock,
  complaints,
  visitorRequests
} from "@/lib/hostel-data";
const Route = createFileRoute("/warden/")({
  component: WardenDashboard
});
const stats = [
  { label: "Total Students", value: "142", delta: "+6 this week", trend: "up", icon: Users, tint: "#2563EB" },
  { label: "Occupied Rooms", value: "78", delta: "+3 this week", trend: "up", icon: BedDouble, tint: "#7B4CED" },
  { label: "Available Rooms", value: "22", delta: "-2 this week", trend: "down", icon: DoorOpen, tint: "#22C55E" },
  { label: "Pending Leaves", value: "6", delta: "3 urgent", trend: "down", icon: CalendarDays, tint: "#F97316" },
  { label: "Active Complaints", value: "5", delta: "-2 vs last week", trend: "up", icon: MessageSquareWarning, tint: "#EF4444" },
  { label: "Visitors Today", value: "18", delta: "+5 vs yesterday", trend: "up", icon: UserCheck, tint: "#06B6D4" },
  { label: "Furniture Maintenance", value: "9", delta: "2 completed today", trend: "up", icon: Wrench, tint: "#EAB308" },
  { label: "Notices Published", value: "12", delta: "+3 this month", trend: "up", icon: Megaphone, tint: "#0EA5E9" }
];
const quickActions = [
  { title: "Approve Leave", description: "Review pending requests", icon: CheckCircle2, tint: "#22C55E" },
  { title: "View Complaints", description: "Take action on tickets", icon: MessageSquareWarning, tint: "#EF4444" },
  { title: "Register Visitor", description: "Log new campus visitor", icon: UserPlus, tint: "#06B6D4" },
  { title: "Report Furniture Damage", description: "Raise maintenance", icon: Armchair, tint: "#EAB308" },
  { title: "Publish Notice", description: "Send to residents", icon: Bell, tint: "#0EA5E9" }
];
function WardenDashboard() {
  const recentComplaints = complaints.slice(0, 4);
  const recentVisitors = visitorRequests.slice(0, 4);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Warden
          </h1>
          <p className="text-sm text-muted-foreground">
            Daily snapshot of residents, complaints, visitors and hostel operations assigned to you.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          Assigned: Block A, Block B
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Frequent tasks a warden performs every day</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickActions.map((a) => <QuickActionCard key={a.title} {...a} />)}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Room Occupancy by Block" description="Occupied vs total capacity">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByBlock} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="occupied" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="capacity" fill="#E5E7EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Complaint Status" description="Current breakdown">
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
        <ChartCard title="Leave Status" description="This month">
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
    description="Latest applications awaiting your review"
    action={<Link to="/warden/leaves" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>}
  >
          <ul className="divide-y divide-border">
            {leaveRequests.slice(0, 5).map((l) => <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{l.student}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {l.room} · {l.from} → {l.to} · {l.reason}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusPill status={l.status} />
                  {l.status === "Pending" && <>
                      <button className="grid h-7 w-7 place-items-center rounded-md bg-[#22C55E]/10 text-[#16A34A] hover:bg-[#22C55E]/20">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="grid h-7 w-7 place-items-center rounded-md bg-[#EF4444]/10 text-[#DC2626] hover:bg-[#EF4444]/20">
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    </>}
                </div>
              </li>)}
          </ul>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
    title="Recent Complaints"
    description="Latest tickets from residents"
    action={<Link to="/warden/complaints" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>}
  >
          <ul className="divide-y divide-border">
            {recentComplaints.map((c) => <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.raisedBy} · {c.room} · {c.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusPill status={c.priority} />
                  <StatusPill status={c.status} />
                </div>
              </li>)}
          </ul>
        </ChartCard>

        <ChartCard
    title="Recent Visitors"
    description="Latest visitor requests"
    action={<Link to="/warden/visitors" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>}
  >
          <ul className="divide-y divide-border">
            {recentVisitors.map((v) => <li key={v.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] text-xs font-semibold text-white">
                  {v.visitorName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{v.visitorName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {v.relation} of {v.student} · {v.purpose}
                  </p>
                </div>
                <StatusPill status={v.status} />
                <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Eye className="h-3.5 w-3.5" />
                </button>
              </li>)}
          </ul>
        </ChartCard>
      </div>

      <ChartCard title="Recent Activity" description="Latest events across your assigned hostels">
        <ActivityTimeline items={hostelActivities} />
      </ChartCard>
    </div>;
}
export {
  Route
};
