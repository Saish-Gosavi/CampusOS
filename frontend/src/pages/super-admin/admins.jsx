import { createFileRoute } from "@/routes/compat";
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
  Loader2
} from "lucide-react";
import { userApi, rolesApi, collegeApi } from "@/services/api";

const Route = createFileRoute("/super-admin/admins")({
  component: AdminsPage
});



const STATUS_META = {
  Active: { bg: "#22C55E1A", fg: "#16A34A", icon: CheckCircle2 },
  Pending: { bg: "#EAB3081A", fg: "#B45309", icon: Clock },
  Inactive: { bg: "#EF44441A", fg: "#DC2626", icon: XCircle }
};

const MODULE_META = {
  Senioradmin: { bg: "#2563EB1A", fg: "#2563EB", label: "Senior Admin" },
  senioradmin: { bg: "#2563EB1A", fg: "#2563EB", label: "Senior Admin" },
  Superadmin:  { bg: "#EF44441A", fg: "#DC2626", label: "Super Admin"  },
  Admin:       { bg: "#7B4CED1A", fg: "#7B4CED", label: "Sector Admin"  },
  General:     { bg: "#64748B1A", fg: "#64748B", label: "General"       }
};

function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch users with the role 'senioradmin'
      const res = await userApi.getAll("senioradmin");
      const list = Array.isArray(res.data) ? res.data : (Array.isArray(res) ? res : []);
      
      const mapped = list.map((u) => {
        const rawRole = u.role?.name || "Senioradmin";
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
      console.error("Failed to load senior admins:", err);
      setError("Unable to load data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadRolesAndColleges() {
      try {
        const [resRoles, resColleges] = await Promise.all([
          rolesApi.getAll().catch(() => ({ data: [] })),
          collegeApi.getAll().catch(() => ({ data: [] }))
        ]);
        const rolesData = Array.isArray(resRoles.data) ? resRoles.data : (Array.isArray(resRoles) ? resRoles : []);
        setRolesList(rolesData);
        const collegesData = Array.isArray(resColleges.data) ? resColleges.data : (Array.isArray(resColleges) ? resColleges : []);
        setColleges(collegesData);
      } catch (err) {
        console.error("Failed to load roles or colleges:", err);
      }
    }
    loadRolesAndColleges();
    fetchAdmins();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return admins.filter((a) => {
      return !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.campus.toLowerCase().includes(q);
    });
  }, [admins, query]);

  const counts = useMemo(
    () => ({
      total: admins.length,
    }),
    [admins]
  );

  function openEdit(a) {
    setEditing(a);
    setModalOpen(true);
  }

  async function remove(id) {
    if (confirm("Remove this Senior Admin?")) {
      try {
        await userApi.delete(id);
        setAdmins((prev) => prev.filter((a) => a.id !== id));
      } catch (err) {
        console.error("Failed to delete backend user:", err);
      }
    }
  }

  async function save(data) {
    if (editing) {
      setAdmins((prev) => prev.map((a) => a.id === editing.id ? { ...editing, ...data } : a));
      setModalOpen(false);
    } else {
      try {
        // Resolve senioradmin role ID dynamically
        const seniorRole = rolesList.find((r) => r.name.toLowerCase() === "senioradmin");
        const roleId = seniorRole ? seniorRole.id : 2;

        await userApi.create({
          name: data.name,
          email: data.email,
          password: data.password || "Password@123",
          roleId,
          status: "active",
        });

        // ✅ Re-fetch from server so count and list are always accurate
        await fetchAdmins();
        setModalOpen(false);
      } catch (err) {
        console.error("Failed to create senior admin:", err);
        alert(err?.response?.data?.message || "Failed to create Senior Admin.");
      }
    }
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
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Senior Admin Management</h1>
              <p className="text-sm text-slate-500">
                View and manage Senior Administrators. Senior Admins manage individual college/sector admins.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
          >
            Create Senior Admin
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KPI label="Total Senior Admins" value={counts.total} icon={UserCog} tint="#2563EB" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or campus..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Senior Admin</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Campus</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      Loading live data...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-500">
                    {error || "No senior admins match your filters."}
                  </td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const s = STATUS_META[a.status] || STATUS_META.Active;
                  const m = MODULE_META[a.module] || { bg: "#2563EB1A", fg: "#2563EB" };
                  const StatusIcon = s.icon || CheckCircle2;
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
                            className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold"
                            style={{ backgroundColor: "#7B4CED", color: "white" }}
                          >
                            {a.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                          </span>
                          <div>
                            <div className="font-medium text-slate-900">{a.name}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
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
                          {m.label || a.module}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {a.campus}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => remove(a.id)}
                            className="rounded-md p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
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
          colleges={colleges}
        />
      )}
    </div>
  );
}

function KPI({ label, value, icon: Icon, tint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ backgroundColor: `${tint}1A`, color: tint }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function AdminModal({ initial, onClose, onSave, colleges }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [campus, setCampus] = useState(initial?.campus ?? (colleges[0]?.name || ""));

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    if (!initial && !password.trim()) {
      alert("Password is required to create a new Senior Admin");
      return;
    }
    onSave({ name: name.trim(), email: email.trim(), password: password.trim(), campus, status: "Active" });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {initial ? "Edit Senior Admin" : "Create Senior Admin"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <Field label="Full Name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
              required
            />
          </Field>
          {!initial && (
            <Field label="Password">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set login password"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                required
              />
            </Field>
          )}
          <Field label="Campus">
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {colleges.length === 0 ? (
                <option value="">No colleges found</option>
              ) : (
                colleges.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}{c.city ? ` — ${c.city}` : ""}
                  </option>
                ))
              )}
            </select>
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            {initial ? "Save Changes" : "Create Senior Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

export { Route };
