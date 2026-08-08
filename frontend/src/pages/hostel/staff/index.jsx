import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import {
  UserCog, Plus, Search, Filter, CalendarDays,
  Pencil, Trash2, Phone, BriefcaseBusiness,
  KeyRound, ShieldCheck, Mail, CheckCircle2, Download
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
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const Route = createFileRoute("/hostel-admin/staff")({
  component: StaffManagementPage,
});

const BLANK_FORM = { name: "", phone: "", email: "", designation: "", status: "active" };

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

  /* ── Credentials modal ── */
  const [credModalOpen, setCredModalOpen] = useState(false);
  const [credForm, setCredForm] = useState({ username: "", password: "", action: "create" });
  const [credSaving, setCredSaving] = useState(false);

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
      const matchQ = !q || s.name?.toLowerCase().includes(q) || s.designation?.toLowerCase().includes(q) || s.phone?.includes(q) || s.email?.toLowerCase().includes(q);
      const matchS = statusFilter === "All" || s.status === statusFilter;
      return matchQ && matchS;
    });
  }, [staff, query, statusFilter]);

  const counts = useMemo(() => {
    const active = staff.filter(s => s.status === "active").length;
    const sysAccess = staff.filter(s => s.user).length;
    return {
      total: staff.length,
      active,
      sysAccess,
    };
  }, [staff]);

  const isSystemRole = (designation) => {
    const d = designation?.toLowerCase() || "";
    return d.includes("security") || d.includes("mess");
  };

  /* ── Modal helpers ── */
  const openAdd = () => {
    setForm(BLANK_FORM);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setForm({ name: s.name, phone: s.phone || "", email: s.email || "", designation: s.designation, status: s.status, _id: s.id });
    setModalOpen(true);
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
      email:       form.email.trim() || undefined,
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

  const downloadReport = () => {
    try {
      toast.info("Preparing PDF report...");
      console.log('Generating PDF, filtered count:', filtered?.length);

      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Staff Attendance Report", 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

      const headers = [["Name", "Designation", "Phone", "Email", "Status"]];
      const data = filtered.map(s => [
        s.name || "-",
        s.designation || "-",
        s.phone || "-",
        s.email || "-",
        s.status || "-"
      ]);

      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          startY: 35,
          head: headers,
          body: data,
          theme: 'grid',
          headStyles: { fillColor: [123, 76, 237] },
        });
      } else {
        console.warn('autoTable plugin not available, falling back to simple text');
        let y = 35;
        data.forEach(row => {
          doc.text(row.join(' | '), 14, y);
          y += 6;
        });
      }

      doc.save(`staff_attendance_report_${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("Report downloaded successfully!");
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('Failed to generate PDF report.');
    }
  };

  const openAttendance = async (s) => {
    setSelectedStaff(s);
    setAttendanceData([]);
    setAttendanceModalOpen(true);
    setAttendanceLoading(true);
    try {
      const idToFetch = s.isWarden ? s.userId : s.id;
      const res = await staffApi.getAttendance(idToFetch, s.isWarden);
      setAttendanceData(res.data || []);
    } catch {
      toast.error("Failed to load attendance");
    } finally {
      setAttendanceLoading(false);
    }
  };

  const openCredentials = (s) => {
    setSelectedStaff(s);
    setCredForm({ 
      username: s.email || s.user?.email || "", 
      password: "", 
      action: s.user ? "reset" : "create" 
    });
    setCredModalOpen(true);
  };

  const handleCredSave = async (e, actionType) => {
    e.preventDefault();
    const action = actionType || credForm.action;
    setCredSaving(true);
    try {
      if (action === "create") {
        if (!credForm.username || !credForm.password) {
          toast.error("Username and password required");
          setCredSaving(false);
          return;
        }
        await staffApi.createCredentials(selectedStaff.id, { username: credForm.username, password: credForm.password });
        toast.success("Credentials created.");
      } else if (action === "reset") {
        if (!credForm.password) {
          toast.error("New password required");
          setCredSaving(false);
          return;
        }
        await staffApi.resetPassword(selectedStaff.id, { newPassword: credForm.password });
        toast.success("Password reset.");
      } else if (action === "status") {
        const newStatus = selectedStaff.user?.status === "active" ? "suspended" : "active";
        await staffApi.updateLoginStatus(selectedStaff.id, { status: newStatus });
        toast.success(`Login access ${newStatus === "active" ? "enabled" : "disabled"}.`);
      }
      setCredModalOpen(false);
      fetchStaff();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update credentials.");
    } finally {
      setCredSaving(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Staff Management"
        description="Manage hostel staff members, their attendance, and system credentials."
        icon={UserCog}
        tint="#7B4CED"
        breadcrumbs={[{ label: "Staff Management" }]}
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="bg-background" onClick={downloadReport}>
              <Download className="mr-1.5 h-4 w-4" /> Attendance Report
            </Button>
            <Button onClick={openAdd} className="bg-primary hover:bg-primary/90">
              <Plus className="mr-1.5 h-4 w-4" /> Add Staff
            </Button>
          </div>
        }
      />

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Staff",  value: counts.total,    color: "#7B4CED", icon: UserCog },
          { label: "Active",       value: counts.active,   color: "#15803D", icon: CheckCircle2 },
          { label: "System Access", value: counts.sysAccess, color: "#F59E0B", icon: ShieldCheck },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center gap-4">
            <div className="rounded-lg p-2.5" style={{ background: `${k.color}1A` }}>
              <k.icon className="h-5 w-5" style={{ color: k.color }} />
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
            placeholder="Search by name, designation, email, or phone..."
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
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">System Access</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">Loading staff...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                    No staff members found. Click <strong>Add Staff</strong> to begin.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      <div className="flex flex-col">
                        <span>{s.name}</span>
                        {s.isWarden && <span className="text-[10px] text-muted-foreground mt-0.5">Managed in Warden Module</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4"><DesignationBadge designation={s.designation} /></td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {s.phone ? (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
                            <Phone className="h-3 w-3" />{s.phone}
                          </span>
                        ) : null}
                        {s.email ? (
                          <span className="inline-flex items-center gap-1.5 text-muted-foreground text-xs">
                            <Mail className="h-3 w-3" />{s.email}
                          </span>
                        ) : null}
                        {!s.phone && !s.email && <span className="text-muted-foreground/50">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4"><StatusPill status={s.status} /></td>
                    <td className="px-6 py-4">
                      {s.user ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.user.status === "active" ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50" : "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50"}`}>
                          <ShieldCheck className="h-3 w-3" /> {s.user.status === "active" ? "Active" : "Suspended"}
                        </span>
                      ) : isSystemRole(s.designation) ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                          <KeyRound className="h-3 w-3" /> No Access
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50 text-xs">Not Eligible</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => openAttendance(s)} title="View Attendance">
                          <CalendarDays className="h-4 w-4" />
                        </Button>
                        {isSystemRole(s.designation) && (
                          <Button variant="outline" size="sm" onClick={() => openCredentials(s)} title="Manage Credentials">
                            <KeyRound className="h-4 w-4 text-amber-600" />
                          </Button>
                        )}
                        {!s.readOnly && (
                          <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {!s.readOnly && (
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => handleDelete(s.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. staff@example.com"
                  value={form.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
              <Input
                id="designation"
                placeholder="e.g. Cleaning, Security, Mess Manager..."
                value={form.designation}
                onChange={(e) => handleFormChange("designation", e.target.value)}
                required
              />
              <p className="text-[10px] text-muted-foreground mt-1">
                Roles eligible for login: Security, Mess Manager
              </p>
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

      {/* ── Credentials Modal ── */}
      <Dialog open={credModalOpen} onOpenChange={setCredModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-500" />
              Manage Access: {selectedStaff?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {!selectedStaff?.user && (
              <form onSubmit={(e) => handleCredSave(e, "create")} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Username / Email</Label>
                  <Input 
                    required type="email"
                    value={credForm.username} 
                    onChange={e => setCredForm(prev => ({...prev, username: e.target.value}))} 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Initial Password</Label>
                  <Input 
                    required type="password"
                    value={credForm.password} 
                    onChange={e => setCredForm(prev => ({...prev, password: e.target.value}))} 
                  />
                </div>
                <Button type="submit" disabled={credSaving} className="w-full">
                  Create Credentials
                </Button>
              </form>
            )}

            {selectedStaff?.user && (
              <div className="space-y-6">
                <div className="bg-muted/30 p-3 rounded-lg border text-sm flex justify-between items-center">
                  <div>
                    <span className="text-muted-foreground block text-xs">Current Username</span>
                    <span className="font-medium">{selectedStaff.user.email}</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${selectedStaff.user.status === "active" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}`}>
                    {selectedStaff.user.status === "active" ? "Active" : "Suspended"}
                  </span>
                </div>
                
                <form onSubmit={(e) => handleCredSave(e, "reset")} className="space-y-3 border-t pt-4">
                  <Label>Reset Password</Label>
                  <div className="flex gap-2">
                    <Input 
                      required type="password" placeholder="New Password"
                      value={credForm.password} 
                      onChange={e => setCredForm(prev => ({...prev, password: e.target.value}))} 
                    />
                    <Button type="submit" disabled={credSaving} variant="secondary">Reset</Button>
                  </div>
                </form>

                <div className="border-t pt-4">
                  <Button 
                    type="button" disabled={credSaving} className="w-full"
                    variant={selectedStaff.user.status === "active" ? "destructive" : "default"}
                    onClick={(e) => handleCredSave(e, "status")}
                  >
                    {selectedStaff.user.status === "active" ? "Suspend Login Access" : "Restore Login Access"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
