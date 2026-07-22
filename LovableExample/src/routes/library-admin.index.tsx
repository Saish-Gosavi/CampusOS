import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  BookCheck,
  BookUp,
  BookMarked,
  AlarmClock,
  Users,
  BookPlus,
  Undo2,
  Megaphone,
  ArrowRight,
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
import { LibraryBreadcrumbs } from "@/components/library/LibraryBreadcrumbs";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";
import {
  bookCirculation,
  departmentUsage,
  fineCollection,
  libraryActivities,
  mostBorrowed,
} from "@/lib/library-data";

export const Route = createFileRoute("/library-admin/")({
  component: LibraryDashboard,
});

const PIE_COLORS = ["#0D9488", "#7B4CED", "#2563EB", "#22C55E", "#EAB308"];

const stats = [
  { label: "Total Books", value: "4,820", delta: "+64 this month", trend: "up" as const, icon: BookOpen, tint: "#0D9488" },
  { label: "Available Books", value: "3,412", delta: "+12 today", trend: "up" as const, icon: BookCheck, tint: "#22C55E" },
  { label: "Issued Books", value: "1,148", delta: "+38 this week", trend: "up" as const, icon: BookUp, tint: "#2563EB" },
  { label: "Reserved Books", value: "124", delta: "+9 this week", trend: "up" as const, icon: BookMarked, tint: "#7B4CED" },
  { label: "Overdue Books", value: "42", delta: "-6 vs last week", trend: "up" as const, icon: AlarmClock, tint: "#EF4444" },
  { label: "Total Members", value: "2,315", delta: "+52 this month", trend: "up" as const, icon: Users, tint: "#EAB308" },
];

const quickActions = [
  { title: "Add Book", description: "Catalog a new title", icon: BookPlus, tint: "#0D9488" },
  { title: "Issue Book", description: "Lend a copy to a member", icon: BookUp, tint: "#2563EB" },
  { title: "Return Book", description: "Check in a returned copy", icon: Undo2, tint: "#22C55E" },
  { title: "Create Notice", description: "Publish a library notice", icon: Megaphone, tint: "#EAB308" },
];

function LibraryDashboard() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <LibraryBreadcrumbs items={[{ label: "Dashboard" }]} />
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Library Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Circulation, catalog and member activity at a glance.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          Library services running normally
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Common circulation tasks performed at the counter</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <QuickActionCard key={a.title} {...a} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Book Circulation"
          description="Monthly issued vs returned"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookCirculation} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="issued" stroke="#0D9488" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="returned" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Fine Collection" description="Monthly fines collected (₹)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fineCollection} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
                  formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="amount" fill="#EAB308" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Most Borrowed Books" description="Top titles this semester">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostBorrowed} layout="vertical" margin={{ top: 5, right: 12, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} width={140} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="#7B4CED" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Department-wise Usage" description="Borrows by department">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentUsage} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {departmentUsage.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Recent Activity"
        description="Latest events across the library"
        action={
          <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#0D9488] hover:bg-[#0D9488]/10">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>
        }
      >
        <ol className="relative space-y-4 border-l border-dashed border-border pl-5">
          {libraryActivities.map((item) => (
            <li key={item.id} className="relative">
              <span
                className="absolute -left-[30px] grid h-9 w-9 place-items-center rounded-full ring-4 ring-card"
                style={{ backgroundColor: `${item.tint}1A`, color: item.tint }}
              >
                <item.icon className="h-4 w-4" />
              </span>
              <div className="rounded-lg border border-border bg-background/60 p-3 transition-colors hover:bg-muted/40">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{item.time}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.meta}</p>
              </div>
            </li>
          ))}
        </ol>
      </ChartCard>
    </div>
  );
}
