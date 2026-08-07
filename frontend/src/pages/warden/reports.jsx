import { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { BarChart3, Users, BedDouble, MessageSquareWarning, UserRoundCheck, Armchair, Download, FileText, FileSpreadsheet, FileType, Loader2 } from "lucide-react";
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
import { dashboardApi } from "@/services/api";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Route = createFileRoute("/warden/reports")({
  component: ReportsPage
});

const TINT = "#210963";

function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDownload = (reportName) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(reportName, 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    let columns = [];
    let rows = [];

    switch (reportName) {
      case "Occupancy Report":
        columns = ["Block Name", "Total Capacity", "Currently Occupied"];
        rows = data.charts.occupancyByBlock.map(b => [b.block, b.capacity, b.occupied]);
        break;
      case "Complaint Report":
        columns = ["Complaint Status", "Total Tickets"];
        rows = data.charts.complaintOverview.map(c => [c.name, c.value]);
        break;
      case "Leave Report":
        columns = ["Leave Status", "Total Requests"];
        rows = data.charts.leaveOverview.map(l => [l.name, l.value]);
        break;
      case "Visitor Report":
        columns = ["Day (Last 7 Days)", "Total Traffic", "Approved Entries"];
        rows = data.charts.visitorTrend.map(v => [v.day, v.total, v.approved]);
        break;
      case "Furniture Report":
        columns = ["Condition Status", "Total Units"];
        rows = data.charts.furnitureStatus.map(f => [f.name, f.value]);
        break;
      case "Student Report":
        columns = ["Metric", "Value"];
        rows = [
          ["Total Registered Students", data.stats.totalStudents],
          ["Total Occupied Rooms", data.stats.occupiedRooms],
          ["Available Rooms", data.stats.availableRooms]
        ];
        break;
      default:
        columns = ["Metric", "Value"];
        rows = [["Data", "Not Available"]];
    }

    autoTable(doc, {
      startY: 40,
      head: [columns],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [33, 9, 99] } // #210963 Theme color
    });

    doc.save(`${reportName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await dashboardApi.getHostelAdminStats();
        setData(res.data);
      } catch (error) {
        console.error("Failed to load reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }
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
        <StatCard label="Total Students" value={data.stats.totalStudents} delta="Active in hostel" trend="up" icon={Users} tint="#2563EB" />
        <StatCard label="Occupancy %" value={`${Math.round((data.stats.occupiedRooms / (data.stats.totalRooms || 1)) * 100)}%`} delta={`${data.stats.occupiedRooms} occupied`} trend="up" icon={BedDouble} tint="#7B4CED" />
        <StatCard label="Pending Complaints" value={data.stats.pendingComplaints} delta="Requires action" trend="up" icon={MessageSquareWarning} tint="#EF4444" />
        <StatCard label="Visitors (Today)" value={data.stats.visitorsToday} delta="Checked in today" trend="up" icon={UserRoundCheck} tint="#06B6D4" />
        <StatCard label="Furniture (Good)" value={data.charts.furnitureStatus?.find(f => f.name === "Good")?.value || 0} delta="Optimal state" trend="up" icon={Armchair} tint="#EAB308" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard className="lg:col-span-2" title="Occupancy Report" description="Occupied vs capacity per block">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.occupancyByBlock}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="block" fontSize={12} stroke="var(--muted-foreground)" />
                <YAxis fontSize={12} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="occupied" fill="#210963" radius={[6, 6, 0, 0]} />
                <Bar dataKey="capacity" fill="#E5E7EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Complaint Status" description="Live distribution">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.charts.complaintOverview} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}>
                  {data.charts.complaintOverview.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Visitor Report" description="Last 7 days">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.charts.visitorTrend}>
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

        <ChartCard title="Leave Report" description="Status distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.charts.leaveOverview} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {data.charts.leaveOverview.map((d) => <Cell key={d.name} fill={d.color} />)}
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
                <Pie data={data.charts.furnitureStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {data.charts.furnitureStatus.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><FileText className="h-4 w-4 text-muted-foreground" /> Available Reports</div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Student Report", "Occupancy Report", "Leave Report", "Complaint Report", "Visitor Report", "Furniture Report"].map((r) => (
            <button 
              key={r} 
              onClick={() => handleDownload(r)}
              className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left text-sm transition-colors hover:bg-muted/40 cursor-pointer"
            >
              <span className="font-medium text-foreground">{r}</span>
              <Download className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>;
}
export {
  Route
};
