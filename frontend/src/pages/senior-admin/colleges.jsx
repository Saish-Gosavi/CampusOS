import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  Building2,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  MapPin,
  Home,
  BookOpen,
  Package,
  ShieldCheck,
  UserPlus,
  X,
  KeyRound
} from "lucide-react";
import { toast } from "sonner";
import { collegeApi } from "@/services/api";

const Route = createFileRoute("/senior-admin/colleges")({
  component: CollegesPage
});

const STATUS_META = {
  Active: { bg: "#22C55E1A", fg: "#16A34A", icon: CheckCircle2 },
  Inactive: { bg: "#EF44441A", fg: "#DC2626", icon: XCircle }
};

function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Admins modal management state
  const [selectedCollegeForAdmins, setSelectedCollegeForAdmins] = useState(null);
  const [adminsModalOpen, setAdminsModalOpen] = useState(false);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const res = await collegeApi.getAll();
      if (res.success && res.data) {
        setColleges(res.data);
      }
    } catch (err) {
      console.error("Failed to load colleges:", err);
      toast.error("Failed to sync college details from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const counts = useMemo(() => {
    const total = colleges.length;
    const active = colleges.filter((c) => c.status === "Active").length;
    const inactive = total - active;
    const students = colleges.reduce((acc, c) => acc + (c._count?.students || 0), 0);
    return { total, active, inactive, students };
  }, [colleges]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return colleges.filter((c) => {
      return !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q);
    });
  }, [colleges, query]);

  function openManageAdmins(c) {
    setSelectedCollegeForAdmins(c);
    setAdminsModalOpen(true);
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{ backgroundColor: "#2563EB1A", color: "#2563EB" }}
            >
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Colleges & Sectors</h1>
              <p className="text-sm text-muted-foreground">
                View campus lists, enabled facilities, and manage standard sector administrators.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Total Colleges", value: counts.total, tint: "#2563EB", icon: Building2 },
          { label: "Active", value: counts.active, tint: "#22C55E", icon: CheckCircle2 },
          { label: "Inactive", value: counts.inactive, tint: "#EF4444", icon: XCircle },
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
        <div className="relative flex-grow">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or city…"
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-[#2563EB]/20"
          />
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
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    Loading colleges from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No colleges found in database.
                  </td>
                </tr>
              ) : (
                filtered.map((c, index) => {
                  const meta = STATUS_META[c.status] || STATUS_META.Active;
                  return (
                    <tr key={c.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-semibold"
                            style={{ backgroundColor: "#2563EB1A", color: "#2563EB" }}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <span className="font-medium text-foreground block">{c.name}</span>
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
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-2.5 py-1 text-xs font-medium text-foreground">
                          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                          <span>{c.users?.length || 0} Admin(s)</span>
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => openManageAdmins(c)}
                            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                            title="Manage Admins & Credentials"
                          >
                            <UserPlus className="h-4 w-4" />
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

      {/* Modal: Manage College Sector Admins */}
      {adminsModalOpen && selectedCollegeForAdmins && (
        <ManageCollegeAdminsModal
          college={selectedCollegeForAdmins}
          onClose={() => setAdminsModalOpen(false)}
          onRefresh={fetchColleges}
        />
      )}
    </div>
  );
}

// Re-use standard Sector Admin credential Modal component from Super Admin
function ManageCollegeAdminsModal({ college, onClose, onRefresh }) {
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [hasHostel, setHasHostel] = useState(college.hasHostel);
  const [hasLibrary, setHasLibrary] = useState(college.hasLibrary);
  const [hasInventory, setHasInventory] = useState(college.hasInventory);
  const [sectorRole, setSectorRole] = useState(
    college.hasHostel ? "admin" : college.hasLibrary ? "librarian" : "store"
  );
  const [submitting, setSubmitting] = useState(false);

  const availableRoles = [
    { name: "admin", label: "Hostel Admin" },
    { name: "librarian", label: "Library Admin" },
    { name: "store", label: "Inventory Admin" }
  ];

  async function toggleFacility(facility, value) {
    try {
      const updatedData = {
        name: college.name,
        city: college.city,
        status: college.status,
        hasHostel: facility === "hostel" ? value : hasHostel,
        hasLibrary: facility === "library" ? value : hasLibrary,
        hasInventory: facility === "inventory" ? value : hasInventory,
      };
      const res = await collegeApi.update(college.id, updatedData);
      if (res.success) {
        toast.success("College facilities updated successfully");
        if (facility === "hostel") {
          setHasHostel(value);
          if (value && !sectorRole) setSectorRole("admin");
        }
        if (facility === "library") {
          setHasLibrary(value);
          if (value && !sectorRole) setSectorRole("librarian");
        }
        if (facility === "inventory") {
          setHasInventory(value);
          if (value && !sectorRole) setSectorRole("store");
        }
        onRefresh();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update facilities");
    }
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
              <Building2 className="h-5 w-5 text-primary" />
              Manage Sector Admins for {college.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure enabled facilities and manage credentials for Hostel, Library, and Inventory administrators.
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
          {/* Section: Enable / Disable College Facilities */}
          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-primary" />
              Enable College Facilities
            </h3>
            <div className="flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasHostel}
                  onChange={(e) => toggleFacility("hostel", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-[#2563EB]"
                />
                <Home className="h-4 w-4 text-purple-500" />
                <span>Hostel Management System</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasLibrary}
                  onChange={(e) => toggleFacility("library", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-[#2563EB]"
                />
                <BookOpen className="h-4 w-4 text-blue-500" />
                <span>Library Management System</span>
              </label>
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasInventory}
                  onChange={(e) => toggleFacility("inventory", e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-[#2563EB]"
                />
                <Package className="h-4 w-4 text-emerald-500" />
                <span>Inventory Management System</span>
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <UserPlus className="h-4 w-4 text-primary" />
              Create Sector Admin Credentials
            </h3>

            {availableRoles.length === 0 ? (
              <p className="text-xs text-amber-500">
                No facilities enabled for this college.
              </p>
            ) : (
              <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Admin Full Name</span>
                  <input
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Email / Login Username</span>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="e.g. admin@campusos.com"
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
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
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block mb-1">Sector Facility Role</span>
                  <select
                    value={sectorRole}
                    onChange={(e) => setSectorRole(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
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
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
                  >
                    <KeyRound className="h-4 w-4" />
                    {submitting ? "Creating..." : "Create Admin Credentials"}
                  </button>
                </div>
              </form>
            )}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Assigned Administrators ({college.users?.length || 0})
            </h3>

            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Name</th>
                    <th className="px-4 py-2.5 font-medium">Role</th>
                    <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {!college.users || college.users.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-xs text-muted-foreground">
                        No sector admins assigned yet.
                      </td>
                    </tr>
                  ) : (
                    college.users.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/20">
                        <td className="px-4 py-2 text-xs font-semibold">{u.name}</td>
                        <td className="px-4 py-2 text-[10px] uppercase font-bold text-primary">
                          {u.role?.name || "admin"}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={() => handleDeleteAdmin(u.id)}
                            className="text-xs text-red-500 hover:underline cursor-pointer"
                          >
                            Remove
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

export { Route };
