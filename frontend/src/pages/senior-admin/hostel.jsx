import { createFileRoute } from "@/routes/compat";
import { useEffect, useMemo, useState } from "react";
import {
  Home,
  Users,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserPlus,
  KeyRound,
  X,
  Building2,
  TrendingUp,
  BarChart2,
  FileText,
  ShieldAlert,
  Loader2,
  Bed,
  Wrench,
  Sparkles
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { toast } from "sonner";
import { userApi, collegeApi } from "@/services/api";

const Route = createFileRoute("/senior-admin/hostel")({
  component: HostelManagementPage
});

const MOCK_OCCUPANCY_TREND = [
  { month: "Jan", Occupied: 320, Vacant: 80, Maintenance: 12 },
  { month: "Feb", Occupied: 340, Vacant: 60, Maintenance: 10 },
  { month: "Mar", Occupied: 355, Vacant: 45, Maintenance: 8 },
  { month: "Apr", Occupied: 368, Vacant: 32, Maintenance: 14 },
  { month: "May", Occupied: 375, Vacant: 25, Maintenance: 6 },
  { month: "Jun", Occupied: 384, Vacant: 16, Maintenance: 6 }
];

const MOCK_ROOMS = [
  { id: "A-101", wing: "Wing A", type: "Double Sharing", capacity: 2, occupied: 2, status: "Occupied", resident: "Aarav Sharma & Rohan Verma" },
  { id: "A-102", wing: "Wing A", type: "Single Deluxe", capacity: 1, occupied: 1, status: "Occupied", resident: "Priya Patel" },
  { id: "A-103", wing: "Wing A", type: "Triple Sharing", capacity: 3, occupied: 2, status: "Available", resident: "Kabir Mehta, Vikram Singh" },
  { id: "B-201", wing: "Wing B", type: "Double Sharing", capacity: 2, occupied: 0, status: "Maintenance", resident: "— (Plumbing Work)" },
  { id: "B-202", wing: "Wing B", type: "Single Deluxe", capacity: 1, occupied: 1, status: "Occupied", resident: "Neha Gupta" },
  { id: "C-301", wing: "Wing C", type: "Triple Sharing", capacity: 3, occupied: 3, status: "Occupied", resident: "Aditya, Siddharth, Harsh" },
];

function HostelManagementPage() {
  const [loading, setLoading] = useState(true);
  const [hostelAdmin, setHostelAdmin] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadData = async () => {
    try {
      setLoading(true);
      const [userRes, collegeRes] = await Promise.all([
        userApi.getAll(),
        collegeApi.getAll()
      ]);

      const usersList = Array.isArray(userRes.data) ? userRes.data : (Array.isArray(userRes) ? userRes : []);
      if (collegeRes.success && collegeRes.data) {
        setColleges(collegeRes.data);
      }

      // Find dedicated Hostel Admin (role name 'admin' or 'hostel')
      const adminFound = usersList.find((u) => {
        const rName = (u.role?.name || "").toLowerCase();
        return rName === "admin" || rName === "hostel";
      });

      setHostelAdmin(adminFound || null);
    } catch (err) {
      console.error("Error loading Hostel Management data:", err);
      toast.error("Failed to load hostel configuration data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRooms = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_ROOMS.filter((r) => {
      const matchQ = !q || r.id.toLowerCase().includes(q) || r.wing.toLowerCase().includes(q) || r.resident.toLowerCase().includes(q);
      const matchS = statusFilter === "All" || r.status.toLowerCase() === statusFilter.toLowerCase();
      return matchQ && matchS;
    });
  }, [query, statusFilter]);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium">Checking Hostel Admin status...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="grid h-12 w-12 place-items-center rounded-xl shadow-sm"
            style={{ backgroundColor: "#7B4CED1A", color: "#7B4CED" }}
          >
            <Home className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Hostel Management</h1>
              {hostelAdmin ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Admin Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Admin Not Created
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Monitor campus housing allocations, resident capacity, and room maintenance status.
            </p>
          </div>
        </div>

        {hostelAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #7B4CED, #5B33CC)" }}
          >
            <Plus className="h-4 w-4" />
            Assign Additional Admin
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CASE 1: ADMIN NOT CREATED WARNING & ASSIGNMENT CALLOUT        */}
      {/* ------------------------------------------------------------- */}
      {!hostelAdmin ? (
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-card to-card p-8 shadow-xl">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-4 max-w-2xl">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/15 text-amber-600 shadow-inner">
                <ShieldAlert className="h-9 w-9" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                  Action Required
                </div>
                <h2 className="text-2xl font-bold text-foreground">Hostel Admin Account Missing</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  No administrator has been assigned for <strong>Hostel Management</strong>. Detailed reports, occupancy analytics, room block controls, and maintenance data remain hidden until a dedicated Hostel Admin account is created.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #7B4CED, #5B33CC)" }}
                >
                  <UserPlus className="h-5 w-5" />
                  Create Hostel Admin
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 rounded-xl border border-border bg-card/60 p-5 backdrop-blur shadow-sm flex flex-col gap-3 text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Unlocks On Admin Assignment:
              </span>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Real-time room occupancy analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Student room allocation & wing management
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Maintenance & complaint resolution tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automated billing & pass generation
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------- */
        /* CASE 2: ADMIN HAS BEEN CREATED — DISPLAY DASHBOARD & REPORTS  */
        /* ------------------------------------------------------------- */
        <>
          {/* Active Admin Banner */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span
                className="grid h-10 w-10 place-items-center rounded-full font-bold text-white text-sm"
                style={{ backgroundColor: "#7B4CED" }}
              >
                {hostelAdmin.name ? hostelAdmin.name.substring(0, 2).toUpperCase() : "HA"}
              </span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Hostel Administrator</p>
                <p className="text-base font-bold text-foreground">{hostelAdmin.name || "Assigned Admin"}</p>
                <p className="text-xs text-muted-foreground">{hostelAdmin.email} • {hostelAdmin.college?.name || "Campus OS Sector"}</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Active System Session
            </span>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI label="Total Rooms" value="148" subtitle="Across 3 Wings" icon={Bed} tint="#7B4CED" />
            <KPI label="Active Occupants" value="384" subtitle="88.5% Capacity" icon={Users} tint="#2563EB" />
            <KPI label="Vacant Capacity" value="16" subtitle="Ready for allocation" icon={Home} tint="#22C55E" />
            <KPI label="Pending Maintenance" value="6" subtitle="Work orders open" icon={Wrench} tint="#EAB308" />
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Hostel Occupancy & Maintenance Trend
                  </h3>
                  <p className="text-xs text-muted-foreground">Monthly stats of resident headcount vs vacant slots</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_OCCUPANCY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7B4CED" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7B4CED" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Area type="monotone" dataKey="Occupied" stroke="#7B4CED" fillOpacity={1} fill="url(#colorOcc)" strokeWidth={2} />
                    <Bar dataKey="Vacant" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Hostel Status Overview</h3>
                <p className="text-xs text-muted-foreground mb-4">Key indicators for current semester</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Wing A Occupancy</span>
                      <span className="text-emerald-600">94%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Wing B Occupancy</span>
                      <span className="text-blue-600">82%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "82%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Wing C Occupancy</span>
                      <span className="text-purple-600">90%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "90%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border">
                <span className="font-semibold text-foreground">System Note:</span> Maintenance check scheduled for Wing B plumbing on Friday.
              </div>
            </div>
          </div>

          {/* Rooms & Resident Records Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between border-b border-border">
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search room ID, wing, resident..."
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="All">All Room Statuses</option>
                <option value="Occupied">Occupied</option>
                <option value="Available">Available</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Room ID</th>
                    <th className="px-4 py-3 font-medium">Wing & Type</th>
                    <th className="px-4 py-3 font-medium">Capacity</th>
                    <th className="px-4 py-3 font-medium">Assigned Residents</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {filteredRooms.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-bold text-foreground">{r.id}</td>
                      <td className="px-4 py-3 text-xs">
                        <span className="font-semibold text-foreground">{r.wing}</span> • {r.type}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {r.occupied} / {r.capacity} Seats
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{r.resident}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            r.status === "Occupied"
                              ? "bg-purple-500/10 text-purple-600"
                              : r.status === "Available"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal for Admin Creation */}
      {modalOpen && (
        <CreateModuleAdminModal
          colleges={colleges}
          targetRole="admin"
          roleLabel="Hostel Admin"
          onClose={() => setModalOpen(false)}
          onCreated={() => {
            setModalOpen(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}

function KPI({ label, value, subtitle, icon: Icon, tint }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span
          className="grid h-8 w-8 place-items-center rounded-lg"
          style={{ backgroundColor: `${tint}1A`, color: tint }}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function CreateModuleAdminModal({ colleges, targetRole, roleLabel, onClose, onCreated }) {
  const [selectedCollegeId, setSelectedCollegeId] = useState(colleges[0]?.id ?? "");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedCollege = colleges.find((c) => c.id === selectedCollegeId || c.id === Number(selectedCollegeId));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!selectedCollegeId) {
      toast.error("Please select a college");
      return;
    }

    setSubmitting(true);
    try {
      const res = await collegeApi.addAdmin(selectedCollegeId, {
        name: adminName.trim(),
        email: adminEmail.trim(),
        password: adminPassword,
        roleName: targetRole,
      });

      if (res.success) {
        toast.success(`${roleLabel} created successfully for ${selectedCollege?.name || "Campus"}`);
        onCreated();
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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4 bg-muted/30">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Assign {roleLabel}
            </h2>
            <p className="text-xs text-muted-foreground">Configure administrator credentials for this sector module.</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Target Campus / College</label>
            <select
              value={selectedCollegeId}
              onChange={(e) => setSelectedCollegeId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {colleges.length === 0 && <option value="">No colleges registered</option>}
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.city ? `— ${c.city}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Admin Full Name</label>
              <input
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Email / Login ID</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@campus.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Initial Password</label>
            <input
              type="password"
              required
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Set strong password"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              <KeyRound className="h-4 w-4" />
              {submitting ? "Creating..." : "Confirm & Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { Route };
