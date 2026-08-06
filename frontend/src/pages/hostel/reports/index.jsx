import React, { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  BarChart3,
  Users,
  BedDouble,
  AlertTriangle,
  IndianRupee,
  UserCheck,
  CalendarClock,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Filter,
  TrendingUp,
  Search,
  Printer,
  ChevronLeft,
  ChevronRight,
  Building,
  UserPlus,
  FileBadge,
  ShieldAlert,
  DoorOpen,
  Bell,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiClient } from "@/services/api";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

const Route = createFileRoute("/hostel-admin/reports")({
  head: () => ({
    meta: [
      { title: "Central Reports & Analytics Hub — Hostel Admin · CampusOS" },
      {
        name: "description",
        content:
          "Complete operational reports and visual analytics for all 12 hostel modules.",
      },
    ],
  }),
  component: AdminReportsPage,
});

const MODULE_TABS = [
  { id: "Overview", label: "Dashboard", icon: BarChart3 },
  { id: "Hostel", label: "Hostel Setup", icon: Building },
  { id: "Admissions", label: "New Admissions", icon: UserPlus },
  { id: "AllocationLetters", label: "Allocation Letters", icon: FileBadge },
  { id: "Students", label: "Students", icon: Users },
  { id: "Staff", label: "Staff", icon: ShieldAlert },
  { id: "Fees", label: "Fees", icon: IndianRupee },
  { id: "Leaves", label: "Leaves", icon: CalendarClock },
  { id: "Visitors", label: "Visitors", icon: UserCheck },
  { id: "InOutRegister", label: "In-Out Register", icon: DoorOpen },
  { id: "Complaints", label: "Complaints", icon: AlertTriangle },
  { id: "NoticeBoard", label: "Notice Board", icon: Bell },
];

const COLORS = {
  purple: "#7B4CED",
  blue: "#0EA5E9",
  emerald: "#10B981",
  amber: "#F59E0B",
  red: "#EF4444",
  indigo: "#6366F1",
  slate: "#94A3B8",
  violet: "#8B5CF6",
};

// Custom Chart Tooltip
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg  ">
      {label && <p className="mb-1 font-bold text-slate-700 ">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}:{" "}
          {typeof p.value === "number" && p.name?.toLowerCase().includes("fee")
            ? `₹${p.value.toLocaleString("en-IN")}`
            : p.value}
        </p>
      ))}
    </div>
  );
}

const renderPieLabel = ({ name, percent }) =>
  percent > 0.04 ? `${name} (${(percent * 100).toFixed(0)}%)` : null;

function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filters & Search
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Load Data from GET /api/admin/reports
  const loadReportsData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        module: activeTab,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: search || undefined,
        page,
        limit: 15,
      };
      const res = await apiClient.get("/admin/reports", { params });
      if (res?.data) {
        setReportData(res.data);
        setLastUpdated(new Date());
      }
    } catch {
      toast.error(`Failed to load ${activeTab} report data`);
    } finally {
      setLoading(false);
    }
  }, [activeTab, startDate, endDate, search, page]);

  useEffect(() => {
    loadReportsData();
  }, [loadReportsData]);

  // Tab Switch handler reset page
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setPage(1);
    setSearch("");
  };

  // Export CSV/Excel handler
  const handleExportCsv = async () => {
    setGenerating(true);
    try {
      const res = await apiClient.post(
        "/admin/reports",
        {
          reportType: activeTab,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          format: "csv",
        },
        { responseType: "blob" },
      );
      const blob = new Blob([res], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CampusOS_${activeTab}_Report_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`${activeTab} Excel/CSV report downloaded.`);
    } catch {
      toast.error("Failed to generate CSV export.");
    } finally {
      setGenerating(false);
    }
  };

  // Export PDF handler
  const handleExportPdf = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      let currentY = margin;

      // 1. Draw Professional Header Banner
      const drawHeader = (docObj, pageNumber) => {
        docObj.setFillColor(123, 76, 237); // CampusOS Purple
        docObj.rect(0, 0, pageWidth, 60, "F");

        docObj.setFont("helvetica", "bold");
        docObj.setFontSize(22);
        docObj.setTextColor(255, 255, 255);
        docObj.text(`CampusOS`, margin, 38);

        docObj.setFont("helvetica", "normal");
        docObj.setFontSize(16);
        docObj.text(`| ${activeTab} Analytics Report`, margin + 115, 38);

        // Date & Domain
        docObj.setFontSize(9);
        docObj.setTextColor(230, 230, 250);
        docObj.text(
          `Generated: ${new Date().toLocaleString()} | Central Hostel Domain`,
          pageWidth - margin,
          38,
          { align: "right" }
        );
      };

      drawHeader(doc, 1);
      currentY = 85;

      // Filter Text
      if (startDate || endDate || search) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(
          `Filters Applied: ${startDate || "Any"} to ${endDate || "Any"} | Search: "${search || "None"}"`,
          margin,
          currentY
        );
        currentY += 20;
      }

      // 2. Draw Vector KPI Cards (Vector Crisp & Crash-Proof)
      const kpiItems = getKpisForTab(activeTab, summary, extra);
      if (kpiItems.length > 0) {
        const cardsPerRow = Math.min(kpiItems.length, 6);
        const gap = 10;
        const cardWidth =
          (pageWidth - margin * 2 - (cardsPerRow - 1) * gap) / cardsPerRow;
        const cardHeight = 52;

        let startX = margin;
        let cardY = currentY;

        kpiItems.forEach((kpi, idx) => {
          if (idx > 0 && idx % cardsPerRow === 0) {
            startX = margin;
            cardY += cardHeight + gap;
          }

          const curX = startX + (idx % cardsPerRow) * (cardWidth + gap);

          // Card Background
          doc.setFillColor(248, 250, 252);
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(1);
          doc.roundedRect(curX, cardY, cardWidth, cardHeight, 6, 6, "FD");

          // KPI Label
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          doc.text(kpi.label.toUpperCase(), curX + 10, cardY + 16);

          // KPI Value
          doc.setFont("helvetica", "bold");
          doc.setFontSize(13);
          doc.setTextColor(123, 76, 237);
          doc.text(String(kpi.value), curX + 10, cardY + 36);

          // KPI Subtitle if present
          if (kpi.sub) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.text(String(kpi.sub), curX + cardWidth - 10, cardY + 36, {
              align: "right",
            });
          }
        });

        currentY = cardY + cardHeight + 25;
      }

      // 3. Optionally Capture Charts screenshot (safely wrapped)
      const chartsElem = document.getElementById("pdf-charts-container");
      if (chartsElem && currentY < pageHeight - 160) {
        try {
          const canvas = await html2canvas(chartsElem, {
            scale: 1.5,
            useCORS: true,
            backgroundColor: "#F9FAFB",
            logging: false,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgProps = doc.getImageProperties(imgData);
          const pdfWidth = pageWidth - margin * 2;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          if (currentY + pdfHeight > pageHeight - 60) {
            doc.addPage();
            drawHeader(doc, doc.internal.getNumberOfPages());
            currentY = 85;
          }

          doc.addImage(imgData, "PNG", margin, currentY, pdfWidth, pdfHeight);
          currentY += pdfHeight + 25;
        } catch (canvasErr) {
          console.warn("Chart screenshot skipped for PDF generation:", canvasErr);
        }
      }

      // 4. Draw Data Table using autoTable safely
      const tableData = getTableColumnsAndRows(activeTab, records);
      const runAutoTable = (docObj, options) => {
        if (typeof autoTable === "function") {
          autoTable(docObj, options);
        } else if (typeof docObj.autoTable === "function") {
          docObj.autoTable(options);
        }
      };

      if (tableData.body.length > 0) {
        runAutoTable(doc, {
          startY: currentY,
          head: tableData.head,
          body: tableData.body,
          theme: "striped",
          headStyles: {
            fillColor: [123, 76, 237],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
          styles: { fontSize: 8.5, cellPadding: 6 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { top: 75, left: margin, right: margin, bottom: 45 },
          didDrawPage: function (data) {
            if (data.pageNumber > 1) {
              drawHeader(doc, data.pageNumber);
            }
          },
        });
      } else {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(
          "No records found for current filter criteria.",
          margin,
          currentY
        );
      }

      // Add footer for all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const str = `CampusOS © ${new Date().getFullYear()} | Professional Analytics Report | Page ${i} of ${pageCount}`;
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(str, pageWidth / 2, pageHeight - 20, { align: "center" });
      }

      doc.save(`CampusOS_${activeTab}_Report_${Date.now()}.pdf`);
      toast.success(`${activeTab} Professional PDF downloaded.`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF document.");
    } finally {
      setGenerating(false);
    }
  };

  // Print handler
  const handlePrint = () => {
    window.print();
  };

  const summary = reportData?.summary || {};
  const extra = reportData?.moduleExtraStats || {};
  const records = reportData?.records || [];
  const pagination = reportData?.pagination || {};
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 w-full min-h-full">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7B4CED]/10 text-[#7B4CED]">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 ">
              Central Reports & Analytics Hub
            </h1>
            <p className="text-xs font-medium text-slate-500 ">
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()} · Live Database Analytics`
                : "Loading..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReportsData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin text-[#7B4CED]" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handleExportCsv}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel (.csv)
          </button>
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 rounded-xl bg-[#7B4CED] px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#6a3fd1]"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* ── 12 Module Selector Scrollable Navigation Bar ── */}
      <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm min-h-[68px]">
        {MODULE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
                isActive
                  ? "bg-[#7B4CED] text-white shadow-md shadow-[#7B4CED]/25"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#7B4CED]" />
        </div>
      ) : (
        <>
          {/* ── Dynamic Module KPI Cards ── */}
          <div id="pdf-kpi-container" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 bg-[#F9FAFB] p-3 -m-3 rounded-xl">
            {renderModuleKpis(activeTab, summary, extra)}
          </div>

          {/* ── Dynamic Recharts Visual Analytics Section ── */}
          <div id="pdf-charts-container" className="space-y-4 bg-[#F9FAFB] p-3 -m-3 rounded-xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#7B4CED]" />
              <h2 className="text-base font-bold text-slate-800 ">
                {MODULE_TABS.find((t) => t.id === activeTab)?.label} Graphical
                Analytics
              </h2>
              <span className="rounded-full bg-[#7B4CED]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#7B4CED]">
                Live Analytics
              </span>
            </div>

            {renderModuleCharts(activeTab, summary, extra)}
          </div>

          {/* ── Filter Toolbar & Search Bar ── */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm  ">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab} records...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-800 focus:bg-white focus:outline-none   "
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Filter className="h-3.5 w-3.5 text-[#7B4CED]" />
                  <span>Start:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs   "
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span>End:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-2 text-xs   "
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Paginated Live Data Table ── */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4  ">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 ">
              <h3 className="text-sm font-bold text-slate-800 ">
                {MODULE_TABS.find((t) => t.id === activeTab)?.label} Data
                Records ({pagination.totalRecords || 0})
              </h3>
              <p className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {renderTableHeader(activeTab)}
                <tbody className="divide-y divide-slate-100 text-slate-700  ">
                  {records.length > 0 ? (
                    records.map((rec, idx) =>
                      renderTableRow(activeTab, rec, idx),
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-slate-400"
                      >
                        No records match the current filters or query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 ">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40  "
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>

              <span className="text-xs text-slate-500">
                Showing {records.length} records of{" "}
                {pagination.totalRecords || 0}
              </span>

              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-40  "
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Metric Card Subcomponent ──
function KpiMetricCard({ label, value, icon: Icon, color, sub }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col min-h-[140px] h-full">
      <div className="flex items-start justify-between mb-3 gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
          {label}
        </span>
        <span
          className="p-2.5 rounded-xl shadow-sm shrink-0"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-auto">
        <p className="text-[28px] font-black tracking-tight text-slate-900 leading-none">
          {value}
        </p>
        <div className="min-h-[32px] mt-2 flex items-start">
          <p className={`text-xs font-semibold text-slate-500 ${!sub ? 'hidden' : ''} line-clamp-2`}>
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Render KPI Cards based on Active Tab ──
function renderModuleKpis(tab, s, ex) {
  switch (tab) {
    case "Hostel":
      return (
        <>
          <KpiMetricCard
            label="Total Blocks"
            value={ex.totalBlocks ?? 0}
            icon={Building}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Total Rooms"
            value={ex.totalRooms ?? 0}
            icon={DoorOpen}
            color={COLORS.blue}
          />
          <KpiMetricCard
            label="Total Beds"
            value={ex.totalBeds ?? 0}
            icon={BedDouble}
            color={COLORS.indigo}
          />
          <KpiMetricCard
            label="Occupied Beds"
            value={ex.occupiedBeds ?? 0}
            icon={Users}
            color={COLORS.emerald}
          />
          <KpiMetricCard
            label="Vacant Beds"
            value={ex.vacantBeds ?? 0}
            icon={BedDouble}
            color={COLORS.amber}
          />
          <KpiMetricCard
            label="Furniture Good"
            value={ex.furnitureGood ?? 0}
            icon={ShieldAlert}
            color={COLORS.violet}
            sub={`${ex.furnitureDamaged ?? 0} damaged`}
          />
        </>
      );
    case "Admissions":
      return (
        <>
          <KpiMetricCard
            label="Total Applicants"
            value={ex.totalAdmissions ?? 0}
            icon={UserPlus}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Approved Students"
            value={ex.activeCount ?? 0}
            icon={UserCheck}
            color={COLORS.emerald}
          />
          <KpiMetricCard
            label="Pending Approvals"
            value={ex.pendingCount ?? 0}
            icon={CalendarClock}
            color={COLORS.amber}
            sub="Requires warden review"
          />
        </>
      );
    case "AllocationLetters":
      return (
        <>
          <KpiMetricCard
            label="Letters Issued"
            value={ex.totalLetters ?? 0}
            icon={FileBadge}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Active Allocations"
            value={s.occupiedBeds ?? 0}
            icon={BedDouble}
            color={COLORS.emerald}
          />
        </>
      );
    case "Students":
      return (
        <>
          <KpiMetricCard
            label="Total Students"
            value={ex.totalStudents ?? 0}
            icon={Users}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Allocated Room"
            value={ex.allocatedCount ?? 0}
            icon={BedDouble}
            color={COLORS.emerald}
          />
          <KpiMetricCard
            label="Unallocated"
            value={ex.unallocatedCount ?? 0}
            icon={UserPlus}
            color={COLORS.amber}
          />
        </>
      );
    case "Staff":
      return (
        <>
          <KpiMetricCard
            label="Total Staff"
            value={ex.totalStaff ?? 0}
            icon={ShieldAlert}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Wardens"
            value={ex.wardenCount ?? 0}
            icon={Users}
            color={COLORS.blue}
          />
          <KpiMetricCard
            label="Security Guards"
            value={ex.securityCount ?? 0}
            icon={ShieldAlert}
            color={COLORS.emerald}
          />
        </>
      );
    case "Fees":
      return (
        <>
          <KpiMetricCard
            label="Total Fees Records"
            value={ex.totalFees ?? 0}
            icon={IndianRupee}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Fees Collected"
            value={`₹${(ex.paidAmount ?? 0).toLocaleString("en-IN")}`}
            icon={IndianRupee}
            color={COLORS.emerald}
            sub={`${ex.paidCount ?? 0} paid`}
          />
          <KpiMetricCard
            label="Pending Amount"
            value={`₹${(ex.unpaidAmount ?? 0).toLocaleString("en-IN")}`}
            icon={IndianRupee}
            color={COLORS.red}
            sub={`${ex.unpaidCount ?? 0} unpaid`}
          />
        </>
      );
    case "Leaves":
      return (
        <>
          <KpiMetricCard
            label="Total Leaves"
            value={ex.totalLeaves ?? 0}
            icon={CalendarClock}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Pending Review"
            value={ex.pending ?? 0}
            icon={CalendarClock}
            color={COLORS.amber}
          />
          <KpiMetricCard
            label="Approved"
            value={ex.approved ?? 0}
            icon={UserCheck}
            color={COLORS.emerald}
          />
          <KpiMetricCard
            label="Rejected"
            value={ex.rejected ?? 0}
            icon={AlertTriangle}
            color={COLORS.red}
          />
        </>
      );
    case "Visitors":
      return (
        <>
          <KpiMetricCard
            label="Total Visitors"
            value={ex.totalVisitors ?? 0}
            icon={UserCheck}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Approved"
            value={ex.approved ?? 0}
            icon={UserCheck}
            color={COLORS.emerald}
          />
          <KpiMetricCard
            label="Checked-In"
            value={ex.checkedIn ?? 0}
            icon={DoorOpen}
            color={COLORS.blue}
          />
          <KpiMetricCard
            label="Checked-Out"
            value={ex.checkedOut ?? 0}
            icon={DoorOpen}
            color={COLORS.slate}
          />
        </>
      );
    case "InOutRegister":
      return (
        <>
          <KpiMetricCard
            label="Total Logs"
            value={ex.totalLogs ?? 0}
            icon={DoorOpen}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Present (In)"
            value={ex.presentCount ?? 0}
            icon={UserCheck}
            color={COLORS.emerald}
          />
          <KpiMetricCard
            label="Absent (Out)"
            value={ex.absentCount ?? 0}
            icon={AlertTriangle}
            color={COLORS.amber}
          />
        </>
      );
    case "Complaints":
      return (
        <>
          <KpiMetricCard
            label="Total Complaints"
            value={ex.totalComplaints ?? 0}
            icon={AlertTriangle}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Open"
            value={ex.open ?? 0}
            icon={AlertTriangle}
            color={COLORS.red}
          />
          <KpiMetricCard
            label="Assigned"
            value={ex.assigned ?? 0}
            icon={Users}
            color={COLORS.amber}
          />
          <KpiMetricCard
            label="Resolved"
            value={ex.resolved ?? 0}
            icon={UserCheck}
            color={COLORS.emerald}
          />
        </>
      );
    case "NoticeBoard":
      return (
        <>
          <KpiMetricCard
            label="Total Notices"
            value={ex.totalNotices ?? 0}
            icon={Bell}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Active Notices"
            value={ex.active ?? 0}
            icon={Bell}
            color={COLORS.emerald}
          />
          <KpiMetricCard
            label="Expired / Inactive"
            value={ex.inactive ?? 0}
            icon={Bell}
            color={COLORS.slate}
          />
        </>
      );
    default:
      // Overview
      return (
        <>
          <KpiMetricCard
            label="Students"
            value={s.totalStudents ?? 0}
            icon={Users}
            color={COLORS.purple}
          />
          <KpiMetricCard
            label="Beds Capacity"
            value={s.totalBeds ?? 0}
            icon={BedDouble}
            color={COLORS.blue}
            sub={`${s.occupiedBeds ?? 0} occupied`}
          />
          <KpiMetricCard
            label="Fees Collected"
            value={`₹${(s.totalFeesCollected ?? 0).toLocaleString("en-IN")}`}
            icon={IndianRupee}
            color={COLORS.emerald}
            sub={`${s.pendingFeesCount ?? 0} pending`}
          />
          <KpiMetricCard
            label="Visitor Logs"
            value={s.totalVisitors ?? 0}
            icon={UserCheck}
            color={COLORS.amber}
          />
          <KpiMetricCard
            label="Complaints"
            value={s.totalComplaints ?? 0}
            icon={AlertTriangle}
            color={COLORS.red}
            sub={`${s.openComplaintsCount ?? 0} open`}
          />
          <KpiMetricCard
            label="Active Notices"
            value={s.activeNoticesCount ?? 0}
            icon={Bell}
            color={COLORS.indigo}
          />
        </>
      );
  }
}

// ── Render Charts per Module ──
function renderModuleCharts(tab, s, _ex) {
  const chartOverviewData = [
    { name: "Students", value: s.totalStudents ?? 0 },
    { name: "Beds", value: s.totalBeds ?? 0 },
    { name: "Occupied", value: s.occupiedBeds ?? 0 },
    { name: "Complaints", value: s.totalComplaints ?? 0 },
    { name: "Visitors", value: s.totalVisitors ?? 0 },
    { name: "Leaves", value: s.totalLeaves ?? 0 },
    { name: "Notices", value: s.totalNotices ?? 0 },
  ];

  const pieBedData = [
    { name: "Occupied", value: s.occupiedBeds ?? 0, color: COLORS.purple },
    {
      name: "Vacant",
      value: Math.max(0, (s.totalBeds ?? 0) - (s.occupiedBeds ?? 0)),
      color: COLORS.blue,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="mb-6 text-sm font-extrabold text-slate-800 tracking-tight">
          {tab} Operational Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartOverviewData} barSize={36}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
              {chartOverviewData.map((_, i) => (
                <Cell
                  key={i}
                  fill={Object.values(COLORS)[i % Object.values(COLORS).length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
        <h3 className="mb-6 text-sm font-extrabold text-slate-800 tracking-tight">
          Capacity & Allocation Ratio
        </h3>
        <ResponsiveContainer width="100%" height={300} className="flex-1">
          <PieChart>
            <Pie
              data={pieBedData.filter((d) => d.value > 0)}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              dataKey="value"
              label={renderPieLabel}
              labelLine={false}
            >
              {pieBedData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Render Table Header per Module ──
function renderTableHeader(tab) {
  return (
    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100   ">
      <tr>
        {tab === "Hostel" && (
          <>
            <th className="px-4 py-3">Room No</th>
            <th className="px-4 py-3">Floor</th>
            <th className="px-4 py-3">Block</th>
            <th className="px-4 py-3">Capacity</th>
            <th className="px-4 py-3">Rent (₹)</th>
            <th className="px-4 py-3">Occupied Beds</th>
          </>
        )}
        {tab === "Admissions" && (
          <>
            <th className="px-4 py-3">User ID</th>
            <th className="px-4 py-3">Applicant Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applied Date</th>
          </>
        )}
        {tab === "AllocationLetters" && (
          <>
            <th className="px-4 py-3">Ref No</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">College ID</th>
            <th className="px-4 py-3">Room / Block</th>
            <th className="px-4 py-3">Issued Date</th>
            <th className="px-4 py-3">Signed By</th>
          </>
        )}
        {tab === "Students" && (
          <>
            <th className="px-4 py-3">Student Name</th>
            <th className="px-4 py-3">College ID</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Block / Room</th>
            <th className="px-4 py-3">Status</th>
          </>
        )}
        {tab === "Staff" && (
          <>
            <th className="px-4 py-3">Staff Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Joined Date</th>
          </>
        )}
        {tab === "Fees" && (
          <>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">College ID</th>
            <th className="px-4 py-3">Amount (₹)</th>
            <th className="px-4 py-3">Due Date</th>
            <th className="px-4 py-3">Status</th>
          </>
        )}
        {tab === "Leaves" && (
          <>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Reason</th>
            <th className="px-4 py-3">Start Date</th>
            <th className="px-4 py-3">End Date</th>
            <th className="px-4 py-3">Status</th>
          </>
        )}
        {tab === "Visitors" && (
          <>
            <th className="px-4 py-3">Visitor Name</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Relationship</th>
            <th className="px-4 py-3">Student Visited</th>
            <th className="px-4 py-3">Check-In</th>
            <th className="px-4 py-3">Status</th>
          </>
        )}
        {tab === "InOutRegister" && (
          <>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">College ID</th>
            <th className="px-4 py-3">Log Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Remarks</th>
          </>
        )}
        {tab === "Complaints" && (
          <>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Status</th>
          </>
        )}
        {tab === "NoticeBoard" && (
          <>
            <th className="px-4 py-3">Notice Title</th>
            <th className="px-4 py-3">Content Preview</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Posted By</th>
            <th className="px-4 py-3">Date</th>
          </>
        )}
        {tab === "Overview" && (
          <>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Metric Name</th>
            <th className="px-4 py-3">Current Status / Count</th>
          </>
        )}
      </tr>
    </thead>
  );
}

// ── Render Table Row per Module ──
function renderTableRow(tab, rec, idx) {
  return (
    <tr key={rec.id || idx} className="hover:bg-slate-50/60 transition">
      {tab === "Hostel" && (
        <>
          <td className="px-4 py-3 font-semibold text-slate-900 ">
            {rec.number}
          </td>
          <td className="px-4 py-3">{rec.floor?.number ?? "N/A"}</td>
          <td className="px-4 py-3">{rec.floor?.block?.name ?? "N/A"}</td>
          <td className="px-4 py-3">{rec.capacity}</td>
          <td className="px-4 py-3">
            ₹{Number(rec.rent || 0).toLocaleString("en-IN")}
          </td>
          <td className="px-4 py-3">
            {rec.beds?.filter((b) => b.allocations?.length > 0).length || 0} /{" "}
            {rec.capacity}
          </td>
        </>
      )}
      {tab === "Admissions" && (
        <>
          <td className="px-4 py-3 font-semibold">#{rec.id}</td>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            {rec.name || rec.studentProfile?.fullName || "Applicant"}
          </td>
          <td className="px-4 py-3">{rec.email}</td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
            >
              {rec.status}
            </span>
          </td>
          <td className="px-4 py-3">
            {new Date(rec.createdAt).toLocaleDateString()}
          </td>
        </>
      )}
      {tab === "AllocationLetters" && (
        <>
          <td className="px-4 py-3 font-semibold text-[#7B4CED]">
            {rec.referenceNo}
          </td>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            {rec.allocation?.student?.fullName || "Student"}
          </td>
          <td className="px-4 py-3">
            {rec.allocation?.student?.collegeId || "N/A"}
          </td>
          <td className="px-4 py-3">
            Room {rec.allocation?.bed?.room?.number || "N/A"} (
            {rec.allocation?.bed?.room?.floor?.block?.name || "N/A"})
          </td>
          <td className="px-4 py-3">
            {new Date(rec.issuedDate).toLocaleDateString()}
          </td>
          <td className="px-4 py-3">{rec.signedBy || "Warden Office"}</td>
        </>
      )}
      {tab === "Students" && (
        <>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            {rec.fullName}
          </td>
          <td className="px-4 py-3 font-semibold">{rec.collegeId}</td>
          <td className="px-4 py-3">{rec.phone}</td>
          <td className="px-4 py-3">{rec.user?.email || "N/A"}</td>
          <td className="px-4 py-3">
            {rec.allocations?.[0]
              ? `${rec.allocations[0].bed?.room?.floor?.block?.name || ""} - Room ${rec.allocations[0].bed?.room?.number || ""}`
              : "Unallocated"}
          </td>
          <td className="px-4 py-3">
            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              {rec.user?.status || "active"}
            </span>
          </td>
        </>
      )}
      {tab === "Staff" && (
        <>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            {rec.name || "Staff Member"}
          </td>
          <td className="px-4 py-3">{rec.email}</td>
          <td className="px-4 py-3 font-semibold text-[#7B4CED]">
            {rec.role?.name || "STAFF"}
          </td>
          <td className="px-4 py-3">
            {new Date(rec.createdAt).toLocaleDateString()}
          </td>
        </>
      )}
      {tab === "Fees" && (
        <>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            {rec.student?.fullName || "Student"}
          </td>
          <td className="px-4 py-3">{rec.student?.collegeId || "N/A"}</td>
          <td className="px-4 py-3 font-bold">
            ₹{Number(rec.amount).toLocaleString("en-IN")}
          </td>
          <td className="px-4 py-3">
            {new Date(rec.dueDate).toLocaleDateString()}
          </td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.status === "paid" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
            >
              {rec.status}
            </span>
          </td>
        </>
      )}
      {tab === "Leaves" && (
        <>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            {rec.student?.fullName || "Student"}
          </td>
          <td className="px-4 py-3">{rec.reason}</td>
          <td className="px-4 py-3">
            {new Date(rec.startDate).toLocaleDateString()}
          </td>
          <td className="px-4 py-3">
            {new Date(rec.endDate).toLocaleDateString()}
          </td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.status === "approved" ? "bg-emerald-50 text-emerald-600" : rec.status === "rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}
            >
              {rec.status}
            </span>
          </td>
        </>
      )}
      {tab === "Visitors" && (
        <>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            {rec.fullName}
          </td>
          <td className="px-4 py-3">{rec.visitorPhone || "N/A"}</td>
          <td className="px-4 py-3">{rec.relationship}</td>
          <td className="px-4 py-3">{rec.studentName}</td>
          <td className="px-4 py-3">
            {rec.checkIn
              ? new Date(rec.checkIn).toLocaleString()
              : new Date(rec.createdAt).toLocaleDateString()}
          </td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.status === "Approved" || rec.status === "Checked-In" ? "bg-emerald-50 text-emerald-600" : rec.status === "Rejected" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}
            >
              {rec.status}
            </span>
          </td>
        </>
      )}
      {tab === "InOutRegister" && (
        <>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            {rec.student?.fullName || "Student"}
          </td>
          <td className="px-4 py-3">{rec.student?.collegeId || "N/A"}</td>
          <td className="px-4 py-3">
            {new Date(rec.date).toLocaleDateString()}
          </td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.present ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
            >
              {rec.present ? "Present (In-Campus)" : "Absent (Out)"}
            </span>
          </td>
          <td className="px-4 py-3">{rec.remarks || "N/A"}</td>
        </>
      )}
      {tab === "Complaints" && (
        <>
          <td className="px-4 py-3 font-bold text-slate-900 ">{rec.title}</td>
          <td className="px-4 py-3">{rec.category}</td>
          <td className="px-4 py-3 font-semibold uppercase text-[10px]">
            {rec.priority}
          </td>
          <td className="px-4 py-3">{rec.student?.fullName || "Student"}</td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.status === "resolved" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
            >
              {rec.status}
            </span>
          </td>
        </>
      )}
      {tab === "NoticeBoard" && (
        <>
          <td className="px-4 py-3 font-bold text-slate-900 ">{rec.title}</td>
          <td className="px-4 py-3">
            {rec.content ? rec.content.substring(0, 45) + "..." : "N/A"}
          </td>
          <td className="px-4 py-3">
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${rec.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
            >
              {rec.isActive ? "Active" : "Inactive"}
            </span>
          </td>
          <td className="px-4 py-3">
            {rec.createdBy?.name || rec.createdBy?.email || "Admin"}
          </td>
          <td className="px-4 py-3">
            {new Date(rec.createdAt).toLocaleDateString()}
          </td>
        </>
      )}
      {tab === "Overview" && (
        <>
          <td className="px-4 py-3 font-semibold text-[#7B4CED]">
            Operational Core
          </td>
          <td className="px-4 py-3 font-bold text-slate-900 ">
            Live Database Overview
          </td>
          <td className="px-4 py-3 text-slate-600 ">
            All 12 Modules Connected
          </td>
        </>
      )}
    </tr>
  );
}

// ── Text helper for PDF export ──
function getRowSummaryText(tab, rec) {
  if (tab === "Hostel")
    return `Room ${rec.number} (${rec.floor?.block?.name || "N/A"}) - Rent: Rs. ${rec.rent}`;
  if (tab === "Admissions") return `${rec.name || rec.email} [${rec.status}]`;
  if (tab === "AllocationLetters")
    return `Ref: ${rec.referenceNo} - ${rec.allocation?.student?.fullName || "Student"}`;
  if (tab === "Students")
    return `${rec.fullName} (${rec.collegeId}) - Phone: ${rec.phone}`;
  if (tab === "Staff")
    return `${rec.name || rec.email} [${rec.role?.name || "Staff"}]`;
  if (tab === "Fees")
    return `${rec.student?.fullName || "Student"} - Rs. ${rec.amount} [${rec.status}]`;
  if (tab === "Leaves")
    return `${rec.student?.fullName || "Student"} - ${rec.reason} [${rec.status}]`;
  if (tab === "Visitors")
    return `${rec.fullName} visiting ${rec.studentName} [${rec.status}]`;
  if (tab === "InOutRegister")
    return `${rec.student?.fullName || "Student"} [${rec.present ? "In" : "Out"}]`;
  if (tab === "Complaints")
    return `${rec.title} (${rec.category}) [${rec.status}]`;
  if (tab === "NoticeBoard")
    return `${rec.title} [${rec.isActive ? "Active" : "Inactive"}]`;
  return JSON.stringify(rec);
}

// ── KPI helper for PDF export ──
function getKpisForTab(tab, summary, extra) {
  const s = summary || {};
  const ex = extra || {};
  switch (tab) {
    case "Hostel":
      return [
        { label: "Total Blocks", value: String(ex.totalBlocks ?? 0) },
        { label: "Total Rooms", value: String(ex.totalRooms ?? 0) },
        { label: "Total Beds", value: String(ex.totalBeds ?? 0) },
        { label: "Occupied Beds", value: String(ex.occupiedBeds ?? 0) },
        { label: "Vacant Beds", value: String(ex.vacantBeds ?? 0) },
        { label: "Furniture Good", value: String(ex.furnitureGood ?? 0), sub: `${ex.furnitureDamaged ?? 0} damaged` },
      ];
    case "Admissions":
      return [
        { label: "Total Applicants", value: String(ex.totalAdmissions ?? 0) },
        { label: "Approved Students", value: String(ex.activeCount ?? 0) },
        { label: "Pending Approvals", value: String(ex.pendingCount ?? 0), sub: "Requires warden review" },
      ];
    case "AllocationLetters":
      return [
        { label: "Letters Issued", value: String(ex.totalLetters ?? 0) },
        { label: "Active Allocations", value: String(s.occupiedBeds ?? 0) },
      ];
    case "Students":
      return [
        { label: "Total Students", value: String(ex.totalStudents ?? 0) },
        { label: "Allocated Room", value: String(ex.allocatedCount ?? 0) },
        { label: "Unallocated", value: String(ex.unallocatedCount ?? 0) },
      ];
    case "Staff":
      return [
        { label: "Total Staff", value: String(ex.totalStaff ?? 0) },
        { label: "Wardens", value: String(ex.wardenCount ?? 0) },
        { label: "Security Guards", value: String(ex.securityCount ?? 0) },
      ];
    case "Fees":
      return [
        { label: "Total Fees Records", value: String(ex.totalFees ?? 0) },
        { label: "Fees Collected", value: `Rs. ${(ex.paidAmount ?? 0).toLocaleString("en-IN")}`, sub: `${ex.paidCount ?? 0} paid` },
        { label: "Pending Amount", value: `Rs. ${(ex.unpaidAmount ?? 0).toLocaleString("en-IN")}`, sub: `${ex.unpaidCount ?? 0} unpaid` },
      ];
    case "Leaves":
      return [
        { label: "Total Leaves", value: String(ex.totalLeaves ?? 0) },
        { label: "Pending Review", value: String(ex.pending ?? 0) },
        { label: "Approved", value: String(ex.approved ?? 0) },
        { label: "Rejected", value: String(ex.rejected ?? 0) },
      ];
    case "Visitors":
      return [
        { label: "Total Visitors", value: String(ex.totalVisitors ?? 0) },
        { label: "Approved", value: String(ex.approved ?? 0) },
        { label: "Checked-In", value: String(ex.checkedIn ?? 0) },
        { label: "Checked-Out", value: String(ex.checkedOut ?? 0) },
      ];
    case "InOutRegister":
      return [
        { label: "Total Logs", value: String(ex.totalLogs ?? 0) },
        { label: "Present (In)", value: String(ex.presentCount ?? 0) },
        { label: "Absent (Out)", value: String(ex.absentCount ?? 0) },
      ];
    case "Complaints":
      return [
        { label: "Total Complaints", value: String(ex.totalComplaints ?? 0) },
        { label: "Open", value: String(ex.open ?? 0) },
        { label: "Assigned", value: String(ex.assigned ?? 0) },
        { label: "Resolved", value: String(ex.resolved ?? 0) },
      ];
    case "NoticeBoard":
      return [
        { label: "Total Notices", value: String(ex.totalNotices ?? 0) },
        { label: "Active Notices", value: String(ex.active ?? 0) },
        { label: "Expired / Inactive", value: String(ex.inactive ?? 0) },
      ];
    default:
      return [
        { label: "Students", value: String(s.totalStudents ?? 0) },
        { label: "Beds Capacity", value: String(s.totalBeds ?? 0), sub: `${s.occupiedBeds ?? 0} occupied` },
        { label: "Fees Collected", value: `Rs. ${(s.totalFeesCollected ?? 0).toLocaleString("en-IN")}`, sub: `${s.pendingFeesCount ?? 0} pending` },
        { label: "Visitor Logs", value: String(s.totalVisitors ?? 0) },
        { label: "Complaints", value: String(s.totalComplaints ?? 0), sub: `${s.openComplaintsCount ?? 0} open` },
        { label: "Active Notices", value: String(s.activeNoticesCount ?? 0) },
      ];
  }
}

// ── Detailed Table helper for PDF export ──
function getTableColumnsAndRows(tab, records) {
  if (!records || records.length === 0) {
    return { head: [["#", "Details"]], body: [] };
  }

  switch (tab) {
    case "Hostel":
      return {
        head: [["#", "Room No", "Floor", "Block", "Capacity", "Rent (Rs.)", "Occupied Beds"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.number || "N/A",
          rec.floor?.number ?? "N/A",
          rec.floor?.block?.name ?? "N/A",
          String(rec.capacity || 0),
          `Rs. ${Number(rec.rent || 0).toLocaleString("en-IN")}`,
          `${rec.beds?.filter((b) => b.allocations?.length > 0).length || 0} / ${rec.capacity || 0}`,
        ]),
      };
    case "Admissions":
      return {
        head: [["#", "User ID", "Applicant Name", "Email", "Status", "Applied Date"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          `#${rec.id}`,
          rec.name || rec.studentProfile?.fullName || "Applicant",
          rec.email || "N/A",
          rec.status || "N/A",
          rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "N/A",
        ]),
      };
    case "AllocationLetters":
      return {
        head: [["#", "Ref No", "Student", "College ID", "Room / Block", "Issued Date", "Signed By"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.referenceNo || "N/A",
          rec.allocation?.student?.fullName || "N/A",
          rec.allocation?.student?.collegeId || "N/A",
          `Room ${rec.allocation?.bed?.room?.number || "N/A"} (${rec.allocation?.bed?.room?.floor?.block?.name || "N/A"})`,
          rec.issuedDate ? new Date(rec.issuedDate).toLocaleDateString() : "N/A",
          rec.signedBy || "Warden Office",
        ]),
      };
    case "Students":
      return {
        head: [["#", "Student Name", "College ID", "Phone", "Email", "Block / Room", "Status"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.fullName || "N/A",
          rec.collegeId || "N/A",
          rec.phone || "N/A",
          rec.user?.email || "N/A",
          rec.allocations?.[0]
            ? `${rec.allocations[0].bed?.room?.floor?.block?.name || ""} - Room ${rec.allocations[0].bed?.room?.number || ""}`
            : "Unallocated",
          rec.user?.status || "active",
        ]),
      };
    case "Staff":
      return {
        head: [["#", "Staff Name", "Email", "Role", "Joined Date"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.name || "Staff Member",
          rec.email || "N/A",
          rec.role?.name || "STAFF",
          rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "N/A",
        ]),
      };
    case "Fees":
      return {
        head: [["#", "Student", "College ID", "Amount (Rs.)", "Due Date", "Status"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.student?.fullName || "Student",
          rec.student?.collegeId || "N/A",
          `Rs. ${Number(rec.amount || 0).toLocaleString("en-IN")}`,
          rec.dueDate ? new Date(rec.dueDate).toLocaleDateString() : "N/A",
          rec.status || "N/A",
        ]),
      };
    case "Leaves":
      return {
        head: [["#", "Student", "Reason", "Start Date", "End Date", "Status"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.student?.fullName || "Student",
          rec.reason || "N/A",
          rec.startDate ? new Date(rec.startDate).toLocaleDateString() : "N/A",
          rec.endDate ? new Date(rec.endDate).toLocaleDateString() : "N/A",
          rec.status || "N/A",
        ]),
      };
    case "Visitors":
      return {
        head: [["#", "Visitor Name", "Phone", "Relationship", "Student Visited", "Check-In", "Status"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.fullName || "N/A",
          rec.visitorPhone || "N/A",
          rec.relationship || "N/A",
          rec.studentName || "N/A",
          rec.checkIn ? new Date(rec.checkIn).toLocaleString() : (rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "N/A"),
          rec.status || "N/A",
        ]),
      };
    case "InOutRegister":
      return {
        head: [["#", "Student", "College ID", "Log Date", "Status", "Remarks"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.student?.fullName || "Student",
          rec.student?.collegeId || "N/A",
          rec.date ? new Date(rec.date).toLocaleDateString() : "N/A",
          rec.present ? "Present (In-Campus)" : "Absent (Out)",
          rec.remarks || "N/A",
        ]),
      };
    case "Complaints":
      return {
        head: [["#", "Title", "Category", "Priority", "Student", "Status"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.title || "N/A",
          rec.category || "N/A",
          (rec.priority || "N/A").toUpperCase(),
          rec.student?.fullName || "Student",
          rec.status || "N/A",
        ]),
      };
    case "NoticeBoard":
      return {
        head: [["#", "Notice Title", "Content Preview", "Active", "Posted By", "Date"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          rec.title || "N/A",
          rec.content ? rec.content.substring(0, 50) + "..." : "N/A",
          rec.isActive ? "Active" : "Inactive",
          rec.createdBy?.name || rec.createdBy?.email || "Admin",
          rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : "N/A",
        ]),
      };
    default:
      return {
        head: [["#", "Category", "Metric Name", "Current Status / Count"]],
        body: records.map((rec, idx) => [
          (idx + 1).toString(),
          "Operational Core",
          getRowSummaryText(tab, rec),
          "Connected",
        ]),
      };
  }
}

export { Route };
