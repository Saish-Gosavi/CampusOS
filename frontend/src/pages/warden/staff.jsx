import { useEffect, useState, useMemo } from "react";
import { createFileRoute } from "@/routes/compat";
import { UserCog, Search, Plus, Calendar, Check, X, Pencil, Trash2 } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { wardenStaffApi } from "@/services/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/warden/staff")({
  component: WardenStaffPage,
});

function WardenStaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    designation: "",
    status: "active",
  });

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceStaff, setAttendanceStaff] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendancePresent, setAttendancePresent] = useState(true);
  const [attendanceRemarks, setAttendanceRemarks] = useState("");

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await wardenStaffApi.getAll();
      setStaff(res.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const kpis = useMemo(() => {
    return {
      total: staff.length,
      active: staff.filter((s) => s.status === "active").length,
      inactive: staff.filter((s) => s.status === "inactive").length,
    };
  }, [staff]);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.phone && s.phone.includes(searchQuery));
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [staff, searchQuery, statusFilter]);

  // Form Handlers
  const handleOpenAdd = () => {
    setEditingStaff(null);
    setFormData({ name: "", phone: "", email: "", designation: "", status: "active" });
    setIsAddOpen(true);
  };

  const handleOpenEdit = (s) => {
    setEditingStaff(s);
    setFormData({
      name: s.name,
      phone: s.phone || "",
      email: s.email || "",
      designation: s.designation,
      status: s.status,
    });
    setIsAddOpen(true);
  };

  const handleSaveStaff = async () => {
    if (!formData.name.trim() || !formData.designation.trim()) {
      return toast.error("Name and designation are required");
    }
    
    try {
      if (editingStaff) {
        await wardenStaffApi.update(editingStaff.id, formData);
        toast.success("Staff updated successfully");
      } else {
        await wardenStaffApi.create(formData);
        toast.success("Staff added successfully");
      }
      setIsAddOpen(false);
      fetchStaff();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await wardenStaffApi.delete(id);
      toast.success("Staff deleted successfully");
      fetchStaff();
    } catch (err) {
      toast.error(err.message || "Deletion failed");
    }
  };

  // Attendance Handlers
  const handleOpenMarkAttendance = (s) => {
    setAttendanceStaff(s);
    setAttendanceDate(new Date().toISOString().split('T')[0]);
    setAttendancePresent(true);
    setAttendanceRemarks("");
    setIsAttendanceOpen(true);
  };

  const handleSaveAttendance = async () => {
    if (!attendanceDate) return toast.error("Date is required");
    try {
      await wardenStaffApi.markAttendance(attendanceStaff.id, {
        date: attendanceDate,
        present: attendancePresent,
        remarks: attendanceRemarks,
      });
      toast.success("Attendance marked successfully");
      setIsAttendanceOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to mark attendance");
    }
  };

  const handleOpenHistory = async (s) => {
    setAttendanceStaff(s);
    setIsHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const res = await wardenStaffApi.getAttendance(s.id);
      setAttendanceHistory(res.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#F3F4F6]">
      <WardenPageHeader
        title="Staff Management"
        description="Manage hostel staff and their attendance"
        icon={UserCog}
        tint="bg-blue-500/10 text-blue-600"
        breadcrumbs={[
          { label: "Dashboard", href: "/warden" },
          { label: "Staff Management" },
        ]}
        action={
          <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 text-white shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Staff
          </Button>
        }
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Staff</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{kpis.total}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-sm">
              <p className="text-sm font-medium text-emerald-600">Active Staff</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{kpis.active}</p>
              </div>
            </div>
            <div className="rounded-xl border border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-sm">
              <p className="text-sm font-medium text-red-600">Inactive Staff</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">{kpis.inactive}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-xl border border-white/40 bg-white/60 p-4 backdrop-blur-xl shadow-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search staff by name, designation or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/50 border-gray-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white/50 border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50/50 text-xs font-semibold uppercase text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3">Staff Member</th>
                    <th className="px-4 py-3">Designation</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        Loading staff...
                      </td>
                    </tr>
                  ) : filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No staff members found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{s.name}</div>
                          {s.email && <div className="text-xs text-gray-500">{s.email}</div>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {s.designation}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.phone || "—"}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={s.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                              onClick={() => handleOpenHistory(s)}
                              title="View Attendance History"
                            >
                              <Calendar className="h-4 w-4 mr-1" /> History
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                              onClick={() => handleOpenMarkAttendance(s)}
                              title="Mark Attendance"
                            >
                              <Check className="h-4 w-4 mr-1" /> Mark
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              onClick={() => handleOpenEdit(s)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDelete(s.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={handleOpenAdd}
        className="fixed bottom-6 right-6 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg h-14 w-14 p-0"
        title="Add Staff"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Add/Edit Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Full Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="grid gap-2">
              <Label>Designation *</Label>
              <Input
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="e.g. Security, Sweeper, Plumber"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10 digits"
                />
              </div>
              <div className="grid gap-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Email (Optional)</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStaff}>Save Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark Attendance Modal */}
      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <p className="text-sm text-gray-500">For {attendanceStaff?.name} ({attendanceStaff?.designation})</p>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Date *</Label>
              <Input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status *</Label>
              <Select
                value={attendancePresent ? "present" : "absent"}
                onValueChange={(val) => setAttendancePresent(val === "present")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Remarks (Optional)</Label>
              <Input
                value={attendanceRemarks}
                onChange={(e) => setAttendanceRemarks(e.target.value)}
                placeholder="e.g. Half day, Late, Sick"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAttendance}>Save Attendance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance History Modal */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Attendance History</DialogTitle>
            <p className="text-sm text-gray-500">For {attendanceStaff?.name}</p>
          </DialogHeader>
          <div className="py-4 max-h-[400px] overflow-y-auto">
            {historyLoading ? (
              <p className="text-center text-sm text-gray-500 py-4">Loading history...</p>
            ) : attendanceHistory.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-4">No attendance records found.</p>
            ) : (
              <div className="space-y-3">
                {attendanceHistory.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      {record.remarks && <p className="text-xs text-gray-500 mt-1">{record.remarks}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {record.present ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200">
                          <Check className="h-3 w-3" /> Present
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200">
                          <X className="h-3 w-3" /> Absent
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
