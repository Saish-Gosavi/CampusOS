import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  User,
  Monitor,
  Globe,
  Tag,
  Clock,
  Building,
  BookOpen,
  Box,
  Settings,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { auditLogApi } from "@/services/api";

const Route = createFileRoute("/super-admin/audit-logs")({
  component: AuditLogsPage,
});

function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, critical: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal detail
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const response = await auditLogApi.getLogs({
        page: pagination.page,
        limit: pagination.limit,
        search,
        module: moduleFilter === "All" ? "" : moduleFilter,
        action: actionFilter === "All" ? "" : actionFilter,
        status: statusFilter === "All" ? "" : statusFilter,
        startDate,
        endDate,
      });

      if (response.success) {
        setLogs(response.data.logs);
        setStats(response.data.stats);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [pagination.page, moduleFilter, actionFilter, statusFilter, startDate, endDate]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchAuditLogs();
  };

  const handleResetFilters = () => {
    setSearch("");
    setModuleFilter("All");
    setActionFilter("All");
    setStatusFilter("All");
    setStartDate("");
    setEndDate("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Export handlers
  const handleExportCSV = () => {
    if (!logs.length) return;
    const headers = ["Log ID", "Date & Time", "Module", "Action", "Description", "Performed By", "Status", "IP Address"];
    const rows = logs.map((log) => [
      log.id,
      new Date(log.createdAt).toLocaleString(),
      log.module,
      log.action,
      `"${log.description?.replace(/"/g, '""') || ""}"`,
      `"${log.performedBy}"`,
      log.status,
      log.ipAddress,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openViewDetails = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Success":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Success
          </Badge>
        );
      case "Warning":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold">
            <AlertTriangle className="h-3.5 w-3.5" />
            Warning
          </Badge>
        );
      case "Failed":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20 flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold">
            <XCircle className="h-3.5 w-3.5" />
            Failed
          </Badge>
        );
      case "Critical":
        return (
          <Badge className="bg-red-600/15 text-red-600 dark:bg-red-600/25 dark:text-red-400 border-red-600/30 flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold animate-pulse">
            <ShieldAlert className="h-3.5 w-3.5" />
            Critical
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getModuleIcon = (moduleName) => {
    switch (moduleName) {
      case "Hostel":
        return <Building className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      case "Library":
        return <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "Inventory":
        return <Box className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "System":
      default:
        return <Settings className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 md:p-6">
      {/* Page Header */}
      <div>
                <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
              style={{ backgroundColor: "#7B4CED1A", color: "#7B4CED" }}
            >
              <ScrollText className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Audit Logs</h1>
              <p className="text-sm text-muted-foreground">
                Track every administrative action across Hostel, Library, Inventory & System modules.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchAuditLogs} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Audit Logs</p>
              <h3 className="mt-1 text-2xl font-bold text-foreground">{stats.total}</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <ScrollText className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Successful Actions</p>
              <h3 className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.success}</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Failed Attempts</p>
              <h3 className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.failed}</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-rose-500/10 text-rose-600">
              <XCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Critical Events</p>
              <h3 className="mt-1 text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-red-600/10 text-red-600">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-4 md:p-5 flex flex-col gap-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search action, description, or super admin name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <Button type="submit" size="default" className="w-full md:w-auto gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResetFilters}
              className="w-full md:w-auto text-muted-foreground"
            >
              Reset
            </Button>
          </form>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-border">
            {/* Module Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Module</label>
              <Select value={moduleFilter} onValueChange={(val) => setModuleFilter(val)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Modules</SelectItem>
                  <SelectItem value="Hostel">Hostel</SelectItem>
                  <SelectItem value="Library">Library</SelectItem>
                  <SelectItem value="Inventory">Inventory</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Action Type</label>
              <Select value={actionFilter} onValueChange={(val) => setActionFilter(val)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Actions</SelectItem>
                  <SelectItem value="Create Hostel">Create Hostel</SelectItem>
                  <SelectItem value="Update Hostel">Update Hostel</SelectItem>
                  <SelectItem value="Delete Hostel">Delete Hostel</SelectItem>
                  <SelectItem value="Assign Hostel Admin">Assign Hostel Admin</SelectItem>
                  <SelectItem value="Create Library">Create Library</SelectItem>
                  <SelectItem value="Add Library Admin">Add Library Admin</SelectItem>
                  <SelectItem value="Update Stock">Update Stock</SelectItem>
                  <SelectItem value="Create Admin">Create Admin</SelectItem>
                  <SelectItem value="Update Role">Update Role & Permissions</SelectItem>
                  <SelectItem value="Backup Database">Backup Database</SelectItem>
                  <SelectItem value="Database Restore">Database Restore</SelectItem>
                  <SelectItem value="Export Report">Export Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Status</label>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Date</label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Module</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Performed By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">View Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-primary" />
                      Fetching audit logs...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    No audit logs match your search and filter criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getModuleIcon(log.module)}
                        <span className="font-medium text-foreground">{log.module}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground whitespace-nowrap">{log.action}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{log.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary grid place-items-center text-xs font-bold">
                          {log.performedBy.charAt(0)}
                        </div>
                        <span className="text-xs text-foreground font-medium">{log.performedBy}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(log.status)}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" onClick={() => openViewDetails(log)} className="gap-1.5 text-xs">
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20 text-xs">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{logs.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to{" "}
            <span className="font-semibold text-foreground">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of{" "}
            <span className="font-semibold text-foreground">{pagination.total}</span> entries
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || loading}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* View Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-bold">
              <span>Audit Log Details</span>
              {selectedLog && getStatusBadge(selectedLog.status)}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Complete metadata & activity record for Log ID #{selectedLog?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 bg-muted/40 p-4 rounded-lg text-xs">
                <div>
                  <span className="text-muted-foreground block mb-0.5">Log ID</span>
                  <span className="font-mono font-bold text-foreground">#{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Date & Time</span>
                  <span className="font-medium text-foreground">{new Date(selectedLog.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Module</span>
                  <span className="font-semibold text-foreground">{selectedLog.module}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Action</span>
                  <span className="font-semibold text-foreground">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">Performed By</span>
                  <span className="font-medium text-foreground">{selectedLog.performedBy}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">User Email</span>
                  <span className="font-medium text-foreground">{selectedLog.userEmail}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">IP Address</span>
                  <span className="font-mono text-foreground">{selectedLog.ipAddress}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-0.5">User Agent</span>
                  <span className="truncate block font-mono text-foreground">{selectedLog.userAgent}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Description</h4>
                <p className="text-sm bg-muted/20 p-3 rounded border border-border text-foreground">{selectedLog.description}</p>
              </div>

              {/* Data payload changes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                    <Tag className="h-3 w-3 text-rose-500" />
                    Previous State (Old Data)
                  </h4>
                  <pre className="text-xs font-mono bg-muted/50 p-3 rounded border border-border max-h-36 overflow-auto text-foreground">
                    {selectedLog.oldData ? JSON.stringify(typeof selectedLog.oldData === "string" ? JSON.parse(selectedLog.oldData) : selectedLog.oldData, null, 2) : "None (New Creation)"}
                  </pre>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                    <Tag className="h-3 w-3 text-emerald-500" />
                    New State (New Data)
                  </h4>
                  <pre className="text-xs font-mono bg-muted/50 p-3 rounded border border-border max-h-36 overflow-auto text-foreground">
                    {selectedLog.newData ? JSON.stringify(typeof selectedLog.newData === "string" ? JSON.parse(selectedLog.newData) : selectedLog.newData, null, 2) : "None (Deletion)"}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { Route };
