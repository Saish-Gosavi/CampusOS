import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Users,
  BedDouble,
  MessageSquareWarning,
  IndianRupee,
  Download,
  FileText,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  TrendingDown
} from "lucide-react";
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
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { ChartCard } from "@/components/admin/ChartCard";
import { Button } from "@/components/ui/button";
import {
  complaintOverview,
  complaintTrends,
  feeCollection,
  leaveRequestOverview,
  occupancyByBlock,
  students,
  studentsByYear,
  fees,
  complaints
} from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/hostel-admin/reports")({
  component: ReportsPage
});
const PIE_COLORS = ["#2563EB", "#7B4CED", "#22C55E", "#EAB308", "#EF4444", "#0D9488"];
const visitorTrend = [
  { day: "Mon", visitors: 34, approved: 30 },
  { day: "Tue", visitors: 41, approved: 36 },
  { day: "Wed", visitors: 28, approved: 25 },
  { day: "Thu", visitors: 52, approved: 47 },
  { day: "Fri", visitors: 68, approved: 62 },
  { day: "Sat", visitors: 96, approved: 89 },
  { day: "Sun", visitors: 84, approved: 78 }
];
const leaveByType = [
  { name: "Home Visit", value: 42 },
  { name: "Medical", value: 18 },
  { name: "Family", value: 24 },
  { name: "Personal", value: 12 },
  { name: "Emergency", value: 6 },
  { name: "Academic", value: 8 }
];
const demographics = [
  { name: "Male", value: 214 },
  { name: "Female", value: 138 }
];
function ReportsPage() {
  const totals = useMemo(() => {
    const totalCapacity = occupancyByBlock.reduce((s, b) => s + b.capacity, 0);
    const totalOccupied = occupancyByBlock.reduce((s, b) => s + b.occupied, 0);
    const collected = fees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.amount, 0);
    const pendingAmt = fees.filter((f) => f.status !== "Paid").reduce((s, f) => s + f.amount, 0);
    return {
      students: students.length,
      occupancy: Math.round(totalOccupied / totalCapacity * 100),
      pendingComplaints: complaints.filter((c) => c.status !== "Resolved").length,
      collected,
      pendingAmt
    };
  }, []);
  const download = (fmt) => toast.success(`Report queued for download (${fmt})`);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
    title="Reports & Analytics"
    description="Operational insights across occupancy, fees, complaints, visitors and leaves."
    icon={BarChart3}
    tint="#2563EB"
    breadcrumbs={[{ label: "Reports" }]}
    action={<div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => download("PDF")}>
              <FileText className="mr-1.5 h-4 w-4" /> PDF
            </Button>
            <Button variant="outline" onClick={() => download("CSV")}>
              <FileSpreadsheet className="mr-1.5 h-4 w-4" /> CSV
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-1.5 h-4 w-4" /> Print
            </Button>
            <Button className="bg-[#2563EB] text-white hover:bg-[#1e4fd1]" onClick={() => download("Full Report")}>
              <Download className="mr-1.5 h-4 w-4" /> Download Report
            </Button>
          </div>}
  />

      {
    /* KPI Cards */
  }
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
    label="Total Students"
    value={totals.students.toLocaleString("en-IN")}
    delta="+12 this month"
    trend="up"
    icon={Users}
    tint="#2563EB"
  />
        <KpiCard
    label="Occupancy Rate"
    value={`${totals.occupancy}%`}
    delta="+3.2% vs last month"
    trend="up"
    icon={BedDouble}
    tint="#7B4CED"
    progress={totals.occupancy}
  />
        <KpiCard
    label="Pending Complaints"
    value={totals.pendingComplaints.toString()}
    delta="-2 vs last week"
    trend="down"
    icon={MessageSquareWarning}
    tint="#EF4444"
  />
        <KpiCard
    label="Fee Collection"
    value={`\u20B9${(totals.collected / 1e5).toFixed(1)}L`}
    delta={`\u20B9${(totals.pendingAmt / 1e5).toFixed(1)}L pending`}
    trend="up"
    icon={IndianRupee}
    tint="#22C55E"
  />
      </div>

      {
    /* Row 1 */
  }
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Occupancy Report" description="Occupied vs total capacity per block">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyByBlock}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="occupied" fill="#7B4CED" radius={[6, 6, 0, 0]} />
                <Bar dataKey="capacity" fill="#E5E7EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Fee Collection" description="Monthly collection trend (₹)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeCollection}>
                <defs>
                  <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1e5).toFixed(1)}L`} />
                <Tooltip
    formatter={(v) => `\u20B9${v.toLocaleString("en-IN")}`}
    contentStyle={tooltipStyle}
  />
                <Area type="monotone" dataKey="collected" stroke="#22C55E" strokeWidth={2} fill="url(#feeGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {
    /* Row 2 */
  }
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <ChartCard title="Complaint Analysis" description="Raised vs resolved per month">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="raised" fill="#EF4444" radius={[6, 6, 0, 0]} />
                <Bar dataKey="resolved" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Complaint Status" description="Current breakdown">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={complaintOverview} dataKey="value" nameKey="name" innerRadius={50} outerRadius={95} paddingAngle={2}>
                  {complaintOverview.map((_, i) => <Cell key={i} fill={["#EF4444", "#EAB308", "#22C55E"][i % 3]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {
    /* Row 3 */
  }
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Visitor Report" description="Daily visitor entries this week">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={visitorTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="visitors" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="approved" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Leave Report" description="Applications by type and status">
          <div className="grid h-72 grid-cols-2 gap-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leaveByType} dataKey="value" nameKey="name" outerRadius={90} paddingAngle={2}>
                  {leaveByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col justify-center gap-2 text-xs">
              {leaveRequestOverview.map((r, i) => <div key={r.name} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ["#EAB308", "#22C55E", "#EF4444"][i % 3] }} />
                    <span className="font-medium text-foreground">{r.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{r.value}</span>
                </div>)}
            </div>
          </div>
        </ChartCard>
      </div>

      {
    /* Row 4 */
  }
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Student Statistics" description="Distribution by academic year">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByYear} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} horizontal={false} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={80} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {studentsByYear.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Gender Demographics" description="Resident distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={demographics} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  <Cell fill="#2563EB" />
                  <Cell fill="#7B4CED" />
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {
    /* Download placeholder */
  }
      <div className="rounded-2xl border border-dashed border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
              <Download className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Download consolidated report</h3>
              <p className="text-sm text-muted-foreground">
                Export all sections above as a single PDF, Excel or CSV package for institutional records.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => download("PDF")}>
              <FileText className="mr-1.5 h-4 w-4" /> Export PDF
            </Button>
            <Button variant="outline" onClick={() => download("Excel")}>
              <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Export Excel
            </Button>
            <Button className="bg-[#2563EB] text-white hover:bg-[#1e4fd1]" onClick={() => download("All")}>
              <Download className="mr-1.5 h-4 w-4" /> Download All
            </Button>
          </div>
        </div>
      </div>
    </div>;
}
const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12
};
function KpiCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  tint,
  progress
}) {
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend === "up" ? "#22C55E" : "#EF4444";
  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <span
    className="grid h-10 w-10 place-items-center rounded-xl"
    style={{ backgroundColor: `${tint}1A`, color: tint }}
  >
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {typeof progress === "number" && <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: tint }} />
        </div>}
      <div className="mt-3 flex items-center gap-1 text-xs" style={{ color: trendColor }}>
        <TrendIcon className="h-3.5 w-3.5" />
        <span className="font-medium">{delta}</span>
      </div>
    </div>;
}
export {
  Route
};
