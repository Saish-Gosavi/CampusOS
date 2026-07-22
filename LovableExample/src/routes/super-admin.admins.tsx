import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users,
  Plus,
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
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

export const Route = createFileRoute("/super-admin/admins")({
  component: AdminsPage,
});

type Status = "Active" | "Pending" | "Inactive";
type Module = "Hostel" | "Library" | "Inventory";
type Admin = {
  id: string;
  name: string;
  email: string;
  module: Module;
  campus: string;
  status: Status;
};

const seed: Admin[] = [
  { id: "a1", name: "Rahul Sharma", email: "rahul.sharma@vppcoe.edu.in", module: "Hostel", campus: "VPPCOE — Mumbai", status: "Active" },
  { id: "a2", name: "Priya Menon", email: "priya.menon@vppcoe.edu.in", module: "Library", campus: "VPPCOE — Mumbai", status: "Active" },
  { id: "a3", name: "Arjun Iyer", email: "arjun.iyer@nova.edu.in", module: "Inventory", campus: "Nova Institute — Pune", status: "Pending" },
  { id: "a4", name: "Neha Kulkarni", email: "neha.k@meridian.edu.in", module: "Hostel", campus: "Meridian College — Delhi", status: "Active" },
  { id: "a5", name: "Vikram Shetty", email: "vikram.s@aurora.edu.in", module: "Library", campus: "Aurora Tech — Bengaluru", status: "Inactive" },
  { id: "a6", name: "Sanya Kapoor", email: "sanya.k@vppcoe.edu.in", module: "Inventory", campus: "VPPCOE — Mumbai", status: "Active" },
];

const CAMPUSES = [
  "VPPCOE — Mumbai",
  "Nova Institute — Pune",
  "Meridian College — Delhi",
  "Aurora Tech — Bengaluru",
];

const STATUS_META: Record<Status, { bg: string; fg: string; icon: typeof CheckCircle2 }> = {
  Active: { bg: "#22C55E1A", fg: "#16A34A", icon: CheckCircle2 },
  Pending: { bg: "#EAB3081A", fg: "#B45309", icon: Clock },
  Inactive: { bg: "#EF44441A", fg: "#DC2626", icon: XCircle },
};

const MODULE_META: Record<Module, { bg: string; fg: string }> = {
  Hostel: { bg: "#7B4CED1A", fg: "#7B4CED" },
  Library: { bg: "#3B82F61A", fg: "#3B82F6" },
  Inventory: { bg: "#22C55E1A", fg: "#16A34A" },
};

function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>(seed);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [moduleFilter, setModuleFilter] = useState<"All" | Module>("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return admins.filter((a) => {
      const mQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.campus.toLowerCase().includes(q);
      const mS = statusFilter === "All" || a.status === statusFilter;
      const mM = moduleFilter === "All" || a.module === moduleFilter;
      return mQ && mS && mM;
    });
  }, [admins, query, statusFilter, moduleFilter]);

  const counts = useMemo(
    () => ({
      total: admins.length,
      active: admins.filter((a) => a.status === "Active").length,
      pending: admins.filter((a) => a.status === "Pending").length,
      modules: new Set(admins.map((a) => a.module)).size,
    }),
    [admins],
  );

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(a: Admin) {
    setEditing(a);
    setModalOpen(true);
  }
  function remove(id: string) {
    if (confirm("Remove this admin?")) setAdmins((prev) => prev.filter((a) => a.id !== id));
  }
  function save(data: Omit<Admin, "id">) {
    if (editing) {
      setAdmins((prev) => prev.map((a) => (a.id === editing.id ? { ...editing, ...data } : a)));
    } else {
      setAdmins((prev) => [{ id: `a${Date.now()}`, ...data }, ...prev]);
    }
    setModalOpen(false);
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Admin Management" }]} />
          <div className="mt-3 flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{ backgroundColor: "#EAB3081A", color: "#B45309" }}
            >
              <Users className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Admin Management</h1>
              <p className="text-sm text-slate-500">
                Create module admins and assign them to campuses.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#1D4ED8]"
        >
          <Plus className="h-4 w-4" /> Add Admin
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPI label="Total Admins" value={counts.total} icon={UserCog} tint="#2563EB" />
        <KPI label="Active" value={counts.active} icon={CheckCircle2} tint="#22C55E" />
        <KPI label="Pending" value={counts.pending} icon={Clock} tint="#EAB308" />
        <KPI label="Modules Covered" value={counts.modules} icon={Shield} tint="#7B4CED" />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or campus..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-[#2563EB] focus:bg-white"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value as any)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#2563EB]"
          >
            <option value="All">All Modules</option>
            <option value="Hostel">Hostel</option>
            <option value="Library">Library</option>
            <option value="Inventory">Inventory</option>
          </select>
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {(["All", "Active", "Pending", "Inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === s
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Admin</th>
                <th className="px-4 py-3 font-medium">Module</th>
                <th className="px-4 py-3 font-medium">Campus</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => {
                const s = STATUS_META[a.status];
                const m = MODULE_META[a.module];
                const StatusIcon = s.icon;
                return (
                  <tr key={a.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold"
                          style={{ backgroundColor: "#7B4CED", color: "white" }}
                        >
                          {a.name
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")}
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
                        {a.module}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {a.campus}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                        style={{ backgroundColor: s.bg, color: s.fg }}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEdit(a)}
                          className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
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
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                    No admins match your filters.
                  </td>
                </tr>
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

function KPI({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: number;
  icon: typeof CheckCircle2;
  tint: string;
}) {
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

function AdminModal({
  initial,
  onClose,
  onSave,
}: {
  initial: Admin | null;
  onClose: () => void;
  onSave: (data: Omit<Admin, "id">) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [module, setModule] = useState<Module>(initial?.module ?? "Hostel");
  const [campus, setCampus] = useState(initial?.campus ?? CAMPUSES[0]);
  const [status, setStatus] = useState<Status>(initial?.status ?? "Pending");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({ name: name.trim(), email: email.trim(), module, campus, status });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {initial ? "Edit Admin" : "Add Admin"}
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
              required
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Module">
              <select
                value={module}
                onChange={(e) => setModule(e.target.value as Module)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
              >
                <option>Hostel</option>
                <option>Library</option>
                <option>Inventory</option>
              </select>
            </Field>
            <Field label="Status">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8]"
          >
            {initial ? "Save Changes" : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}
