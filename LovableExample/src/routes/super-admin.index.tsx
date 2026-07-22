import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  UserCog,
  ShieldCheck,
  Megaphone,
  DatabaseBackup,
  ArrowRight,
  Users,
  GraduationCap,
  Activity as ActivityIcon,
  ServerCog,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import {
  activities,
  adminDistribution,
  collegeDistribution,
  moduleUsage,
  recentColleges,
  studentDistribution,
} from "@/lib/admin-data";

export const Route = createFileRoute("/super-admin/")({
  component: DashboardPage,
});

const PIE_COLORS = ["#2563EB", "#7B4CED", "#3B82F6", "#22C55E", "#EAB308"];

// Super Admin scope: platform-wide oversight only.
const superAdminStats = [
  { label: "Total Colleges", value: "24", delta: "+3 this month", trend: "up" as const, icon: Building2, tint: "#2563EB" },
  { label: "Total Admins", value: "179", delta: "+13 this month", trend: "up" as const, icon: UserCog, tint: "#7B4CED" },
  { label: "System Roles", value: "9", delta: "Configured", trend: "up" as const, icon: ShieldCheck, tint: "#3B82F6" },
  { label: "Total Students", value: "18,472", delta: "+312 this month", trend: "up" as const, icon: GraduationCap, tint: "#EAB308" },
  { label: "Active Users (24h)", value: "12,981", delta: "-1.2% vs yesterday", trend: "down" as const, icon: Users, tint: "#22C55E" },
  { label: "Platform Uptime", value: "99.98%", delta: "Last 30 days", trend: "up" as const, icon: ActivityIcon, tint: "#22C55E" },
];

const quickActions = [
  { title: "Create College", description: "Onboard a new institution", icon: Building2, tint: "#2563EB", to: "/super-admin/colleges" },
  { title: "Create Admin", description: "Assign a module administrator", icon: UserCog, tint: "#7B4CED", to: "/super-admin/admins" },
  { title: "Add Role", description: "Define permissions & scope", icon: ShieldCheck, tint: "#3B82F6", to: "/super-admin/roles" },
  { title: "Global Notice", description: "Broadcast to all colleges", icon: Megaphone, tint: "#EAB308", to: "/super-admin/notices" },
  { title: "System Backup", description: "Trigger platform backup", icon: DatabaseBackup, tint: "#22C55E", to: "/super-admin/system-health" },
] as const;

function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Super Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Platform-wide overview across every campus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            All systems operational
          </span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {superAdminStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Quick actions */}
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Platform-level tasks reserved for the Super Admin</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickActions.map((a) => (
            <QuickActionCard key={a.title} title={a.title} description={a.description} icon={a.icon} tint={a.tint} onClick={() => navigate({ to: a.to })} />
          ))}
        </div>
      </section>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Platform Usage"
          description="Active sessions across modules (last 6 months)"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moduleUsage} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="Hostel" stroke="#7B4CED" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Library" stroke="#3B82F6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Inventory" stroke="#22C55E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Admins by Module" description="Distribution of module administrators">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={adminDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {adminDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Colleges by City" description="Institutional footprint">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeDistribution} layout="vertical" margin={{ top: 5, right: 12, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="#7B4CED" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Student Distribution" description="Enrolled students by year">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={studentDistribution}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {studentDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* System health + colleges + activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="System Health" description="Service status snapshot">
          <ul className="divide-y divide-border">
            {[
              { name: "API Gateway", status: "Operational", tint: "#22C55E" },
              { name: "Database", status: "Operational", tint: "#22C55E" },
              { name: "Auth Service", status: "Operational", tint: "#22C55E" },
              { name: "File Storage", status: "Degraded", tint: "#EAB308" },
              { name: "Background Jobs", status: "Operational", tint: "#22C55E" },
            ].map((s) => (
              <li key={s.name} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <ServerCog className="h-4 w-4 text-muted-foreground" />
                  {s.name}
                </div>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${s.tint}1A`, color: s.tint }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.tint }} />
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </ChartCard>

        <ChartCard
          title="Recent Colleges"
          description="Latest institutions onboarded"
          action={
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-2 py-2 font-medium">Name</th>
                  <th className="px-2 py-2 font-medium">City</th>
                  <th className="px-2 py-2 font-medium">Students</th>
                  <th className="px-2 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentColleges.map((r) => (
                  <tr key={r.name} className="transition-colors hover:bg-muted/40">
                    <td className="whitespace-nowrap px-2 py-2.5 font-medium text-foreground">{r.name}</td>
                    <td className="whitespace-nowrap px-2 py-2.5 text-foreground">{r.city}</td>
                    <td className="whitespace-nowrap px-2 py-2.5 text-foreground">{r.students.toLocaleString()}</td>
                    <td className="px-2 py-2.5">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        <ChartCard
          title="Recent Activity"
          description="Latest platform-level events"
          action={
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        >
          <ActivityTimeline items={activities} />
        </ChartCard>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    Active: { bg: "#22C55E1A", fg: "#16A34A" },
    Pending: { bg: "#EAB3081A", fg: "#B45309" },
    Inactive: { bg: "#EF44441A", fg: "#DC2626" },
  };
  const { bg, fg } = map[status] ?? map.Active;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: fg }} />
      {status}
    </span>
  );
}
