import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Pencil,
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
  Plus
} from "lucide-react";
import { userApi, rolesApi } from "@/services/api";

const Route = createFileRoute("/senior-admin/admins")({
  component: AdminsPage
});

const CAMPUSES = [
  "VPPCOE — Mumbai",
  "Nova Institute — Pune",
  "Meridian College — Delhi",
  "Aurora Tech — Bengaluru"
];

const STATUS_META = {
  Active: { bg: "#22C55E1A", fg: "#16A34A", icon: CheckCircle2 },
  Pending: { bg: "#EAB3081A", fg: "#B45309", icon: Clock },
  Inactive: { bg: "#EF44441A", fg: "#DC2626", icon: XCircle }
};

const MODULE_META = {
  Hostel: { bg: "#7B4CED1A", fg: "#7B4CED" },
  Library: { bg: "#3B82F61A", fg: "#3B82F6" },
  Inventory: { bg: "#22C55E1A", fg: "#16A34A" },
  Admin: { bg: "#7B4CED1A", fg: "#7B4CED" },
  Librarian: { bg: "#3B82F61A", fg: "#3B82F6" },
  Store: { bg: "#22C55E1A", fg: "#16A34A" },
  General: { bg: "#64748B1A", fg: "#64748B" }
};

function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch all users. The backend logic automatically limits Senior Admins to see only standard Admins
      const res = await userApi.getAll();
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      
      const mapped = list.map((u) => {
        const rawRole = u.role?.name || "General";
        const formattedRole = rawRole.charAt(0).toUpperCase() + rawRole.slice(1);
        const rawStatus = u.status || "Active";
        const formattedStatus = rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase();

        return {
          id: u.id,
          name: u.name || u.email?.split("@")[0] || "User",
          email: u.email || "",
          module: formattedRole,
          campus: u.campus || "VPPCOE — Mumbai",
          status: formattedStatus,
          raw: u,
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

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await rolesApi.getAll();
        const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
        setRolesList(list);
      } catch (err) {
        console.error("Failed to load roles:", err);
      }
    }
    loadRoles();
    fetchAdmins();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return admins.filter((a) => {
      const mQ = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.campus.toLowerCase().includes(q);
      const mM = moduleFilter === "All" || a.module.toLowerCase() === moduleFilter.toLowerCase();
      return mQ && mM;
    });
  }, [admins, query, moduleFilter]);

  const counts = useMemo(
    () => ({
      total: admins.length,
      modules: new Set(admins.map((a) => a.module)).size
    }),
    [admins]
  );

  function openEdit(a) {
    setEditing(a);
    setModalOpen(true);
  }

  async function remove(id) {
    if (confirm("Remove this sector admin?")) {
      try {
        await userApi.delete(id);
        setAdmins((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Failed to delete admin:", err);
        toast.error("Failed to delete admin credentials.");
      }
    }
  }

  async function save(data) {
    if (editing) {
      setAdmins((prev) => prev.map((a) => a.id === editing.id ? { ...editing, ...data } : a));
    } else {
      try {
        // Look up standard admin role ID dynamically
        const adminRole = rolesList.find(r => r.name.toLowerCase() === data.module.toLowerCase()) || 
                          rolesList.find(r => r.name.toLowerCase() === "admin");
        const roleId = adminRole ? adminRole.id : 3;

        const res = await userApi.create({
          name: data.name,
          email: data.email,
          password: "Password@123",
          roleId,
          status: data.status.toLowerCase(),
        });
        const created = res.data || res;
        setAdmins((prev) => [{
          id: created.id || `a${Date.now()}`,
          name: created.name || data.name,
          email: created.email || data.email,
          module: data.module,
          campus: data.campus,
          status: data.status,
        }, ...prev]);
      } catch (err) {
        console.error("Failed to create admin:", err);
      }
    }
    setModalOpen(false);
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
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
            onClick={() => { setEditing(null); setModalOpen(true); }}
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
        <KPI label="Total Admins" value={counts.total} icon={UserCog} tint="#2563EB" />
        <KPI label="Modules Covered" value={counts.modules} icon={Shield} tint="#7B4CED" />
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
            <option value="Admin">Hostel</option>
            <option value="Librarian">Library</option>
            <option value="Store">Inventory</option>
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
                  const s = STATUS_META[a.status] || STATUS_META.Active;
                  const m = MODULE_META[a.module] || { bg: "#64748B1A", fg: "#64748B" };
                  const StatusIcon = s.icon || CheckCircle2;
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
                          {a.module}
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

      {modalOpen && (
        <AdminModal
          initial={editing}
          onClose={() => setModalOpen(false)}
          onSave={save}
        />
      )}
    </div>
  );
}

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

function AdminModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [module, setModule] = useState(initial?.module ?? "Admin");
  const [campus, setCampus] = useState(initial?.campus ?? CAMPUSES[0]);
  const [status, setStatus] = useState(initial?.status ?? "Pending");

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({ name: name.trim(), email: email.trim(), module, campus, status });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {initial ? "Edit Admin" : "Add Admin"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Field label="Full Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Module">
              <select
                value={module}
                onChange={(e) => setModule(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="Admin">Hostel</option>
                <option value="Librarian">Library</option>
                <option value="Store">Inventory</option>
              </select>
            </Field>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
            </Field>
          </div>
          <Field label="Campus">
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {CAMPUSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            {initial ? "Save Changes" : "Create Admin"}
          </button>
        </div>
      </form>
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
