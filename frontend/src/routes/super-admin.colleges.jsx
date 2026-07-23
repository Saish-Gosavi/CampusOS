import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
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
  XCircle
} from "lucide-react";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { recentColleges } from "@/lib/admin-data";
const Route = createFileRoute("/super-admin/colleges")({
  component: CollegesPage
});
const seed = recentColleges.map((c, i) => ({
  id: `c${i + 1}`,
  name: c.name,
  city: c.city,
  students: c.students,
  status: c.status
}));
const STATUS_META = {
  Active: { bg: "#22C55E1A", fg: "#16A34A", icon: CheckCircle2 },
  Pending: { bg: "#EAB3081A", fg: "#B45309", icon: Clock },
  Inactive: { bg: "#EF44441A", fg: "#DC2626", icon: XCircle }
};
function CollegesPage() {
  const [colleges, setColleges] = useState(seed);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
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
    setModalOpen(true);
  }
  function openEdit(c) {
    setEditing(c);
    setModalOpen(true);
  }
  function remove(id) {
    if (confirm("Delete this college?")) setColleges((prev) => prev.filter((c) => c.id !== id));
  }
  function save(data) {
    if (editing) {
      setColleges((prev) => prev.map((c) => c.id === editing.id ? { ...editing, ...data } : c));
    } else {
      setColleges((prev) => [{ id: `c${Date.now()}`, ...data }, ...prev]);
    }
    setModalOpen(false);
  }
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
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
                Create, review, and manage every college on the platform.
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

      {
    /* KPIs */
  }
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
    { label: "Total Colleges", value: counts.total, tint: "#2563EB", icon: Building2 },
    { label: "Active", value: counts.active, tint: "#22C55E", icon: CheckCircle2 },
    { label: "Pending", value: counts.pending, tint: "#EAB308", icon: Clock },
    { label: "Total Students", value: counts.students.toLocaleString(), tint: "#7B4CED", icon: Users }
  ].map((k) => <div key={k.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
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
          </div>)}
      </div>

      {
    /* Toolbar */
  }
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
          {["All", "Active", "Pending", "Inactive"].map((s) => <button
    key={s}
    onClick={() => setStatusFilter(s)}
    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${statusFilter === s ? "bg-[#2563EB] text-white" : "text-muted-foreground hover:bg-muted"}`}
  >
              {s}
            </button>)}
        </div>
      </div>

      {
    /* Table */
  }
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">College</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Students</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No colleges match your filters.
                  </td>
                </tr> : filtered.map((c) => {
    const meta = STATUS_META[c.status];
    return <tr key={c.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg font-semibold"
      style={{ backgroundColor: "#2563EB1A", color: "#2563EB" }}
    >
                            {c.name.charAt(0)}
                          </span>
                          <span className="font-medium text-foreground">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {c.city}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{c.students.toLocaleString()}</td>
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
      onClick={() => openEdit(c)}
      className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
      title="Edit"
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
                    </tr>;
  })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && <CollegeModal
    initial={editing}
    onClose={() => setModalOpen(false)}
    onSave={save}
  />}
    </div>;
}
function CollegeModal({
  initial,
  onClose,
  onSave
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [students, setStudents] = useState(initial?.students ?? 0);
  const [status, setStatus] = useState(initial?.status ?? "Active");
  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;
    onSave({ name: name.trim(), city: city.trim(), students: Number(students) || 0, status });
  }
  return <div
    className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
    onClick={onClose}
  >
      <div
    className="w-full max-w-md rounded-xl border border-border bg-card shadow-2xl"
    onClick={(e) => e.stopPropagation()}
  >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {initial ? "Edit College" : "Add College"}
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
          <Field label="Students">
            <input
    type="number"
    min={0}
    value={students}
    onChange={(e) => setStudents(Number(e.target.value))}
    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
  />
          </Field>
          <Field label="Status">
            <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
  >
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
          </Field>
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
    className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#1D4ED8]"
  >
              {initial ? "Save Changes" : "Create College"}
            </button>
          </div>
        </form>
      </div>
    </div>;
}
function Field({ label, children }) {
  return <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>;
}
export {
  Route
};
