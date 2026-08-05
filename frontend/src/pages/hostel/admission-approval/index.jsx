import { useState, useEffect, useCallback } from "react";
import { createFileRoute } from "@/routes/compat";
import {
  ClipboardList, Search, CheckCircle2, XCircle, Clock, Eye, Settings2,
  FileText, Download, X, Loader2, ToggleLeft, ToggleRight, Save, ChevronDown,
  User, AlertCircle, RefreshCw
} from "lucide-react";
import { admissionApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/hostel-admin/admission-approval")(
  { component: AdmissionApprovalPage }
);

const STATUS_META = {
  pending:  { label: "Pending",  bg: "#EAB3081A", fg: "#B45309", icon: Clock },
  approved: { label: "Approved", bg: "#22C55E1A", fg: "#16A34A", icon: CheckCircle2 },
  rejected: { label: "Rejected", bg: "#EF44441A", fg: "#DC2626", icon: XCircle }
};

function AdmissionApprovalPage() {
  const [tab, setTab] = useState("applications"); // "applications" | "config"
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  // Form config state
  const [config, setConfig] = useState(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configSaving, setConfigSaving] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await admissionApi.listApplications({ status: statusFilter === "all" ? undefined : statusFilter });
      const data = res.data !== undefined ? res : { items: [], total: 0 };
      const items = Array.isArray(res.items) ? res.items : (Array.isArray(res.data) ? res.data : []);
      setApplications(items);
      setTotal(res.total || items.length);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const fetchConfig = useCallback(async () => {
    setConfigLoading(true);
    try {
      const res = await admissionApi.getAdminConfig();
      setConfig(res.data || res);
    } catch (err) {
      toast.error("Failed to load form config");
    } finally {
      setConfigLoading(false);
    }
  }, []);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);
  useEffect(() => { if (tab === "config" && !config) fetchConfig(); }, [tab, config, fetchConfig]);

  const filtered = applications.filter(app => {
    if (!query.trim()) return true;
    const d = app.data || {};
    const hay = `${d.fullName} ${d.email} ${d.collegeName} ${d.branch}`.toLowerCase();
    return hay.includes(query.toLowerCase());
  });

  const handleAction = async (id, status) => {
    setActionLoading(true);
    try {
      await admissionApi.updateStatus(id, status, remarks);
      toast.success(`Application ${status}`);
      setSelectedApp(null);
      setRemarks("");
      fetchApplications();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const toggleField = (type, key, prop) => {
    setConfig(prev => ({
      ...prev,
      [type]: prev[type].map(item =>
        item.key === key ? { ...item, [prop]: !item[prop] } : item
      )
    }));
  };

  const saveConfig = async () => {
    setConfigSaving(true);
    try {
      await admissionApi.updateAdminConfig(config);
      toast.success("Form configuration saved!");
    } catch (err) {
      toast.error("Failed to save config");
    } finally {
      setConfigSaving(false);
    }
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const BASE_URL = API_URL.replace("/api", "");

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl" style={{ backgroundColor: "#2563EB1A", color: "#2563EB" }}>
            <ClipboardList className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Admission Approval</h1>
            <p className="text-sm text-slate-500">Review student hostel applications and configure the registration form</p>
          </div>
        </div>
        <button
          onClick={fetchApplications}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Applications", value: total, color: "#2563EB" },
          { label: "Pending", value: applications.filter(a => a.status === "pending").length, color: "#B45309" },
          { label: "Approved", value: applications.filter(a => a.status === "approved").length, color: "#16A34A" },
          { label: "Rejected", value: applications.filter(a => a.status === "rejected").length, color: "#DC2626" }
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-100 p-1 w-fit">
        {[
          { id: "applications", label: "Applications", icon: ClipboardList },
          { id: "config", label: "Form Configuration", icon: Settings2 }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* === APPLICATIONS TAB === */}
      {tab === "applications" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {/* Filters */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name, email, college..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Applicant</th>
                  <th className="px-4 py-3 font-medium">College / Branch</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Applied On</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="h-5 w-5 animate-spin" /> Loading applications...
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                    No applications found
                  </td></tr>
                ) : filtered.map(app => {
                  const d = app.data || {};
                  const sm = STATUS_META[app.status] || STATUS_META.pending;
                  const Icon = sm.icon;
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {(d.fullName || "?").slice(0, 2).toUpperCase()}
                          </span>
                          <div>
                            <div className="font-medium text-slate-900">{d.fullName || "—"}</div>
                            <div className="text-xs text-slate-500">{d.email || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{d.collegeName || "—"}</div>
                        <div className="text-xs text-slate-500">{d.branch || ""} {d.year ? `• ${d.year}` : ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                          style={{ backgroundColor: sm.bg, color: sm.fg }}>
                          <Icon className="h-3 w-3" /> {sm.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setSelectedApp(app); setRemarks(app.remarks || ""); }}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                          {app.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAction(app.id, "approved")}
                                className="flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleAction(app.id, "rejected")}
                                className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                              >
                                <XCircle className="h-3.5 w-3.5" /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* === FORM CONFIG TAB === */}
      {tab === "config" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Dynamic Form Configuration</p>
              <p className="mt-0.5 text-blue-600">Changes here instantly affect what students see on the registration page. Toggle fields on/off and mark them required or optional.</p>
            </div>
          </div>

          {configLoading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading configuration...
            </div>
          ) : config ? (
            <>
              {/* Fields config */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" /> Form Fields
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control which personal information fields appear on the registration form</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {(config.fields || []).map(field => (
                    <div key={field.key} className="flex items-center gap-4 px-5 py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{field.label}</p>
                        <p className="text-xs text-slate-400 capitalize">{field.type} field</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                          <span>Required</span>
                          <button
                            type="button"
                            onClick={() => field.enabled && toggleField("fields", field.key, "required")}
                            disabled={!field.enabled}
                            className={`transition ${field.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}
                          >
                            {field.required
                              ? <ToggleRight className="h-5 w-5 text-amber-500" />
                              : <ToggleLeft className="h-5 w-5 text-slate-300" />
                            }
                          </button>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                          <span>Enabled</span>
                          <button type="button" onClick={() => toggleField("fields", field.key, "enabled")}>
                            {field.enabled
                              ? <ToggleRight className="h-5 w-5 text-primary" />
                              : <ToggleLeft className="h-5 w-5 text-slate-300" />
                            }
                          </button>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents config */}
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
                  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-slate-500" /> Document Uploads
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Control which documents students must upload</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {(config.documents || []).map(doc => (
                    <div key={doc.key} className="flex items-center gap-4 px-5 py-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800">{doc.label}</p>
                        <p className="text-xs text-slate-400">File upload</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                          <span>Required</span>
                          <button
                            type="button"
                            onClick={() => doc.enabled && toggleField("documents", doc.key, "required")}
                            disabled={!doc.enabled}
                            className={`transition ${doc.enabled ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}
                          >
                            {doc.required
                              ? <ToggleRight className="h-5 w-5 text-amber-500" />
                              : <ToggleLeft className="h-5 w-5 text-slate-300" />
                            }
                          </button>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                          <span>Enabled</span>
                          <button type="button" onClick={() => toggleField("documents", doc.key, "enabled")}>
                            {doc.enabled
                              ? <ToggleRight className="h-5 w-5 text-primary" />
                              : <ToggleLeft className="h-5 w-5 text-slate-300" />
                            }
                          </button>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={saveConfig}
                  disabled={configSaving}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
                >
                  {configSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {configSaving ? "Saving..." : "Save Configuration"}
                </button>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Application Details</h3>
                <p className="text-xs text-slate-500">
                  Submitted: {new Date(selectedApp.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status badge */}
              <div className="flex items-center gap-3">
                {(() => {
                  const sm = STATUS_META[selectedApp.status] || STATUS_META.pending;
                  const Icon = sm.icon;
                  return (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                      style={{ backgroundColor: sm.bg, color: sm.fg }}>
                      <Icon className="h-4 w-4" /> {sm.label}
                    </span>
                  );
                })()}
                {selectedApp.remarks && (
                  <span className="text-xs text-slate-500">Remarks: {selectedApp.remarks}</span>
                )}
              </div>

              {/* Field values */}
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Personal Information</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(selectedApp.data || {}).map(([k, v]) => (
                    <div key={k} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-xs text-slate-400 capitalize">{k.replace(/([A-Z])/g, " $1")}</p>
                      <p className="mt-0.5 text-sm font-medium text-slate-800">{v || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              {(selectedApp.documents || []).length > 0 && (
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Uploaded Documents</h4>
                  <div className="space-y-2">
                    {selectedApp.documents.map(doc => (
                      <a
                        key={doc.key}
                        href={`${BASE_URL}${doc.path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:border-primary hover:bg-primary/5 transition"
                      >
                        <FileText className="h-5 w-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{doc.label || doc.key}</p>
                          <p className="text-xs text-slate-400">{doc.filename}</p>
                        </div>
                        <Download className="h-4 w-4 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Remarks input + Actions */}
              {selectedApp.status === "pending" && (
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <label className="block text-sm font-medium text-slate-700">
                    Remarks (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    placeholder="Add a note for the applicant..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                  <div className="flex gap-3">
                    <button
                      disabled={actionLoading}
                      onClick={() => handleAction(selectedApp.id, "approved")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Approve Application
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() => handleAction(selectedApp.id, "rejected")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                    >
                      {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                      Reject Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { Route };
