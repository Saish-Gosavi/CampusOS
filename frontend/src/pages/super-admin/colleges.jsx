import React, { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldCheck,
  UserPlus,
  BookOpen,
  Package,
  Home,
  KeyRound,
  Trash
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { collegeApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/super-admin/colleges")({
  component: CollegesPage
});

const STATUS_META = {
  Active: { bg: "#22C55E1A", fg: "#16A34A", icon: CheckCircle2 },
  Pending: { bg: "#EAB3081A", fg: "#B45309", icon: Clock },
  Inactive: { bg: "#EF44441A", fg: "#DC2626", icon: XCircle }
};

function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Modals
  const [collegeModalOpen, setCollegeModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedCollegeForAdmins, setSelectedCollegeForAdmins] = useState(null);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await collegeApi.getAll();
      if (res.success && Array.isArray(res.data)) {
        const formatted = res.data.map((c) => ({
          id: c.id,
          name: c.name,
          city: c.city || c.address || "Campus Main",
          status: c.status || "Active",
          hasHostel: c.hasHostel !== false,
          hasLibrary: c.hasLibrary !== false,
          hasInventory: c.hasInventory !== false,
          users: c.users || [],
          students: c.blocks ? c.blocks.length * 150 : 300,
        }));
        setColleges(formatted);
      }
    } catch (err) {
      toast.error("Failed to load colleges from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return colleges.filter((c) => {
      const matchesQ = !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
      const matchesS = statusFilter === "All" || c.status === statusFilter;
      return matchesQ && matchesS;
    });
  }, [colleges, query, statusFilter]);

  const counts = useMemo(
    () => ({
      total: colleges.length,
      active: colleges.filter((c) => c.status === "Active").length,
      pending: colleges.filter((c) => c.status === "Pending").length,
      students: colleges.reduce((s, c) => s + c.students, 0)
    }),
    [colleges]
  );

  function openCreate() {
    setEditing(null);
    setCollegeModalOpen(true);
  }

  function openEdit(c) {
    setEditing(c);
    setCollegeModalOpen(true);
  }

  function openManageAdmins(c) {
    setSelectedCollegeForAdmins(c);
    setAdminModalOpen(true);
  }

  async function remove(id) {
    if (!confirm("Are you sure you want to delete this college?")) return;
    try {
      const res = await collegeApi.delete(id);
      if (res.success) {
        toast.success("College deleted successfully");
        fetchColleges();
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete college");
    }
  }

  async function saveCollege(data) {
    try {
      if (editing) {
        const res = await collegeApi.update(editing.id, data);
        if (res.success) {
          toast.success("College updated successfully");
          fetchColleges();
        }
      } else {
        const res = await collegeApi.create(data);
        if (res.success) {
          toast.success("College created successfully");
          fetchColleges();
        }
      }
      setCollegeModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Failed to save college");
    }
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: "College Management" }]} />
          <div className="mt-3 flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{ backgroundColor: "#2563EB1A", color: "#2563EB" }}
            >
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">College Management</h1>
              <p className="text-sm text-muted-foreground">
                Manage colleges, enable facilities (Hostel, Library, Inventory), and assign sector admins.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1D4ED8]"
        >
          <Plus className="h-4 w-4" /> Add College
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total Colleges", value: counts.total, tint: "#2563EB", icon: Building2 },
          { label: "Active", value: counts.active, tint: "#22C55E", icon: CheckCircle2 },
          { label: "Pending", value: counts.pending, tint: "#EAB308", icon: Clock },
          { label: "Total Students", value: counts.students.toLocaleString(), tint: "#7B4CED", icon: Users }
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
              <span
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ backgroundColor: `${k.tint}1A`, color: k.tint }}
              >
                <k.icon className="h-4 w-4" />
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or city…"
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
        <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
          {["All", "Active", "Pending", "Inactive"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s ? "bg-[#2563EB] text-white" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">College</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Enabled Facilities</th>
                <th className="px-4 py-3 font-medium">College Admins</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Loading colleges from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No colleges found in database. Click "Add College" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const meta = STATUS_META[c.status] || STATUS_META.Active;
                  return (
                    <tr key={c.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-semibold"
                            style={{ backgroundColor: "#2563EB1A", color: "#2563EB" }}
                          >
                            {c.name.charAt(0)}
                          </span>
                          <div>
                            <span className="font-medium text-foreground block">{c.name}</span>
                            <span className="text-xs text-muted-foreground">ID: #{c.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {c.city}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {c.hasHostel && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600 dark:text-purple-400">
                              <Home className="h-3 w-3" /> Hostel
                            </span>
                          )}
                          {c.hasLibrary && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                              <BookOpen className="h-3 w-3" /> Library
                            </span>
                          )}
                          {c.hasInventory && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <Package className="h-3 w-3" /> Inventory
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openManageAdmins(c)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>{c.users.length} Admin(s)</span>
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: meta.bg, color: meta.fg }}
                        >
                          <meta.icon className="h-3 w-3" />
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openManageAdmins(c)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
                            title="Manage Admins & Credentials"
                          >
                            <UserPlus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
                            title="Edit College"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => remove(c.id)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Create / Edit College */}
      {collegeModalOpen && (
        <CollegeModal
          initial={editing}
          onClose={() => setCollegeModalOpen(false)}
          onSave={saveCollege}
        />
      )}

      {/* Modal 2: Manage College Admins & Facilities */}
      {adminModalOpen && selectedCollegeForAdmins && (
        <ManageCollegeAdminsModal
          college={selectedCollegeForAdmins}
          onClose={() => {
            setAdminModalOpen(false);
            setSelectedCollegeForAdmins(null);
          }}
          onRefresh={fetchColleges}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// College Modal (Form for College Info & Enabled Facilities)
// ─────────────────────────────────────────────────────────────
function CollegeModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [status, setStatus] = useState(initial?.status ?? "Active");
  const [hasHostel, setHasHostel] = useState(initial?.hasHostel ?? true);
  const [hasLibrary, setHasLibrary] = useState(initial?.hasLibrary ?? true);
  const [hasInventory, setHasInventory] = useState(initial?.hasInventory ?? true);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;
    setSubmitting(true);
    await onSave({
      name: name.trim(),
      city: city.trim(),
      status,
      hasHostel,
      hasLibrary,
      hasInventory
    });
    setSubmitting(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {initial ? "Edit College & Facilities" : "Add New College"}
          </h2>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4 p-5">
          <Field label="College Name">
            <input
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              placeholder="e.g. VPPCOE"
            />
          </Field>
          <Field label="City">
            <input
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
              placeholder="e.g. Mumbai"
            />
          </Field>
          <Field label="Status">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </Field>

          {/* Enabled Facilities Checkboxes */}
          <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/20 p-3">
            <span className="text-xs font-semibold text-foreground">Enable Facilities for this College</span>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={hasHostel}
                onChange={(e) => setHasHostel(e.target.checked)}
                className="h-4 w-4 rounded border-border text-[#2563EB] focus:ring-[#2563EB]"
              />
              <Home className="h-4 w-4 text-purple-500" />
              <span>Hostel Management System</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={hasLibrary}
                onChange={(e) => setHasLibrary(e.target.checked)}
                className="h-4 w-4 rounded border-border text-[#2563EB] focus:ring-[#2563EB]"
              />
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>Library Management System</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={hasInventory}
                onChange={(e) => setHasInventory(e.target.checked)}
                className="h-4 w-4 rounded border-border text-[#2563EB] focus:ring-[#2563EB]"
              />
              <Package className="h-4 w-4 text-emerald-500" />
              <span>Inventory Management System</span>
            </label>
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50"
            >
              {submitting ? "Saving..." : initial ? "Save Changes" : "Create College"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal to Manage College Admins & Create Credentials by Sector
// ─────────────────────────────────────────────────────────────
function ManageCollegeAdminsModal({ college, onClose, onRefresh }) {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [sectorRole, setSectorRole] = useState(
    college.hasHostel ? "warden" : college.hasLibrary ? "librarian" : "store"
  );
  const [submitting, setSubmitting] = useState(false);

  // Available Sector Roles based on Enabled Facilities
  const availableRoles = [];
  if (college.hasHostel) {
    availableRoles.push({ name: "warden", label: "Hostel Admin (Warden)" });
    availableRoles.push({ name: "admin", label: "Hostel Administrator" });
  }
  if (college.hasLibrary) {
    availableRoles.push({ name: "librarian", label: "Library Admin (Librarian)" });
  }
  if (college.hasInventory) {
    availableRoles.push({ name: "store", label: "Inventory Admin (Store Manager)" });
  }

  async function handleCreateAdmin(e) {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      toast.error("Please fill all admin credentials");
      return;
    }
    setSubmitting(true);
    try {
      const res = await collegeApi.addAdmin(college.id, {
        name: adminName.trim(),
        email: adminEmail.trim(),
        password: adminPassword,
        roleName: sectorRole,
      });
      if (res.success) {
        toast.success(`Admin credentials created for ${college.name}`);
        setAdminName("");
        setAdminEmail("");
        setAdminPassword("");
        onRefresh();
      }
    } catch (err) {
      toast.error(err.message || "Failed to create admin");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAdmin(userId) {
    if (!confirm("Are you sure you want to remove this admin?")) return;
    try {
      const res = await collegeApi.deleteAdmin(college.id, userId);
      if (res.success) {
        toast.success("Admin removed successfully");
        onRefresh();
      }
    } catch (err) {
      toast.error(err.message || "Failed to remove admin");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-muted/30">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#2563EB]" />
              Manage Sector Admins for {college.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              Create and manage credentials for Hostel, Library, and Inventory sector administrators.
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-6">
          {/* Section 1: Create New Sector Admin Credentials */}
          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <UserPlus className="h-4 w-4 text-[#2563EB]" />
              Create Sector Admin Credentials
            </h3>

            {availableRoles.length === 0 ? (
              <p className="text-xs text-amber-500">
                No facilities enabled for this college. Edit the college to enable Hostel, Library, or Inventory facilities first.
              </p>
            ) : (
              <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Admin Full Name</span>
                  <input
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Email / Login Username</span>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="e.g. warden.vppcoe@campusos.com"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Initial Password</span>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Set initial password"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Sector Facility Role</span>
                  <select
                    value={sectorRole}
                    onChange={(e) => setSectorRole(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
                  >
                    {availableRoles.map((r) => (
                      <option key={r.name} value={r.name}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2 flex justify-end mt-1">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50"
                  >
                    <KeyRound className="h-4 w-4" />
                    {submitting ? "Creating..." : "Create Admin Credentials"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Section 2: Active Admins for this College */}
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-[#2563EB]" />
              Assigned Administrators ({college.users?.length || 0})
            </h3>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Email</th>
                    <th className="px-4 py-2.5 font-medium">Sector Role</th>
                    <th className="px-4 py-2.5 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {!college.users || college.users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">
                        No admins assigned to this college yet. Use the form above to add an admin.
                      </td>
                    </tr>
                  ) : (
                    college.users.map((u) => (
                      <tr key={u.id} className="transition-colors hover:bg-muted/30">
                        <td className="px-4 py-2.5 font-medium text-foreground">{u.name || "Admin"}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 capitalize">
                            {u.role?.name || "Admin"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => handleDeleteAdmin(u.id)}
                            className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444] ml-auto"
                            title="Remove Admin"
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </button>
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
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

export { Route };
