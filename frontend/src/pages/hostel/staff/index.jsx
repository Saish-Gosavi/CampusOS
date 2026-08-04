import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect, useMemo } from "react";
import { UserCog, Plus, Search, Filter, CalendarDays, Edit, Trash2 } from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { staffApi } from "@/services/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/hostel-admin/staff")({
  component: StaffManagementPage,
});

function StaffManagementPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await staffApi.getAll();
      setStaff(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load staff.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return staff.filter((s) => {
      const matchQ = !q || s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q);
      const matchR = roleFilter === "All" || s.role?.name === roleFilter.toLowerCase();
      return matchQ && matchR;
    });
  }, [staff, query, roleFilter]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (staffMember) => {
    setEditing(staffMember);
    setModalOpen(true);
  };

  const openAttendance = async (staffMember) => {
    setSelectedStaff(staffMember);
    setAttendanceModalOpen(true);
    try {
      const res = await staffApi.getAttendance(staffMember.id);
      setAttendanceData(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load attendance");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      status: formData.get("status"),
    };
    if (!editing) {
      data.password = formData.get("password") || "Password@123";
      // Manually map role names to role IDs for creation
      const roleName = formData.get("role");
      let roleId = 5; // Default security
      if (roleName === "librarian") roleId = 6;
      if (roleName === "store") roleId = 7;
      data.roleId = roleId;
    }

    try {
      if (editing) {
        await staffApi.update(editing.id, data);
        toast.success("Staff updated.");
      } else {
        await staffApi.create(data);
        toast.success("Staff created.");
      }
      setModalOpen(false);
      fetchStaff();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      try {
        await staffApi.delete(id);
        toast.success("Staff removed.");
        fetchStaff();
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to remove staff.");
      }
    }
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <HostelPageHeader
        title="Staff Management"
        description="View and manage hostel staff members and their attendance."
        icon={UserCog}
        tint="#7B4CED"
        breadcrumbs={[{ label: "Staff Management" }]}
        action={
          <Button onClick={openAdd} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-1.5 h-4 w-4" /> Add Staff
          </Button>
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex w-full items-center gap-3 sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Warden">Warden</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="Librarian">Librarian</SelectItem>
              <SelectItem value="Store">Store</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted-foreground">
            <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center">Loading staff...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-muted-foreground">No staff members found.</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{s.name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </td>
                    <td className="px-6 py-4 capitalize">{s.role?.name || "N/A"}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openAttendance(s)}>
                        <CalendarDays className="h-4 w-4 mr-1.5" /> Attendance
                      </Button>
                      {/* Hide edit/delete for Wardens */}
                      {s.role?.name !== "warden" && (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(s)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Staff" : "Add Staff Member"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input name="name" defaultValue={editing?.name} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input name="email" type="email" defaultValue={editing?.email} required />
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label>Role</Label>
                <Select name="role" defaultValue="security" required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="librarian">Librarian</SelectItem>
                    <SelectItem value="store">Store</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            {!editing && (
              <div className="space-y-2">
                <Label>Password (Optional)</Label>
                <Input name="password" type="password" placeholder="Defaults to Password@123" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="status" defaultValue={editing?.status || "active"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">{editing ? "Save Changes" : "Create Staff"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={attendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedStaff?.name}'s Attendance</DialogTitle>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto mt-4">
            {attendanceData.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No attendance records found.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Date</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record) => (
                    <tr key={record.id} className="border-b last:border-0">
                      <td className="py-2">{new Date(record.date).toLocaleDateString()}</td>
                      <td className="py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${record.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {record.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                      <td className="py-2 text-muted-foreground">{record.remarks || '-'}</td>
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
