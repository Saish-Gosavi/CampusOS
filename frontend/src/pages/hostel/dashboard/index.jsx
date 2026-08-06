import { createFileRoute, Link } from "@/routes/compat";
import { useState, useEffect, useRef } from "react";
import {
  Users, Building2, BedDouble, AlertCircle,
  CalendarClock, UserCircle2, IndianRupee, Megaphone,
  UserPlus, CheckCircle2, ArrowRight, TrendingUp, TrendingDown,
  Activity, Clock
} from "lucide-react";
import { useHostelAdminStats } from "@/services/queries/dashboardHooks";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { Button } from "@/components/ui/button";

const Route = createFileRoute("/hostel-admin/")({
  component: HostelDashboard,
});

/* ─── Animated counter ─── */
function AnimatedCount({ target, prefix = "", suffix = "" }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = 0;
    const duration = 900;
    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (target - start) * ease));
      if (progress < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  return <>{prefix}{display}{suffix}</>;
}

/* ─── Stat card ─── */
function StatCard({ title, value, icon: Icon, delta, trend, tint, delay = 0 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms, box-shadow 0.2s, translate 0.2s` }}
    >
      {/* subtle gradient glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(circle at top right, ${tint}14 0%, transparent 70%)` }}
      />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {typeof value === "number"
              ? <AnimatedCount target={value} />
              : value
            }
          </p>
        </div>
        <div
          className="grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${tint}18`, color: tint }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-emerald-600" : "text-rose-500"}`}>
        {trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        <span>{delta}</span>
      </div>
    </div>
  );
}

/* ─── Quick action card ─── */
function QuickActionCard({ title, description, icon: Icon, url, tint, gradient }) {
  return (
    <Link
      to={url}
      className="group relative flex flex-1 flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 min-w-[190px]"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: gradient }}
      />
      <div
        className="relative z-10 grid h-11 w-11 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${tint}18`, color: tint }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="relative z-10">
        <h4 className="text-sm font-semibold text-foreground group-hover:text-foreground">{title}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div
        className="relative z-10 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ color: tint }}
      >
        Go <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ status }) {
  const map = {
    pending:  { bg: "bg-amber-50 border-amber-200 text-amber-700",  dot: "bg-amber-400" },
    approved: { bg: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-400" },
    rejected: { bg: "bg-rose-50 border-rose-200 text-rose-600",    dot: "bg-rose-400" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${s.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ─── Empty state ─── */
function EmptyState({ text }) {
  return (
    <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-center">
      <Activity className="h-6 w-6 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

/* ─── Skeleton loader ─── */
function SkeletonDashboard() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 animate-pulse">
      <div className="h-10 w-64 rounded-xl bg-muted" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-36 rounded-2xl bg-muted" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-64 rounded-2xl bg-muted" />
        <div className="h-64 rounded-2xl bg-muted" />
      </div>
    </div>
  );
}

function HostelDashboard() {
  const { data: dashboardData, isLoading, isError } = useHostelAdminStats();

  if (isLoading) return <SkeletonDashboard />;

  if (isError || !dashboardData) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
        <AlertCircle className="h-10 w-10 text-rose-400" />
        <p className="text-base font-medium text-foreground">Failed to load dashboard</p>
        <p className="text-sm text-muted-foreground">Please refresh the page or try again later.</p>
      </div>
    );
  }

  const { stats, charts, lists } = dashboardData;

  const statsCards = [
    { title: "Total Students",        value: stats.totalStudents,       icon: Users,         trend: "up",   delta: "Active residents",        tint: "#2563EB" },
    { title: "Total Rooms",           value: stats.totalRooms,          icon: Building2,     trend: "up",   delta: "Configured rooms",         tint: "#7B4CED" },
    { title: "Occupied Rooms",        value: stats.occupiedRooms,       icon: BedDouble,     trend: "up",   delta: "Currently occupied",       tint: "#0EA5E9" },
    { title: "Available Rooms",       value: stats.availableRooms,      icon: Building2,     trend: "up",   delta: "Vacant & ready",           tint: "#22C55E" },
    { title: "Pending Complaints",    value: stats.pendingComplaints,   icon: AlertCircle,   trend: "down", delta: "Unresolved issues",        tint: "#EF4444" },
    { title: "Pending Leave Requests",value: stats.pendingLeaves,       icon: CalendarClock, trend: "down", delta: "Awaiting approval",        tint: "#EAB308" },
    { title: "Visitors Today",        value: stats.visitorsToday,       icon: UserCircle2,   trend: "up",   delta: "Today's check-ins",       tint: "#0EA5E9" },
    { title: "Fee Collection",        value: stats.feeCollection > 0 ? `₹${(stats.feeCollection / 100000).toFixed(1)}L` : "₹0", icon: IndianRupee, trend: "up", delta: "Total collected", tint: "#F59E0B" },
  ];

  const quickActions = [
    { title: "Add Student",      description: "Register a new resident",   icon: UserPlus,    url: "/hostel-admin/students",  tint: "#2563EB", gradient: "radial-gradient(circle at top left, #2563EB0F 0%, transparent 70%)" },
    { title: "Generate Fee",     description: "Raise a fee for a student", icon: IndianRupee, url: "/hostel-admin/fee-management",      tint: "#10B981", gradient: "radial-gradient(circle at top left, #10B9810F 0%, transparent 70%)" },
    { title: "Create Notice",    description: "Publish to all students",   icon: Megaphone,   url: "/hostel-admin/notices",   tint: "#F59E0B", gradient: "radial-gradient(circle at top left, #F59E0B0F 0%, transparent 70%)" },
    { title: "Hostel Management",description: "Manage hostel properties",  icon: Building2,   url: "/hostel-admin/hostels",   tint: "#7B4CED", gradient: "radial-gradient(circle at top left, #7B4CED0F 0%, transparent 70%)" },
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-7">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back, Hostel Admin 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Snapshot of residents, rooms, fees, complaints and visitors across all blocks.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          All hostel services running normally
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, i) => (
          <StatCard key={card.title} {...card} delay={i * 60} />
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">Quick Actions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Shortcuts to the most common tasks</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          {quickActions.map((action) => (
            <QuickActionCard key={action.title} {...action} />
          ))}
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Occupancy by Block */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Occupancy by Block</h3>
              <p className="text-xs text-muted-foreground">Occupied beds vs total capacity</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#7B4CED]" /> Occupied</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-200" /> Capacity</span>
            </div>
          </div>
          <div className="h-[240px] w-full">
            {charts.occupancyByBlock.length === 0 ? (
              <EmptyState text="No block data yet — add blocks and rooms to see occupancy." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.occupancyByBlock} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barCategoryGap="30%">
                  <XAxis dataKey="block" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <RechartsTooltip
                    cursor={{ fill: "#7B4CED08" }}
                    contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgb(0 0 0 / 0.08)", fontSize: "12px" }}
                  />
                  <Bar dataKey="capacity" name="Capacity" fill="#E2E8F0" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="occupied" name="Occupied" fill="#7B4CED" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Complaint Overview */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-semibold">Complaint Overview</h3>
            <p className="text-xs text-muted-foreground">Current status breakdown</p>
          </div>
          <div className="flex-1 h-[200px]">
            {charts.complaintOverview.length === 0 ? (
              <EmptyState text="No complaints yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={charts.complaintOverview} innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" animationBegin={200} animationDuration={800}>
                    {charts.complaintOverview.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgb(0 0 0 / 0.08)", fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {charts.complaintOverview.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {charts.complaintOverview.map((entry, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name} <span className="font-semibold text-foreground">{entry.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Lists Row ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Recent Leave Requests */}
        <div className="flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="text-base font-semibold">Recent Leave Requests</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest applications awaiting review</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-medium text-primary hover:text-primary/80 gap-1 pr-0" asChild>
              <Link to="/hostel-admin/leaves">View all <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="flex-1 p-3">
            {lists.recentLeaves.length === 0 ? (
              <EmptyState text="No leave requests yet." />
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {lists.recentLeaves.map(leave => (
                  <div key={leave.id} className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                        {leave.studentName?.charAt(0) || "S"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{leave.studentName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          Room {leave.room} · {leave.date}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={leave.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h3 className="text-base font-semibold">Recent Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest events across the hostel</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs font-medium text-primary hover:text-primary/80 gap-1 pr-0" asChild>
              <Link to="/hostel-admin/reports">View all <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </div>
          <div className="flex-1 p-3">
            {lists.recentActivity.length === 0 ? (
              <EmptyState text="No activity logs yet." />
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {lists.recentActivity.map(activity => {
                  let tint = "#2563EB"; let Icon = CheckCircle2;
                  if (activity.action?.includes("COMPLAINT")) { tint = "#EF4444"; Icon = AlertCircle; }
                  else if (activity.action?.includes("ROOM"))  { tint = "#7B4CED"; Icon = BedDouble; }
                  else if (activity.action?.includes("FEE"))   { tint = "#10B981"; Icon = IndianRupee; }
                  else if (activity.action?.includes("NOTICE")){ tint = "#F59E0B"; Icon = Megaphone; }

                  return (
                    <div key={activity.id} className="flex items-start justify-between py-3 px-2 rounded-xl hover:bg-muted/40 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full mt-0.5" style={{ background: `${tint}18`, color: tint }}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{activity.description || "—"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.time ? new Date(activity.time).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—"}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export { Route };
