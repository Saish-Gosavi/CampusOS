import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  UserCog, Plus, Search, Filter, CalendarDays,
  Pencil, Trash2, Phone, BriefcaseBusiness
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { staffApi } from "@/services/api";
import { toast } from "sonner";

export const Route = createFileRoute("/hostel-admin/staff")({
  component: StaffManagementPage,
});

const BLANK_FORM = { name: "", phone: "", designation: "", status: "active" };

function DesignationBadge({ designation }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
      <BriefcaseBusiness className="h-3 w-3" />
      {designation}
    </span>
  );
}

function StaffManagementPage() {
  const [staff, setStaff]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [query, setQuery]         = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ── Form modal state ── */
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState(BLANK_FORM);

  /* ── Attendance modal ── */
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff]             = useState(null);
  const [attendanceData, setAttendanceData]           = useState([]);
  const [attendanceLoading, setAttendanceLoading]     = useState(false);

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await staffApi.getAll();
      setStaff(res.data || []);
    } catch {
      toast.error("Failed to load staff.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return staff.filter((s) => {
      const matchQ = !q || s.name?.toLowerCase().includes(q) || s.designation?.toLowerCase().includes(q) || s.phone?.includes(q);
      const matchS = statusFilter === "All" || s.status === statusFilter;
      return matchQ && matchS;
    });
  }, [staff, query, statusFilter]);

  const counts = useMemo(() => ({
    total:    staff.length,
    active:   staff.filter((s) => s.status === "active").length,
    inactive: staff.filter((s) => s.status === "inactive").length,
  }), [staff]);

  /* ── Modal helpers ── */
  const openAdd = () => {
    setForm(BLANK_FORM);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setForm({ name: s.name, phone: s.phone || "", designation: s.designation, status: s.status });
    setModalOpen(true);
    // store id on form for update
    setForm({ name: s.name, phone: s.phone || "", designation: s.designation, status: s.status, _id: s.id });
  };

  const handleFormChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required.");
    if (!form.designation.trim()) return toast.error("Designation is required.");

    setSaving(true);
    const payload = {
      name:        form.name.trim(),
      phone:       form.phone.trim() || undefined,
      designation: form.designation.trim(),
      status:      form.status,
    };

    try {
      if (form._id) {
        await staffApi.update(form._id, payload);
        toast.success("Staff member updated.");
      } else {
        await staffApi.create(payload);
        toast.success("Staff member added.");
      }
      setModalOpen(false);
      fetchStaff();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Remove this staff member?")) return;
    try {
      await staffApi.delete(id);
      toast.success("Staff member removed.");
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove.");
    }
  };

  const openAttendance = async (s) => {
    setSelectedStaff(s);
    setAttendanceData([]);
    setAttendanceModalOpen(true);
    setAttendanceLoading(true);
    try {
      const res = await staffApi.getAttendance(s.id);
      setAttendanceData(res.data || []);
    } catch {
      toast.error("Failed to load attendance");
    } finally {
      setAttendanceLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Staff Management"
        description="Manage non-system hostel staff members (cleaners, maintenance, cooks, etc.)"
        icon={UserCog}
        tint="#7B4CED"
        breadcrumbs={[{ label: "Staff Management" }]}
        action={
          <Button onClick={openAdd} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-1.5 h-4 w-4" /> Add Staff
          </Button>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Staff",  value: counts.total,    color: "#7B4CED" },
          { label: "Active",       value: counts.active,   color: "#15803D" },
          { label: "Inactive",     value: counts.inactive, color: "#DC2626" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center gap-4">
            <div className="rounded-lg p-2.5" style={{ background: `${k.color}1A` }}>
              <UserCog className="h-5 w-5" style={{ color: k.color }} />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">{k.value}</div>
              <div className="text-xs text-muted-foreground">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center rounded-xl border border-border bg-card p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, designation or phone..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">Loading staff...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                    No staff members found. Click <strong>Add Staff</strong> to begin.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{s.name}</td>
                    <td className="px-6 py-4"><DesignationBadge designation={s.designation} /></td>
                    <td className="px-6 py-4">
                      {s.phone ? (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />{s.phone}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4"><StatusPill status={s.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => openAttendance(s)}>
                          <CalendarDays className="h-3.5 w-3.5 mr-1" /> Attendance
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleDelete(s.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
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

      {/* ── Add / Edit Modal ── */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>{form._id ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="e.g. Ramesh Kumar"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
              <Input
                id="designation"
                placeholder="e.g. Cleaning, Maintenance, Cook..."
                value={form.designation}
                onChange={(e) => handleFormChange("designation", e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => handleFormChange("status", v)}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : form._id ? "Save Changes" : "Add Staff"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Attendance Modal ── */}
      <Dialog open={attendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              {selectedStaff?.name} — Attendance
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto mt-2">
            {attendanceLoading ? (
              <p className="text-center text-sm text-muted-foreground py-6">Loading...</p>
            ) : attendanceData.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">No attendance records found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-xs font-semibold uppercase text-muted-foreground">
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="py-2">{new Date(r.date).toLocaleDateString("en-IN")}</td>
                      <td className="py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${r.present ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {r.present ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td className="py-2 text-muted-foreground">{r.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
