import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
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
  Book,
  FileCheck,
  Bookmark,
  Sparkles
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

const Route = createFileRoute("/senior-admin/library")({
  component: LibraryManagementPage
});

const MOCK_LIBRARY_TREND = [
  { month: "Jan", Checkouts: 420, Returns: 390, DigitalReads: 1100 },
  { month: "Feb", Checkouts: 580, Returns: 510, DigitalReads: 1450 },
  { month: "Mar", Checkouts: 640, Returns: 610, DigitalReads: 1800 },
  { month: "Apr", Checkouts: 720, Returns: 680, DigitalReads: 2100 },
  { month: "May", Checkouts: 810, Returns: 790, DigitalReads: 2400 },
  { month: "Jun", Checkouts: 890, Returns: 850, DigitalReads: 2850 }
];

const MOCK_BOOKS = [
  { isbn: "978-0131103627", title: "The C Programming Language", author: "Kernighan & Ritchie", category: "Computer Science", totalQty: 45, issued: 38, status: "Available" },
  { isbn: "978-0262033848", title: "Introduction to Algorithms", author: "Cormen, Leiserson", category: "Algorithms", totalQty: 60, issued: 56, status: "High Demand" },
  { isbn: "978-0134685991", title: "Effective Java (3rd Ed)", author: "Joshua Bloch", category: "Software Eng", totalQty: 30, issued: 30, status: "Out of Stock" },
  { isbn: "978-0132350884", title: "Clean Code", author: "Robert C. Martin", category: "Software Eng", totalQty: 50, issued: 42, status: "Available" },
  { isbn: "978-0596007126", title: "Head First Design Patterns", author: "Eric Freeman", category: "Software Eng", totalQty: 40, issued: 25, status: "Available" },
];

function LibraryManagementPage() {
  const [loading, setLoading] = useState(true);
  const [libraryAdmin, setLibraryAdmin] = useState(null);
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

      // Find dedicated Library Admin (role name 'librarian' or 'library')
      const adminFound = usersList.find((u) => {
        const rName = (u.role?.name || "").toLowerCase();
        return rName === "librarian" || rName === "library";
      });

      setLibraryAdmin(adminFound || null);
    } catch (err) {
      console.error("Error loading Library Management data:", err);
      toast.error("Failed to load library configuration data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBooks = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_BOOKS.filter((b) => {
      const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
      const matchS = statusFilter === "All" || b.status.toLowerCase() === statusFilter.toLowerCase();
      return matchQ && matchS;
    });
  }, [query, statusFilter]);

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium">Checking Library Admin status...</span>
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
            style={{ backgroundColor: "#3B82F61A", color: "#3B82F6" }}
          >
            <BookOpen className="h-6 w-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Library Management</h1>
              {libraryAdmin ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Librarian Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 border border-amber-500/20">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Admin Not Created
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Oversee library catalog, book issues, digital e-resources, and circulation analytics.
            </p>
          </div>
        </div>

        {libraryAdmin && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #3B82F6, #1D4ED8)" }}
          >
            <Plus className="h-4 w-4" />
            Assign Additional Librarian
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CASE 1: ADMIN NOT CREATED WARNING & ASSIGNMENT CALLOUT        */}
      {/* ------------------------------------------------------------- */}
      {!libraryAdmin ? (
        <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/5 via-card to-card p-8 shadow-xl">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-4 max-w-2xl">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-500/15 text-blue-600 shadow-inner">
                <ShieldAlert className="h-9 w-9" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                  Action Required
                </div>
                <h2 className="text-2xl font-bold text-foreground">Library Admin Account Missing</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  No dedicated administrator has been assigned for <strong>Library Management</strong>. Book circulation reports, catalog statistics, digital download metrics, and overdue tracking are hidden until a Library Admin is created.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #3B82F6, #1D4ED8)" }}
                >
                  <UserPlus className="h-5 w-5" />
                  Create Library Admin
                </button>
              </div>
            </div>

            <div className="w-full md:w-80 rounded-xl border border-border bg-card/60 p-5 backdrop-blur shadow-sm flex flex-col gap-3 text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-500" />
                Unlocks On Admin Assignment:
              </span>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Complete library catalog & ISBN tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Automated book checkout & return logs
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Overdue fine calculation & student alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> E-journal & digital resource portal analytics
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
                style={{ backgroundColor: "#3B82F6" }}
              >
                {libraryAdmin.name ? libraryAdmin.name.substring(0, 2).toUpperCase() : "LA"}
              </span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Library Administrator</p>
                <p className="text-base font-bold text-foreground">{libraryAdmin.name || "Assigned Librarian"}</p>
                <p className="text-xs text-muted-foreground">{libraryAdmin.email} • {libraryAdmin.college?.name || "Campus OS Library Sector"}</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Library Session
            </span>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPI label="Total Book Records" value="12,450" subtitle="Across 18 Categories" icon={Book} tint="#3B82F6" />
            <KPI label="Active Borrowers" value="612" subtitle="Students & Faculty" icon={Users} tint="#2563EB" />
            <KPI label="Monthly Circulation" value="890" subtitle="Book issues this month" icon={FileCheck} tint="#22C55E" />
            <KPI label="Overdue Books" value="14" subtitle="Pending returns" icon={Clock} tint="#EAB308" />
          </div>

          {/* Analytics Chart */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    Book Checkouts & Digital Access Analytics
                  </h3>
                  <p className="text-xs text-muted-foreground">Monthly catalog circulation vs e-resource reads</p>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_LIBRARY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="Checkouts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Returns" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">Popular Categories</h3>
                <p className="text-xs text-muted-foreground mb-4">Circulation demand by department</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Computer Science & IT</span>
                      <span className="text-blue-600">42%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Mechanical & Electronics</span>
                      <span className="text-purple-600">28%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: "28%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>General Science & Math</span>
                      <span className="text-emerald-600">18%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: "18%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground border border-border">
                <span className="font-semibold text-foreground">Notice:</span> 14 books are currently marked overdue. Automated SMS notices sent.
              </div>
            </div>
          </div>

          {/* Book Catalog Records Table */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between border-b border-border">
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title, author, category..."
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="All">All Book Statuses</option>
                <option value="Available">Available</option>
                <option value="High Demand">High Demand</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">ISBN</th>
                    <th className="px-4 py-3 font-medium">Book Title & Author</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Copies Issued</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-foreground">
                  {filteredBooks.map((b) => (
                    <tr key={b.isbn} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{b.isbn}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-foreground">{b.title}</div>
                        <div className="text-xs text-muted-foreground">by {b.author}</div>
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{b.category}</td>
                      <td className="px-4 py-3 text-xs">
                        {b.issued} / {b.totalQty} Copies
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            b.status === "Available"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : b.status === "High Demand"
                              ? "bg-blue-500/10 text-blue-600"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {b.status}
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
          targetRole="librarian"
          roleLabel="Library Admin"
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
