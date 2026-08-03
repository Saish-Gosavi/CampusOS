import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Users,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserPlus,
  TrendingUp,
  ShieldAlert,
  Loader2,
  Boxes,
  ClipboardList,
  AlertCircle,
  Sparkles,
  DollarSign
} from "lucide-react";
import {
  ResponsiveContainer,
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
import { CreateModuleAdminModal } from "./hostel";

const Route = createFileRoute("/senior-admin/inventory")({
  component: InventoryManagementPage
});

const MOCK_INVENTORY_TREND = [
  { month: "Jan", Requisitions: 120, Fulfilled: 110, Restocked: 45 },
  { month: "Feb", Requisitions: 145, Fulfilled: 138, Restocked: 60 },
  { month: "Mar", Requisitions: 160, Fulfilled: 152, Restocked: 80 },
  { month: "Apr", Requisitions: 185, Fulfilled: 175, Restocked: 95 },
  { month: "May", Requisitions: 210, Fulfilled: 200, Restocked: 110 },
  { month: "Jun", Requisitions: 240, Fulfilled: 228, Restocked: 130 }
];

const MOCK_ITEMS = [
  { sku: "SKU-ENG-001", name: "Dell Latitude Laptops (i7)", category: "Electronics", inStock: 42, unitVal: "$850", status: "In Stock", supplier: "Dell Commercial India" },
  { sku: "SKU-LAB-045", name: "Digital Oscilloscopes (50MHz)", category: "Lab Equipment", inStock: 5, unitVal: "$420", status: "Low Stock", supplier: "Tektronix Equipment" },
  { sku: "SKU-OFF-102", name: "Ergonomic Mesh Chairs", category: "Furniture", inStock: 85, unitVal: "$120", status: "In Stock", supplier: "Godrej Interio" },
  { sku: "SKU-STN-220", name: "A4 White Paper Reams (500s)", category: "Stationery", inStock: 0, unitVal: "$6", status: "Out of Stock", supplier: "PaperOne Supplies" },
  { sku: "SKU-IT-089", name: "Cisco Gigabit Switches (24-Port)", category: "Networking", inStock: 14, unitVal: "$340", status: "In Stock", supplier: "Cisco Systems" },
];

function InventoryManagementPage() {
  const [loading, setLoading] = useState(true);
  const [storeAdmin, setStoreAdmin] = useState(null);
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

      // Find dedicated Store / Inventory Admin (role name 'store' or 'inventory')
      const adminFound = usersList.find((u) => {
        const rName = (u.role?.name || "").toLowerCase();
        return rName === "store" || rName === "inventory";
      });

      setStoreAdmin(adminFound || null);
    } catch (err) {
      console.error("Error loading Inventory Management data:", err);
      toast.error("Failed to load inventory configuration data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_ITEMS.filter((i) => {
      const matchQ = !q || i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
      const matchS = statusFilter === "All" || i.status.toLowerCase() === statusFilter.toLowerCase();
      return matchQ && matchS;
    });
  }, [query, statusFilter]);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium">Checking Inventory Admin status...</span>
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
            style={{ backgroundColor: "#22C55E1A", color: "#16A34A" }}
          >
            <Package className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory Management</h1>
              {storeAdmin ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Store Manager Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Admin Not Created
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Track stock levels, asset requisitions, vendor orders, and warehouse inventory.
            </p>
          </div>
        </div>

        {storeAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #16A34A, #15803D)" }}
          >
            <Plus className="h-4 w-4" />
            Assign Additional Store Admin
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CASE 1: ADMIN NOT CREATED WARNING & ASSIGNMENT CALLOUT        */}
      {/* ------------------------------------------------------------- */}
      {!storeAdmin ? (
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-card to-card p-8 shadow-xl">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-4 max-w-2xl">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 shadow-inner">
                <ShieldAlert className="h-9 w-9" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                  Action Required
                </div>
                <h2 className="text-2xl font-bold text-foreground">Inventory Admin Account Missing</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  No administrator has been assigned for <strong>Inventory Management</strong>. Asset tracking, stock audit reports, low-stock warnings, and purchase order data are hidden until an Inventory/Store Admin is created.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #16A34A, #15803D)" }}
                >
                  <UserPlus className="h-5 w-5" />
                  Create Inventory Admin
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 rounded-xl border border-border bg-card/60 p-5 backdrop-blur shadow-sm flex flex-col gap-3 text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                Unlocks On Admin Assignment:
              </span>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Real-time SKU & stock level tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Department asset requisitions & approvals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automatic low-stock & reorder alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Supplier purchase order & valuation logs
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
                style={{ backgroundColor: "#16A34A" }}
              >
                {storeAdmin.name ? storeAdmin.name.substring(0, 2).toUpperCase() : "SA"}
              </span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Inventory Administrator</p>
                <p className="text-base font-bold text-foreground">{storeAdmin.name || "Assigned Store Manager"}</p>
                <p className="text-xs text-muted-foreground">{storeAdmin.email} • {storeAdmin.college?.name || "Campus OS Central Store"}</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Store Session
            </span>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI label="Total Stock Items" value="2,840" subtitle="Across 42 SKUs" icon={Boxes} tint="#16A34A" />
            <KPI label="Active Requisitions" value="18" subtitle="Pending fulfillment" icon={ClipboardList} tint="#2563EB" />
            <KPI label="Low Stock Alerts" value="5 Items" subtitle="Requires reorder" icon={AlertCircle} tint="#EAB308" />
            <KPI label="Total Asset Value" value="$48,500" subtitle="Audited this quarter" icon={DollarSign} tint="#7B4CED" />
          </div>

          {/* Analytics Chart */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Stock Movement & Requisition Fulfilment
                  </h3>
                  <p className="text-xs text-muted-foreground font-sans">Monthly item requests vs warehouse restock volume</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_INVENTORY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Requisitions" fill="#2563EB" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Fulfilled" fill="#16A34A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Restocked" fill="#7B4CED" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Warehouse Allocation Breakdown */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Asset Category Distribution</h3>
                <p className="text-xs text-muted-foreground mb-4">Inventory value share by category</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Electronics & IT Hardware</span>
                      <span className="text-emerald-600">54%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "54%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Lab Instruments</span>
                      <span className="text-blue-600">26%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "26%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Furniture & Fixtures</span>
                      <span className="text-amber-600">20%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border">
                <span className="font-semibold text-foreground">Alert:</span> 5 items are below reorder threshold. Generate purchase order.
              </div>
            </div>
          </div>

          {/* Asset & Item Records Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between border-b border-border">
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search SKU, item name, category..."
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="All">All Item Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">SKU Code</th>
                    <th className="px-4 py-3 font-medium">Item Name & Category</th>
                    <th className="px-4 py-3 font-medium">In-Stock Qty</th>
                    <th className="px-4 py-3 font-medium">Unit Value</th>
                    <th className="px-4 py-3 font-medium">Supplier</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {filteredItems.map((i) => (
                    <tr key={i.sku} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{i.sku}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-foreground">{i.name}</div>
                        <div className="text-xs text-muted-foreground">{i.category}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-foreground">{i.inStock} Units</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{i.unitVal}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{i.supplier}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            i.status === "In Stock"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : i.status === "Low Stock"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {i.status}
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
          targetRole="store"
          roleLabel="Inventory Admin"
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

export { Route };
