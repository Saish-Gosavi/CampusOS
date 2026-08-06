import { createFileRoute } from "@/routes/compat";
import {
  Package,
  AlertTriangle,
  ClipboardList,
  ClipboardCheck,
  ArrowRightLeft,
  PackagePlus,
  Truck,
  BookUp,
  Megaphone,
  ArrowRight
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
  YAxis
} from "recharts";
import { StatCard } from "@/components/admin/StatCard";
import { QuickActionCard } from "@/components/admin/QuickActionCard";
import { ChartCard } from "@/components/admin/ChartCard";
import {
  borrowingTrend,
  departmentSpend,
  inventoryActivities,
  monthlyProcurement,
  stockByCategory
} from "@/lib/inventory-data";
const Route = createFileRoute("/inventory-admin/")({
  component: InventoryDashboard
});
const PIE_COLORS = ["#2563EB", "#7B4CED", "#0D9488", "#22C55E", "#EAB308", "#EF4444"];
const stats = [
  { label: "Total Items", value: "1,160", delta: "+42 this month", trend: "up", icon: Package, tint: "#2563EB" },
  { label: "Low Stock", value: "18", delta: "+3 this week", trend: "down", icon: AlertTriangle, tint: "#EAB308" },
  { label: "Pending Requests", value: "12", delta: "+4 today", trend: "down", icon: ClipboardList, tint: "#7B4CED" },
  { label: "Approved Requests", value: "86", delta: "+11 this week", trend: "up", icon: ClipboardCheck, tint: "#22C55E" },
  { label: "Borrowed Items", value: "24", delta: "+2 today", trend: "up", icon: ArrowRightLeft, tint: "#3B82F6" },
  { label: "Vendors", value: "38", delta: "+1 this month", trend: "up", icon: Truck, tint: "#0D9488" }
];
const quickActions = [
  { title: "Add Item", description: "Register a new inventory item", icon: PackagePlus, tint: "#2563EB" },
  { title: "Approve Request", description: "Review pending procurement", icon: ClipboardCheck, tint: "#22C55E" },
  { title: "Receive Goods", description: "Create a goods receipt note", icon: Truck, tint: "#7B4CED" },
  { title: "Issue Item", description: "Lend an item to a department", icon: BookUp, tint: "#EAB308" },
  { title: "Create Notice", description: "Broadcast to departments", icon: Megaphone, tint: "#EF4444" }
];
function InventoryDashboard() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, Inventory Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Stock levels, procurement pipeline and borrowings across the campus.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
          Inventory services running normally
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Common procurement and stock tasks</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickActions.map((a) => <QuickActionCard key={a.title} {...a} />)}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
    className="lg:col-span-2"
    title="Procurement Pipeline"
    description="Requested vs approved per month"
  >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyProcurement} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="requested" stroke="#7B4CED" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="approved" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Stock by Category" description="Distribution of items">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockByCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {stockByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Department Spend" description="₹ spend this year">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentSpend} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1e3).toFixed(0)}k`} />
                <Tooltip
    formatter={(v) => `\u20B9${v.toLocaleString("en-IN")}`}
    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
  />
                <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Borrowing Trend" description="Borrowed vs returned">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={borrowingTrend} margin={{ top: 5, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="borrowed" stroke="#3B82F6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="returned" stroke="#22C55E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
    title="Recent Activity"
    description="Latest procurement and stock events"
    action={<button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </button>}
  >
        <ol className="relative space-y-4 border-l border-dashed border-border pl-5">
          {inventoryActivities.map((item) => <li key={item.id} className="relative">
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
            </li>)}
        </ol>
      </ChartCard>
    </div>;
}
export {
  Route
};
