import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  DoorOpen,
  UserCheck,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  QrCode,
  UserPlus,
  Ticket,
  LogIn,
  LogOut,
  BadgeAlert
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
import { inOutEntries, visitorRequests } from "@/lib/hostel-data";
import { hourlyMovement, securityActivities, incidents } from "@/lib/security-data";
const Route = createFileRoute("/security/")({
  component: SecurityDashboard
});
const stats = [
  { label: "Students Inside", value: "104", delta: "+8 vs 1h ago", trend: "up", icon: Users, tint: "#22C55E" },
  { label: "Students Outside", value: "38", delta: "-4 vs 1h ago", trend: "down", icon: DoorOpen, tint: "#F97316" },
  { label: "Visitors Today", value: "18", delta: "+3 vs yesterday", trend: "up", icon: UserCheck, tint: "#06B6D4" },
  { label: "Pending Approvals", value: "4", delta: "2 urgent", trend: "down", icon: BadgeAlert, tint: "#EAB308" },
  { label: "Late Entries", value: "3", delta: "1 flagged", trend: "down", icon: Clock, tint: "#7B4CED" },
  { label: "Late Exits", value: "2", delta: "on watchlist", trend: "down", icon: AlertTriangle, tint: "#EF4444" },
  { label: "Emergency Incidents", value: "1", delta: "open", trend: "down", icon: ShieldAlert, tint: "#DC2626" },
  { label: "Gate Passes Active", value: "12", delta: "3 expiring soon", trend: "up", icon: Ticket, tint: "#2563EB" }
];
const quickActions = [
  { title: "Scan Student QR", description: "Verify entry / exit", icon: QrCode, tint: "#2563EB" },
  { title: "Register Visitor", description: "New visitor check-in", icon: UserPlus, tint: "#06B6D4" },
  { title: "Verify Gate Pass", description: "Validate outing permission", icon: Ticket, tint: "#7B4CED" },
  { title: "Log Incident", description: "Report a security event", icon: ShieldAlert, tint: "#EF4444" }
];
function SecurityDashboard() {
  const todayEntries = inOutEntries.filter((e) => e.status === "Returned" || e.status === "Late Return").slice(0, 5);
  const todayExits = inOutEntries.filter((e) => e.status === "Outside" || e.status === "Overdue").slice(0, 5);
  const recentVisitors = visitorRequests.slice(0, 5);
  const recentIncidents = incidents.slice(0, 4);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Security Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Live snapshot of gate operations, visitor movement and incidents on campus.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#22C55E]" />
          On duty · Main + Hostel Gate
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
          <p className="text-xs text-muted-foreground">Frequent security desk operations</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => <QuickActionCard key={a.title} {...a} />)}
        </div>
      </section>

      <ChartCard title="Hourly Gate Movement" description="Today's entries vs exits">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyMovement} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="entries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="entries" stroke="#22C55E" fill="url(#entries)" strokeWidth={2} />
              <Area type="monotone" dataKey="exits" stroke="#F97316" fill="url(#exits)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
    title="Today's Entries"
    description="Recent students returning to campus"
    action={<Link to="/security/in-out" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>}
  >
          <ul className="divide-y divide-border">
            {todayEntries.map((e) => <li key={e.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#22C55E]/10 text-[#16A34A]">
                  <LogIn className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{e.student}</p>
                  <p className="truncate text-xs text-muted-foreground">{e.room} · {e.gate} · IN {e.inTime}</p>
                </div>
                <StatusPill status={e.status} />
              </li>)}
          </ul>
        </ChartCard>

        <ChartCard
    title="Today's Exits"
    description="Students currently outside campus"
    action={<Link to="/security/in-out" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>}
  >
          <ul className="divide-y divide-border">
            {todayExits.map((e) => <li key={e.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F97316]/10 text-[#EA580C]">
                  <LogOut className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{e.student}</p>
                  <p className="truncate text-xs text-muted-foreground">{e.room} · {e.purpose} · OUT {e.outTime}</p>
                </div>
                <StatusPill status={e.status} />
              </li>)}
          </ul>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
    title="Recent Visitors"
    description="Latest visitor activity"
    action={<Link to="/security/visitors" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
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
                  <p className="truncate text-xs text-muted-foreground">{v.relation} of {v.student} · {v.purpose}</p>
                </div>
                <StatusPill status={v.status} />
              </li>)}
          </ul>
        </ChartCard>

        <ChartCard
    title="Emergency Alerts"
    description="Recent incidents on campus"
    action={<Link to="/security/incidents" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/10">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>}
  >
          <ul className="divide-y divide-border">
            {recentIncidents.map((i) => <li key={i.id} className="flex items-center gap-3 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#EF4444]/10 text-[#DC2626]">
                  <ShieldAlert className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{i.type} · {i.location}</p>
                  <p className="truncate text-xs text-muted-foreground">{i.dateTime} · by {i.reportedBy}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={i.severity} />
                  <StatusPill status={i.status} />
                </div>
              </li>)}
          </ul>
        </ChartCard>
      </div>

      <ChartCard title="Daily Activity Timeline" description="Latest events across the gate">
        <ActivityTimeline items={securityActivities} />
      </ChartCard>
    </div>;
}
export {
  Route
};
