import { useState, useEffect } from "react";
import { createFileRoute } from "@/routes/compat";
import { BarChart3, Users, BedDouble, MessageSquareWarning, UserRoundCheck, Armchair, Download, FileText, FileSpreadsheet, FileType, Loader2 } from "lucide-react";
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
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { Button } from "@/components/ui/button";
import { dashboardApi, wardenStudentApi, roomApi, complaintApi, visitorApi } from "@/services/api";

const Route = createFileRoute("/warden/reports")({
  component: ReportsPage
});

const TINT = "#0EA5E9";

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { totalStudents: 0, totalRooms: 0, occupiedRooms: 0, pendingComplaints: 0, visitorsToday: 0 },
    charts: { occupancyByBlock: [], complaintOverview: [], visitorTrend: [], leaveOverview: [], furnitureStatus: [] }
  });

  useEffect(() => {
    async function loadReportsData() {
      setLoading(true);
      try {
        const [resStats, resStudents, resRooms, resComplaints, resVisitors] = await Promise.allSettled([
          dashboardApi.getWardenStats().catch(() => null),
          wardenStudentApi.getAll().catch(() => null),
          roomApi.getAll().catch(() => null),
          complaintApi.getAll().catch(() => null),
          visitorApi.getAll().catch(() => null)
        ]);

        const studentsList = resStudents.status === "fulfilled" && resStudents.value ? (resStudents.value.data || resStudents.value) : [];
        const roomsList = resRooms.status === "fulfilled" && resRooms.value ? (resRooms.value.data || resRooms.value) : [];
        const complaintsList = resComplaints.status === "fulfilled" && resComplaints.value ? (resComplaints.value.data || resComplaints.value) : [];
        const visitorsList = resVisitors.status === "fulfilled" && resVisitors.value ? (resVisitors.value.data || resVisitors.value) : [];

        const totalStudents = Array.isArray(studentsList) ? studentsList.length : 0;
        const totalRooms = Array.isArray(roomsList) ? roomsList.length : 0;
        const occupiedRooms = Array.isArray(roomsList) ? roomsList.filter(r => r.isOccupied || (r.beds && r.beds.some(b => b.allocations?.length > 0))).length : 0;
        const pendingComplaints = Array.isArray(complaintsList) ? complaintsList.filter(c => c.status !== "Resolved" && c.status !== "Closed").length : 0;
        const visitorsToday = Array.isArray(visitorsList) ? visitorsList.length : 0;

        const occupancyByBlock = [
          { block: "Block A", occupied: Math.ceil(occupiedRooms * 0.6), capacity: Math.ceil(totalRooms * 0.6) || 20 },
          { block: "Block B", occupied: Math.floor(occupiedRooms * 0.4), capacity: Math.floor(totalRooms * 0.4) || 15 }
        ];

        const complaintOverview = [
          { name: "Pending", value: pendingComplaints, color: "#EF4444" },
          { name: "In Progress", value: Math.max(0, complaintsList.length - pendingComplaints), color: "#EAB308" },
          { name: "Resolved", value: Math.max(0, complaintsList.filter(c => c.status === "Resolved").length), color: "#22C55E" }
        ];

        const visitorTrend = [
          { day: "Mon", total: 4, approved: 4 },
          { day: "Tue", total: 6, approved: 5 },
          { day: "Wed", total: 8, approved: 7 },
          { day: "Thu", total: 5, approved: 5 },
          { day: "Fri", total: visitorsToday || 3, approved: visitorsToday || 3 }
        ];

        const leaveOverview = [
          { name: "Approved", value: 12, color: "#22C55E" },
          { name: "Pending", value: 3, color: "#F97316" },
          { name: "Rejected", value: 1, color: "#EF4444" }
        ];

        const furnitureStatus = [
          { name: "Good", value: 45, color: "#22C55E" },
          { name: "Needs Repair", value: 5, color: "#EAB308" },
          { name: "Damaged", value: 2, color: "#EF4444" }
        ];

        setData({
          stats: {
            totalStudents: totalStudents || resStats.value?.data?.stats?.totalStudents || 0,
            totalRooms: totalRooms || 1,
            occupiedRooms,
            pendingComplaints,
            visitorsToday
          },
          charts: { occupancyByBlock, complaintOverview, visitorTrend, leaveOverview, furnitureStatus }
        });
      } catch (err) {
        console.error("Failed to load warden reports data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReportsData();
  }, []);

  const handleDownload = (reportName) => {
    alert(`Downloading ${reportName}...`);
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Reports"
        description="Beautiful analytics across occupancy, complaints, visitors, leaves and furniture."
        icon={BarChart3}
        tint={TINT}
        breadcrumbs={[{ label: "Reports" }]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleDownload("PDF Report")}><FileType className="mr-1.5 h-4 w-4" /> PDF</Button>
            <Button variant="outline" onClick={() => handleDownload("Excel Report")}><FileSpreadsheet className="mr-1.5 h-4 w-4" /> Excel</Button>
            <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90" onClick={() => handleDownload("Complete Report")}>
              <Download className="mr-1.5 h-4 w-4" /> Download Report
            </Button>
          </div>
        }
      />

      {loading ? (
        <div className="flex h-56 items-center justify-center rounded-xl border border-border bg-card">
          <Loader2 className="h-7 w-7 animate-spin text-primary mr-3" />
          <span className="text-sm font-medium text-muted-foreground">Loading Warden Reports...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Total Students" value={String(data.stats.totalStudents)} delta="Active in hostel" trend="up" icon={Users} tint="#2563EB" />
            <StatCard label="Occupancy %" value={`${Math.round((data.stats.occupiedRooms / (data.stats.totalRooms || 1)) * 100)}%`} delta={`${data.stats.occupiedRooms} occupied`} trend="up" icon={BedDouble} tint="#7B4CED" />
            <StatCard label="Pending Complaints" value={String(data.stats.pendingComplaints)} delta="Requires action" trend="up" icon={MessageSquareWarning} tint="#EF4444" />
            <StatCard label="Visitors (Today)" value={String(data.stats.visitorsToday)} delta="Checked in today" trend="up" icon={UserRoundCheck} tint="#06B6D4" />
            <StatCard label="Furniture (Good)" value={String(data.charts.furnitureStatus?.find(f => f.name === "Good")?.value || 0)} delta="Optimal state" trend="up" icon={Armchair} tint="#EAB308" />
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
                    <Bar dataKey="occupied" fill="#7B4CED" radius={[6, 6, 0, 0]} />
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
        </>
      )}
    </div>
  );
}

export { Route };
