import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
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
  Check,
  Loader2
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { rolesApi } from "@/services/api";
import { useNotifications } from "@/context/NotificationContext";

const Route = createFileRoute("/super-admin/roles")({
  component: RolesPage
});

function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { addNotification } = useNotifications();

  // Load roles and available permissions from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        rolesApi.getAll(),
        rolesApi.getPermissions()
      ]);

      setRoles(rolesRes.data || rolesRes || []);
      setAvailablePermissions(permsRes.data || permsRes || []);
    } catch (err) {
      console.error("Failed to load roles/permissions", err);
      addNotification(err.message || "Failed to load roles and permissions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return roles;
    return roles.filter(
      (r) => r.name?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)
    );
  }, [roles, query]);

  const totals = useMemo(
    () => ({
      total: roles.length,
      custom: roles.filter((r) => r.name?.toLowerCase() !== "superadmin").length,
      permissions: availablePermissions.length
    }),
    [roles, availablePermissions]
  );

  function openCreate() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(r) {
    setEditing(r);
    setModalOpen(true);
  }

  async function remove(r) {
    if (r.name?.toLowerCase() === "superadmin") {
      addNotification("Cannot delete the superadmin role", "error");
      return;
    }
    if (!confirm(`Delete role "${r.name}"?`)) return;

    try {
      await rolesApi.delete(r.id);
      addNotification(`Role "${r.name}" deleted successfully`, "success");
      fetchData();
    } catch (err) {
      console.error("Failed to delete role", err);
      addNotification(err.message || "Failed to delete role", "error");
    }
  }

  async function save(data) {
    setActionLoading(true);
    try {
      if (editing) {
        await rolesApi.update(editing.id, data);
        addNotification(`Role "${data.name}" updated successfully`, "success");
      } else {
        await rolesApi.create(data);
        addNotification(`Role "${data.name}" created successfully`, "success");
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Failed to save role", err);
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        err.data.errors.forEach((e) => addNotification(`${e.field}: ${e.message}`, "error"));
      } else {
        addNotification(err.message || "Failed to save role", "error");
      }
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
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
        <KPI label="Available Permissions" value={totals.permissions} icon={Lock} tint="#22C55E" />
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

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const isSystemRole = r.name?.toLowerCase() === "superadmin";
            const rolePerms = r.permissions || [];
            return (
              <div
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
                        {isSystemRole && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
                            <Lock className="h-2.5 w-2.5" /> System
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{rolePerms.length} permissions assigned</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEdit(r)}
                      disabled={isSystemRole}
                      className="rounded-md p-2 text-slate-500 transition enabled:hover:bg-slate-100 enabled:hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(r)}
                      disabled={isSystemRole}
                      className="rounded-md p-2 text-slate-500 transition enabled:hover:bg-red-50 enabled:hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">{r.description || "No description provided."}</p>
                <div className="flex flex-wrap gap-1.5">
                  {rolePerms.slice(0, 6).map((rp) => (
                    <span
                      key={rp.permissionId || rp.permission?.id}
                      className="inline-flex items-center gap-1 rounded-full bg-[#22C55E1A] px-2.5 py-1 text-xs font-medium text-[#16A34A]"
                    >
                      <Check className="h-3 w-3" />
                      {rp.permission?.name || `Perm #${rp.permissionId}`}
                    </span>
                  ))}
                  {rolePerms.length > 6 && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      +{rolePerms.length - 6} more
                    </span>
                  )}
                  {rolePerms.length === 0 && (
                    <span className="text-xs italic text-slate-400">No permissions assigned</span>
                  )}
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>ID: {r.id}</span>
                  <span className="inline-flex items-center gap-1 text-[#16A34A]">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              No roles match your search.
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <RoleModal
          initial={editing}
          availablePermissions={availablePermissions}
          actionLoading={actionLoading}
          onClose={() => setModalOpen(false)}
          onSave={save}
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
      <div className="mt-2 text-2xl font-semibold text-slate-900">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function RoleModal({ initial, availablePermissions = [], actionLoading, onClose, onSave }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");

  // Initialize selected permission IDs
  const initialPermIds = useMemo(() => {
    if (!initial || !initial.permissions) return [];
    return initial.permissions.map((rp) => rp.permissionId || rp.permission?.id).filter(Boolean);
  }, [initial]);

  const [selectedPermIds, setSelectedPermIds] = useState(initialPermIds);

  function togglePerm(id) {
    setSelectedPermIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  }

  function toggleAll() {
    if (selectedPermIds.length === availablePermissions.length) {
      setSelectedPermIds([]);
    } else {
      setSelectedPermIds(availablePermissions.map((p) => p.id));
    }
  }

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim(),
      permissionIds: selectedPermIds
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 overflow-y-auto">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl my-8 max-h-[90vh] flex flex-col"
      >
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
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

        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Role Name *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hostel Manager"
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-600">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief role description..."
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#2563EB]"
            />
          </label>

          <div className="rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span>Permissions Checklist ({selectedPermIds.length}/{availablePermissions.length})</span>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs font-medium text-[#2563EB] hover:underline normal-case"
              >
                {selectedPermIds.length === availablePermissions.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto p-3">
              {availablePermissions.length === 0 ? (
                <p className="text-xs text-slate-400 p-2 text-center">No permissions loaded.</p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {availablePermissions.map((perm) => {
                    const checked = selectedPermIds.includes(perm.id);
                    return (
                      <label
                        key={perm.id}
                        className={`flex items-start gap-2.5 rounded-lg border p-2.5 transition cursor-pointer ${
                          checked
                            ? "border-[#2563EB] bg-[#2563EB]/5"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePerm(perm.id)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-slate-800">{perm.name}</span>
                          {perm.description && (
                            <span className="text-[11px] text-slate-500">{perm.description}</span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={actionLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-50"
          >
            {actionLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {initial ? "Save Changes" : "Create Role"}
          </button>
        </div>
      </form>
    </div>
  );
}

export { Route };
