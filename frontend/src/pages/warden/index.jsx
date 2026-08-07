import React, { useState, useEffect } from "react";
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
  Bell,
  IndianRupee
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
import { dashboardApi } from "@/services/api";

const Route = createFileRoute("/warden/")({
  component: WardenDashboard
});
const quickActions = [
  { title: "Approve Leave", description: "Review pending requests", icon: CheckCircle2, tint: "#22C55E", link: "/hostel-admin/leave-approval" },
  { title: "View Complaints", description: "Take action on tickets", icon: MessageSquareWarning, tint: "#EF4444", link: "/hostel-admin/complaints" },
  { title: "Register Visitor", description: "Log new campus visitor", icon: UserPlus, tint: "#06B6D4", link: "/hostel-admin/visitors" },
  { title: "Report Furniture Damage", description: "Raise maintenance", icon: Armchair, tint: "#EAB308", link: "/hostel-admin/furniture" },
  { title: "Publish Notice", description: "Send to residents", icon: Bell, tint: "#0EA5E9", link: "/hostel-admin/notices" }
];

function WardenDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getHostelAdminStats()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load warden stats", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-muted-foreground">Loading dashboard...</div>;
  }

  const stats = [
    { label: "Total Students", value: data?.studentsCount || 0, delta: "Enrolled", trend: "up", icon: Users, tint: "#2563EB" },
    { label: "Occupied Rooms", value: data?.occupiedRoomsCount || 0, delta: "Active", trend: "up", icon: BedDouble, tint: "#7B4CED" },
    { label: "Available Rooms", value: data?.availableRoomsCount || 0, delta: "Free", trend: "down", icon: DoorOpen, tint: "#22C55E" },
    { label: "Pending Leaves", value: data?.pendingLeaves || 0, delta: "Requires Action", trend: "down", icon: CalendarDays, tint: "#F97316" },
    { label: "Active Complaints", value: data?.pendingComplaints || 0, delta: "Unresolved", trend: "up", icon: MessageSquareWarning, tint: "#EF4444" },
    { label: "Visitors Today", value: data?.visitorsToday || 0, delta: "Checked in", trend: "up", icon: UserCheck, tint: "#06B6D4" },
    { label: "Fee Collection", value: `₹${(data?.feeCollection || 0).toLocaleString()}`, delta: "Total", trend: "up", icon: IndianRupee || Armchair, tint: "#10B981" }
  ];

  const occupancyByBlock = data?.blocks?.map(b => {
    let capacity = 0;
    let occupied = 0;
    b.rooms?.forEach(r => {
      capacity += r.capacity || 0;
      occupied += r.beds?.length || 0; // rough proxy for occupied beds returned from API
    });
    return { name: b.name, capacity, occupied };
  }) || [];
  
  const complaintOverview = data?.complaintDistribution?.map(c => ({
    name: c.status,
    value: c._count.id,
    color: c.status === "open" ? "#EF4444" : c.status === "pending" ? "#EAB308" : c.status === "resolved" ? "#22C55E" : "#6B7280"
  })) || [];

  const leaveRequestOverview = data?.leaveDistribution?.map(l => ({
    name: l.status,
    value: l._count.id,
    color: l.status === "pending" ? "#EAB308" : l.status === "approved" ? "#22C55E" : "#EF4444"
  })) || [];

  const recentLeaves = data?.recentLeaves || [];
  const recentActivities = data?.recentAuditLogs || [];
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
            {recentLeaves.map((l) => <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{l.studentName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Room {l.room} · {l.date} · {l.reason}
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
            {(data?.recentComplaints || []).map((c) => <li key={c.id} className="flex items-center justify-between gap-3 py-3">
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
            {!(data?.recentComplaints?.length) && <li className="py-4 text-center text-sm text-muted-foreground">No recent complaints</li>}
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
            {(data?.recentVisitors || []).map((v) => <li key={v.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#06B6D4] to-[#0EA5E9] text-xs font-semibold text-white">
                  {v.visitorName?.split(" ").map((n) => n[0]).slice(0, 2).join("")}
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
        <ActivityTimeline items={recentActivities} />
      </ChartCard>
    </div>;
}
export {
  Route
};
