import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Trash2,
  X,
  Mail,
  Building2,
  CheckCircle2,
  Clock,
  XCircle,
  UserCog,
  Shield,
  Loader2,
  Plus,
  KeyRound,
  UserPlus,
  Home,
  BookOpen,
  Package
} from "lucide-react";
import { toast } from "sonner";
import { userApi, collegeApi } from "@/services/api";

const Route = createFileRoute("/senior-admin/admins")({
  component: AdminsPage
});

const MODULE_META = {
  Admin:     { bg: "#7B4CED1A", fg: "#7B4CED", label: "Hostel" },
  admin:     { bg: "#7B4CED1A", fg: "#7B4CED", label: "Hostel" },
  Librarian: { bg: "#3B82F61A", fg: "#3B82F6", label: "Library" },
  librarian: { bg: "#3B82F61A", fg: "#3B82F6", label: "Library" },
  Store:     { bg: "#22C55E1A", fg: "#16A34A", label: "Inventory" },
  store:     { bg: "#22C55E1A", fg: "#16A34A", label: "Inventory" },
  General:   { bg: "#64748B1A", fg: "#64748B", label: "General" }
};

function AdminsPage() {
  const [admins, setAdmins]       = useState([]);
  const [colleges, setColleges]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [query, setQuery]         = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  /* ---------- data fetching ---------- */
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const res  = await userApi.getAll();
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);

      const mapped = list.map((u) => {
        const rawRole = u.role?.name || "General";
        return {
          id:     u.id,
          name:   u.name || u.email?.split("@")[0] || "User",
          email:  u.email || "",
          module: rawRole,
          campus: u.college?.name
            ? `${u.college.name}${u.college.city ? " — " + u.college.city : ""}`
            : "—",
          raw:    u
        };
      });

      setAdmins(mapped);
    } catch (err) {
      console.error("Failed to load admins:", err);
      setError("Unable to load data from server");
    } finally {
      setLoading(false);
    }
  };

  const fetchColleges = async () => {
    try {
      const res = await collegeApi.getAll();
      if (res.success && res.data) setColleges(res.data);
    } catch (err) {
      console.error("Failed to load colleges:", err);
    }
  };

  useEffect(() => {
    fetchColleges();
    fetchAdmins();
  }, []);

  /* ---------- derived ---------- */
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return admins.filter((a) => {
      const mQ = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.campus.toLowerCase().includes(q);
      const mM = moduleFilter === "All" || a.module.toLowerCase() === moduleFilter.toLowerCase();
      return mQ && mM;
    });
  }, [admins, query, moduleFilter]);

  const counts = useMemo(() => ({
    total:   admins.length,
    modules: new Set(admins.map((a) => a.module)).size
  }), [admins]);

  /* ---------- actions ---------- */
  async function remove(id) {
    if (!confirm("Remove this sector admin?")) return;
    try {
      await userApi.delete(id);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      toast.success("Admin removed.");
    } catch (err) {
      console.error("Failed to delete admin:", err);
      toast.error("Failed to remove admin.");
    }
  }

  /* Called after AdminModal successfully creates an admin */
  async function onAdminCreated() {
    setModalOpen(false);
    await fetchAdmins();   // refresh from server so the new row appears immediately
  }

  /* ---------- render ---------- */
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mt-3 flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{ backgroundColor: "#EAB3081A", color: "#B45309" }}
            >
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Sector Admin Management</h1>
              <p className="text-sm text-muted-foreground">
                View and manage sector administrators (Hostel, Library, Inventory) dynamically.
              </p>
            </div>
          </div>
        </div>

        {/* Add Admin Button — upper-right corner */}
        <div className="mt-3 flex shrink-0 items-start">
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #7B4CED, #5B33CC)" }}
          >
            <Plus className="h-4 w-4" />
            Add Admin
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <KPI label="Total Admins"    value={counts.total}   icon={UserCog} tint="#2563EB" />
        <KPI label="Modules Covered" value={counts.modules} icon={Shield}  tint="#7B4CED" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 md:flex-row md:items-center md:justify-between shadow-sm">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or campus..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-[#2563EB]/20"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="All">All Modules</option>
            <option value="admin">Hostel</option>
            <option value="librarian">Library</option>
            <option value="store">Inventory</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Admin</th>
                <th className="px-4 py-3 font-medium">Module / Role</th>
                <th className="px-4 py-3 font-medium">Campus</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      Loading live data...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    {error || "No admins match your filters."}
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const m = MODULE_META[a.module] || { bg: "#64748B1A", fg: "#64748B", label: a.module };
                  return (
                    <tr key={a.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold"
                            style={{ backgroundColor: "#7B4CED", color: "white" }}
                          >
                            {a.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                          </span>
                          <div>
                            <div className="font-medium text-foreground">{a.name}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" /> {a.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{ backgroundColor: m.bg, color: m.fg }}
                        >
                          {m.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-foreground">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          {a.campus}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => remove(a.id)}
                            className="rounded-md p-2 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-500"
                            aria-label="Delete"
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

      {/* Modal */}
      {modalOpen && (
        <CreateAdminModal
          colleges={colleges}
          onClose={() => setModalOpen(false)}
          onCreated={onAdminCreated}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  KPI card                                                            */
/* ------------------------------------------------------------------ */
function KPI({ label, value, icon: Icon, tint }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ backgroundColor: `${tint}1A`, color: tint }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Create Admin Modal — same form & same API as the Colleges modal    */
/* ------------------------------------------------------------------ */
function CreateAdminModal({ colleges, onClose, onCreated }) {
  const [selectedCollegeId, setSelectedCollegeId] = useState(colleges[0]?.id ?? "");
  const [adminName,     setAdminName]     = useState("");
  const [adminEmail,    setAdminEmail]    = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [sectorRole,    setSectorRole]    = useState("");
  const [submitting,    setSubmitting]    = useState(false);

  /* Derive the selected college object */
  const selectedCollege = colleges.find((c) => c.id === selectedCollegeId || c.id === Number(selectedCollegeId));

  /* Rebuild available roles whenever the college changes */
  const availableRoles = [];
  if (selectedCollege?.hasHostel)    availableRoles.push({ name: "admin",     label: "Hostel Admin" });
  if (selectedCollege?.hasLibrary)   availableRoles.push({ name: "librarian", label: "Library Admin" });
  if (selectedCollege?.hasInventory) availableRoles.push({ name: "store",     label: "Inventory Admin" });

  /* Auto-select first role when college or its facilities change */
  useEffect(() => {
    if (availableRoles.length > 0 && !availableRoles.find((r) => r.name === sectorRole)) {
      setSectorRole(availableRoles[0].name);
    }
  }, [selectedCollegeId, selectedCollege?.hasHostel, selectedCollege?.hasLibrary, selectedCollege?.hasInventory]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    if (!selectedCollegeId) {
      toast.error("Please select a college");
      return;
    }
    if (availableRoles.length === 0) {
      toast.error("No facilities are enabled for this college. Enable facilities from the Colleges page first.");
      return;
    }

    setSubmitting(true);
    try {
      /* ✅ Same API call as colleges.jsx — goes to the same backend endpoint */
      const res = await collegeApi.addAdmin(selectedCollegeId, {
        name:     adminName.trim(),
        email:    adminEmail.trim(),
        password: adminPassword,
        roleName: sectorRole,
      });

      if (res.success) {
        toast.success(`Admin credentials created for ${selectedCollege?.name}`);
        onCreated();   // refresh the list and close
      } else {
        toast.error(res.message || "Failed to create admin");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to create admin");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-muted/30">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Create Sector Admin Credentials
            </h2>
            <p className="text-xs text-muted-foreground">
              Select a college and assign a sector administrator.
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5 overflow-y-auto">

          {/* College selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Select College</label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {colleges.length === 0 && (
                <option value="">No colleges found</option>
              )}
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.city ? ` — ${c.city}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Enabled facilities indicator */}
          {selectedCollege && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium">Enabled Facilities:</span>
              {selectedCollege.hasHostel && (
                <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-600">
                  <Home className="h-3 w-3" /> Hostel
                </span>
              )}
              {selectedCollege.hasLibrary && (
                <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600">
                  <BookOpen className="h-3 w-3" /> Library
                </span>
              )}
              {selectedCollege.hasInventory && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600">
                  <Package className="h-3 w-3" /> Inventory
                </span>
              )}
              {!selectedCollege.hasHostel && !selectedCollege.hasLibrary && !selectedCollege.hasInventory && (
                <span className="text-xs text-amber-500">⚠ No facilities enabled — enable from Colleges page</span>
              )}
            </div>
          )}

          {/* Credentials form — 2-col grid like colleges modal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Admin Full Name</label>
              <input
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Email / Login Username</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@campusos.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Initial Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Set initial password"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Sector Facility Role</label>
              {availableRoles.length === 0 ? (
                <p className="text-xs text-amber-500 mt-2">No facilities enabled</p>
              ) : (
                <select
                  value={sectorRole}
                  onChange={(e) => setSectorRole(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {availableRoles.map((r) => (
                    <option key={r.name} value={r.name}>{r.label}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Submit row */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || availableRoles.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              {submitting ? "Creating..." : "Create Admin Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { Route };
