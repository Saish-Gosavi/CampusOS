import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  UserCog,
  Building2,
  GraduationCap,
  BookOpen,
  Package,
  Download,
  AlertCircle,
  Filter,
  Check,
  X,
  Search,
  BarChart3
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
import { ChartCard } from "@/components/admin/ChartCard";
import { reportsApi } from "@/services/api";

const Route = createFileRoute("/super-admin/reports")({
  component: ReportsPage
});

const PIE_COLORS = ["#7B4CED", "#2563EB", "#EAB308", "#10B981", "#F59E0B"];

function ReportsPage() {
  const [stats, setStats] = useState(null);
  const [colleges, setColleges] = useState([]); // Master list of colleges
  const [selectedCollege, setSelectedCollege] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Table search & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [campusSearch, setCampusSearch] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await reportsApi.getSuperAdminStats();
        const data = res?.data || res;
        if (data) {
          setStats(data);
          setColleges(data.colleges || []);
        } else {
          setError(res?.message || "Failed to load reports");
        }
      } catch (err) {
        console.error("Error fetching reports", err);
        setError(err?.message || "Failed to load reports from server.");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const handleCollegeChange = async (e) => {
    const collegeId = e.target.value;
    setSelectedCollege(collegeId);
    setFilterLoading(true);
    try {
      const res = await reportsApi.getSuperAdminStats(collegeId);
      const data = res?.data || res;
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.error("Filter failed", err);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      setExporting(true);
      const blob = await reportsApi.downloadSuperAdminReport(selectedCollege);
      
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `campusos_system_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export report CSV.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-medium text-muted-foreground">Loading reports and analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg mt-16 rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center text-red-800 shadow-sm backdrop-blur-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 animate-pulse" />
        <h3 className="mt-4 text-lg font-bold tracking-tight text-foreground">Connection Failed</h3>
        <p className="mt-2 text-sm text-red-600">{error}</p>
      </div>
    );
  }

  // Bar chart data matching active colors
  const barChartData = [
    { name: "Total Admin", count: stats.admins, color: "#7B4CED" },
    { name: "Total Hostel", count: stats.hostels, color: "#2563EB" },
    { name: "Total Students", count: stats.students, color: "#EAB308" }
  ];

  const pieChartData = [
    { name: "Total Admin", value: stats.admins },
    { name: "Total Hostel", value: stats.hostels },
    { name: "Total Students", value: stats.students },
    { name: "Total Library", value: stats.library.books },
    { name: "Total Inventory", value: stats.inventory.items }
  ].filter(item => item.value > 0);

  // Filter colleges table based on search & status selection
  const filteredColleges = colleges.filter((college) => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || college.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter select dropdown list based on search input
  const filteredCampuses = colleges.filter((col) =>
    col.name.toLowerCase().includes(campusSearch.toLowerCase())
  );

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      
      {/* 1. Page Header (Matches Admin Management Style) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{ backgroundColor: "#3B82F61A", color: "#2563EB" }}
            >
              <BarChart3 className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Reports & Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Monitor cross-module statistics, platform usage, and download platform audit reports.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDownloadReport}
          disabled={exporting}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
        >
          {exporting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Export CSV Report
            </>
          )}
        </button>
      </div>

      {/* 2. Global Filter Row (Using design tokens for light/dark mode) */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Filter className="h-4 w-4 text-slate-400" />
            <span>Select Campus:</span>
          </div>

          {/* Search box to filter campus list */}
          <div className="relative w-full md:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={campusSearch}
              onChange={(e) => setCampusSearch(e.target.value)}
              placeholder="Search campuses..."
              className="w-full rounded-lg border border-border bg-muted py-1.5 pl-9 pr-3 text-sm outline-none text-foreground placeholder-slate-400 transition focus:border-primary focus:bg-card"
            />
          </div>

          <select
            value={selectedCollege}
            onChange={handleCollegeChange}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary min-w-[200px]"
          >
            <option value="">All Campuses ({colleges.length})</option>
            {filteredCampuses.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filterLoading ? (
        <div className="flex h-[250px] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <span className="text-sm text-muted-foreground font-medium">Aggregating database details...</span>
          </div>
        </div>
      ) : (
        <>
          {/* 3. KPI Cards Grid (Using gap-4 to match admins.jsx) */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard
              label="Total Admin"
              value={stats.admins}
              delta="Configured Staff"
              trend="up"
              icon={UserCog}
              tint="#7B4CED"
            />
            <StatCard
              label="Total Hostel"
              value={stats.hostels}
              delta="Active Hostels"
              trend="up"
              icon={Building2}
              tint="#2563EB"
            />
            <StatCard
              label="Total Students"
              value={stats.students}
              delta="Enrolled Residents"
              trend="up"
              icon={GraduationCap}
              tint="#EAB308"
            />
            <StatCard
              label="Total Library"
              value={stats.library.books}
              delta={`${stats.library.activeIssues} Active Issues`}
              trend="up"
              icon={BookOpen}
              tint="#10B981"
            />
            <StatCard
              label="Total Inventory"
              value={stats.inventory.items}
              delta={`${stats.inventory.pendingRequests} Requests`}
              trend="up"
              icon={Package}
              tint="#F59E0B"
            />
          </div>

          {/* 4. Interactive Visualizations */}
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard title="Core Resources (Users & Hostels)">
              <div className="h-[320px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                    <YAxis allowDecimals={false} stroke="#94A3B8" fontSize={12} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--foreground)" }} />
                    <Bar dataKey="count" name="Total" radius={[6, 6, 0, 0]}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Platform Asset Distribution">
              {pieChartData.length === 0 ? (
                <div className="flex h-[320px] items-center justify-center text-muted-foreground text-sm font-medium">
                  No records to display on asset distribution.
                </div>
              ) : (
                <div className="h-[320px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} count`, "Quantity"]} contentStyle={{ backgroundColor: "var(--card)", borderRadius: "8px", border: "1px solid var(--border)", color: "var(--foreground)" }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </ChartCard>
          </div>
        </>
      )}

      {/* 5. College Platform Table Filters (Matches Admin style) */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by college name..."
            className="w-full rounded-lg border border-border bg-muted py-2.5 pl-9 pr-3 text-sm outline-none text-foreground placeholder-slate-450 transition focus:border-primary focus:bg-card"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-muted p-1">
            {["All", "Active", "Pending", "Inactive"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${statusFilter === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. College Table (Matches Admin Table style) */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-muted-foreground">
            <thead className="bg-muted text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">College Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Status</th>
                <th scope="col" className="px-4 py-3 text-center font-medium">Hostel Management</th>
                <th scope="col" className="px-4 py-3 text-center font-medium">Library Management</th>
                <th scope="col" className="px-4 py-3 text-center font-medium">Inventory Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredColleges.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                    No matching colleges found. Try altering your filters.
                  </td>
                </tr>
              ) : (
                filteredColleges.map((college) => (
                  <tr key={college.id} className="hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-foreground">
                      {college.name}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
                        college.status === "Active"
                          ? "bg-green-500/10 text-green-600 dark:text-green-400 ring-green-600/10"
                          : college.status === "Pending"
                          ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-yellow-600/10"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 ring-red-600/10"
                      }`}>
                        {college.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        {college.hasHostel ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-green-500/10 text-green-600 ring-1 ring-green-600/10 dark:text-green-400">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/10 text-red-500 ring-1 ring-red-600/10 dark:text-red-400">
                            <X className="h-4 w-4 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        {college.hasLibrary ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-green-500/10 text-green-600 ring-1 ring-green-600/10 dark:text-green-400">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-50/10 text-red-500 ring-1 ring-red-600/10 dark:text-red-400">
                            <X className="h-4 w-4 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex justify-center">
                        {college.hasInventory ? (
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-green-500/10 text-green-600 ring-1 ring-green-600/10 dark:text-green-400">
                            <Check className="h-4 w-4 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/10 text-red-500 ring-1 ring-red-600/10 dark:text-red-400">
                            <X className="h-4 w-4 stroke-[3]" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export { Route };
