import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Users,
  Lock,
  CheckCircle2,
  Check
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
const Route = createFileRoute("/super-admin/roles")({
  component: RolesPage
});
const MODULES = ["Hostel", "Library", "Inventory", "System"];
const ACTIONS = ["view", "create", "edit", "delete"];
function emptyPerms(all = false) {
  return MODULES.reduce((acc, m) => {
    acc[m] = ACTIONS.reduce((a, k) => ({ ...a, [k]: all }), {});
    return acc;
  }, {});
}
const seed = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Full access across every module and campus.",
    users: 3,
    system: true,
    permissions: emptyPerms(true)
  },
  {
    id: "r2",
    name: "Hostel Admin",
    description: "Manage hostels, rooms, students and complaints.",
    users: 76,
    system: false,
    permissions: {
      ...emptyPerms(),
      Hostel: { view: true, create: true, edit: true, delete: true }
    }
  },
  {
    id: "r3",
    name: "Library Admin",
    description: "Manage catalog, circulation and library fines.",
    users: 48,
    system: false,
    permissions: {
      ...emptyPerms(),
      Library: { view: true, create: true, edit: true, delete: false }
    }
  },
  {
    id: "r4",
    name: "Warden",
    description: "Operate hostel workflows without structural edits.",
    users: 22,
    system: false,
    permissions: {
      ...emptyPerms(),
      Hostel: { view: true, create: false, edit: true, delete: false }
    }
  },
  {
    id: "r5",
    name: "Security",
    description: "Gate passes, visitor logs and incident reporting.",
    users: 14,
    system: false,
    permissions: {
      ...emptyPerms(),
      Hostel: { view: true, create: false, edit: false, delete: false }
    }
  },
  {
    id: "r6",
    name: "Student",
    description: "View personal hostel and library information.",
    users: 18472,
    system: true,
    permissions: {
      ...emptyPerms(),
      Hostel: { view: true, create: false, edit: false, delete: false },
      Library: { view: true, create: false, edit: false, delete: false }
    }
  }
];
function permCount(p) {
  return MODULES.reduce(
    (n, m) => n + ACTIONS.reduce((k, a) => k + (p[m][a] ? 1 : 0), 0),
    0
  );
}
function RolesPage() {
  const [roles, setRoles] = useState(seed);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return roles;
    return roles.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }, [roles, query]);
  const totals = useMemo(
    () => ({
      total: roles.length,
      custom: roles.filter((r) => !r.system).length,
      users: roles.reduce((s, r) => s + r.users, 0)
    }),
    [roles]
  );
  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(r) {
    setEditing(r);
    setModalOpen(true);
  }
  function remove(r) {
    if (r.system) return;
    if (confirm(`Delete role "${r.name}"?`)) setRoles((prev) => prev.filter((x) => x.id !== r.id));
  }
  function save(data) {
    if (editing) {
      setRoles(
        (prev) => prev.map((r) => r.id === editing.id ? { ...editing, ...data } : r)
      );
    } else {
      setRoles((prev) => [
        { id: `r${Date.now()}`, users: 0, system: false, ...data },
        ...prev
      ]);
    }
    setModalOpen(false);
  }
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Roles & Permissions" }]} />
          <div className="mt-3 flex items-center gap-3">
            <span
    className="grid h-11 w-11 place-items-center rounded-xl"
    style={{ backgroundColor: "#7B4CED1A", color: "#7B4CED" }}
  >
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Roles & Permissions</h1>
              <p className="text-sm text-slate-500">
                Define system-wide roles and grant module-level permissions.
              </p>
            </div>
          </div>
        </div>
        <button
    onClick={openCreate}
    className="inline-flex items-center gap-2 self-start rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1D4ED8]"
  >
          <Plus className="h-4 w-4" /> New Role
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <KPI label="Total Roles" value={totals.total} icon={ShieldCheck} tint="#7B4CED" />
        <KPI label="Custom Roles" value={totals.custom} icon={Pencil} tint="#2563EB" />
        <KPI label="Assigned Users" value={totals.users} icon={Users} tint="#22C55E" />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search roles..."
    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
  />
        </div>
        <span className="text-xs text-slate-500">
          Showing {filtered.length} of {roles.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((r) => <div
    key={r.id}
    className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#2563EB]/40 hover:shadow-sm"
  >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
    className="grid h-10 w-10 place-items-center rounded-lg"
    style={{ backgroundColor: "#7B4CED1A", color: "#7B4CED" }}
  >
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{r.name}</h3>
                    {r.system && <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                        <Lock className="h-2.5 w-2.5" /> System
                      </span>}
                  </div>
                  <p className="text-xs text-slate-500">{r.users.toLocaleString()} users</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button
    onClick={() => openEdit(r)}
    className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
    aria-label="Edit"
  >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
    onClick={() => remove(r)}
    disabled={r.system}
    className="rounded-md p-2 text-slate-500 transition enabled:hover:bg-red-50 enabled:hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
    aria-label="Delete"
  >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600">{r.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {MODULES.map((m) => {
    const active = ACTIONS.some((a) => r.permissions[m][a]);
    return <span
      key={m}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${active ? "bg-[#22C55E1A] text-[#16A34A]" : "bg-slate-100 text-slate-400"}`}
    >
                    {active && <Check className="h-3 w-3" />}
                    {m}
                  </span>;
  })}
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>{permCount(r.permissions)} permissions granted</span>
              <span className="inline-flex items-center gap-1 text-[#16A34A]">
                <CheckCircle2 className="h-3 w-3" /> Enabled
              </span>
            </div>
          </div>)}
        {filtered.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            No roles match your search.
          </div>}
      </div>

      {modalOpen && <RoleModal initial={editing} onClose={() => setModalOpen(false)} onSave={save} />}
    </div>;
}
function KPI({
  label,
  value,
  icon: Icon,
  tint
}) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{label}</span>
        <span
    className="grid h-8 w-8 place-items-center rounded-lg"
    style={{ backgroundColor: `${tint}1A`, color: tint }}
  >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">
        {value.toLocaleString()}
      </div>
    </div>;
}
function RoleModal({
  initial,
  onClose,
  onSave
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [permissions, setPermissions] = useState(
    initial?.permissions ?? emptyPerms()
  );
  function toggle(m, a) {
    setPermissions((prev) => ({
      ...prev,
      [m]: { ...prev[m], [a]: !prev[m][a] }
    }));
  }
  function toggleRow(m, on) {
    setPermissions((prev) => ({
      ...prev,
      [m]: ACTIONS.reduce((a, k) => ({ ...a, [k]: on }), {})
    }));
  }
  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), permissions });
  }
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <form
    onSubmit={submit}
    className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
  >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {initial ? "Edit Role" : "New Role"}
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
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Role Name</span>
            <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
  />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Description</span>
            <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    rows={2}
    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
  />
          </label>

          <div className="rounded-xl border border-slate-200">
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Module Permissions
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500">
                    <th className="px-4 py-2 font-medium">Module</th>
                    {ACTIONS.map((a) => <th key={a} className="px-3 py-2 text-center font-medium capitalize">
                        {a}
                      </th>)}
                    <th className="px-3 py-2 text-right font-medium">All</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MODULES.map((m) => {
    const allOn = ACTIONS.every((a) => permissions[m][a]);
    return <tr key={m}>
                        <td className="px-4 py-2 font-medium text-slate-700">{m}</td>
                        {ACTIONS.map((a) => <td key={a} className="px-3 py-2 text-center">
                            <input
      type="checkbox"
      checked={permissions[m][a]}
      onChange={() => toggle(m, a)}
      className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
    />
                          </td>)}
                        <td className="px-3 py-2 text-right">
                          <button
      type="button"
      onClick={() => toggleRow(m, !allOn)}
      className="rounded-md px-2 py-1 text-xs font-medium text-[#2563EB] hover:bg-[#2563EB]/10"
    >
                            {allOn ? "Clear" : "All"}
                          </button>
                        </td>
                      </tr>;
  })}
                </tbody>
              </table>
            </div>
          </div>
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
    className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8]"
  >
            {initial ? "Save Changes" : "Create Role"}
          </button>
        </div>
      </form>
    </div>;
}
export {
  Route
};
