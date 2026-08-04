import { createFileRoute } from "@/routes/compat";
import { BarChart3, Users, BedDouble, MessageSquareWarning, UserRoundCheck, Armchair, Download, FileText, FileSpreadsheet, FileType } from "lucide-react";
import {
  Area,
  AreaChart,
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
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { Button } from "@/components/ui/button";
import {
  complaintOverview,
  feeCollection,
  leaveRequestOverview,
  occupancyByBlock,
  studentsByYear,
  complaintTrends
} from "@/lib/hostel-data";
const Route = createFileRoute("/warden/reports")({
  component: ReportsPage
});
const TINT = "#0EA5E9";
const visitorTrend = [
  { day: "Mon", total: 12, approved: 10 },
  { day: "Tue", total: 18, approved: 16 },
  { day: "Wed", total: 15, approved: 13 },
  { day: "Thu", total: 22, approved: 18 },
  { day: "Fri", total: 28, approved: 24 },
  { day: "Sat", total: 34, approved: 30 },
  { day: "Sun", total: 20, approved: 18 }
];
const furnitureStatus = [
  { name: "In Use", value: 9, color: "#22C55E" },
  { name: "Maintenance", value: 2, color: "#EAB308" },
  { name: "Damaged", value: 3, color: "#EF4444" },
  { name: "In Storage", value: 1, color: "#3B82F6" },
  { name: "Retired", value: 1, color: "#6B7280" }
];
function ReportsPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Reports"
    description="Beautiful analytics across occupancy, complaints, visitors, leaves and furniture."
    icon={BarChart3}
    tint={TINT}
    breadcrumbs={[{ label: "Reports" }]}
    action={<div className="flex gap-2">
            <Button variant="outline"><FileType className="mr-1.5 h-4 w-4" /> PDF</Button>
            <Button variant="outline"><FileSpreadsheet className="mr-1.5 h-4 w-4" /> Excel</Button>
            <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90"><Download className="mr-1.5 h-4 w-4" /> Download Report</Button>
          </div>}
  />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Students" value="142" delta="+6 this week" trend="up" icon={Users} tint="#2563EB" />
        <StatCard label="Occupancy %" value="78%" delta="+3% vs last month" trend="up" icon={BedDouble} tint="#7B4CED" />
        <StatCard label="Pending Complaints" value="5" delta="-2 this week" trend="up" icon={MessageSquareWarning} tint="#EF4444" />
        <StatCard label="Visitors (7d)" value="149" delta="+22 vs last week" trend="up" icon={UserRoundCheck} tint="#06B6D4" />
        <StatCard label="Furniture (Good)" value="9" delta="Out of 16" trend="up" icon={Armchair} tint="#EAB308" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Occupancy Report" description="Occupied vs capacity per block">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByBlock}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="name" fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="occupied" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="capacity" fill="#E5E7EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Complaint Status" description="Live distribution">
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Fee Collection Trend" description="Amount collected per month (₹ Lakhs)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeCollection}>
                <defs>
                  <linearGradient id="feeG" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area dataKey="amount" stroke="#22C55E" fill="url(#feeG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Complaint Analysis" description="Raised vs resolved per month">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="raised" fill="#EF4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Visitor Report" description="Last 7 days">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="day" fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line dataKey="total" stroke="#06B6D4" strokeWidth={2} dot={{ r: 3 }} />
                <Line dataKey="approved" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Leave Report" description="Status this month">
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

        <ChartCard title="Furniture Status" description="Current condition">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={furnitureStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {furnitureStatus.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Student Statistics" description="Distribution by academic year">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentsByYear} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
              <XAxis type="number" fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis type="category" dataKey="year" fontSize={12} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#7B4CED" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><FileText className="h-4 w-4 text-muted-foreground" /> Available Reports</div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Student Report", "Occupancy Report", "Leave Report", "Complaint Report", "Visitor Report", "Furniture Report"].map((r) => <button key={r} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted/40">
              <span className="font-medium text-foreground">{r}</span>
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>)}
        </div>
      </div>
    </div>;
}
export {
  Route
};
