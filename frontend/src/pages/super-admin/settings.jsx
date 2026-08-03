import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Globe,
  ShieldCheck,
  Bell,
  Sliders,
  Save,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";
import { settingsApi } from "@/services/api";

const Route = createFileRoute("/super-admin/settings")({
  component: SettingsPage
});

const DEFAULT_SETTINGS = {
  // General
  portalName: "CampusOS Portal",
  orgName: "VPPCOE — Mumbai",
  supportEmail: "support@campusos.edu.in",
  timezone: "Asia/Kolkata (GMT+5:30)",
  currency: "INR (₹)",
  defaultLanguage: "English (US)",

  // Security
  sessionTimeoutMinutes: "30",
  maxLoginAttempts: "5",
  require2FA: true,
  passwordMinLength: "8",
  requireSpecialChar: true,

  // Notifications
  smtpHost: "smtp.campusos.edu.in",
  smtpPort: "587",
  smtpSender: "noreply@campusos.edu.in",
  enableEmailAlerts: true,
  enablePushNotifications: true,
  notifyNewLeaveRequests: true,
  notifyOverdueBooks: true,

  // Modules & System
  moduleHostel: true,
  moduleLibrary: true,
  moduleInventory: true,
  autoBackupInterval: "Daily",
  maintenanceMode: false
};

function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("super_admin_settings");
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    settingsApi.get()
      .then((res) => {
        if (res?.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch((err) => {
        console.warn("Could not fetch backend settings, using local fallback", err);
      });
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const res = await settingsApi.update(settings);
      if (res?.data) {
        setSettings((prev) => ({ ...prev, ...res.data }));
      }
      localStorage.setItem("super_admin_settings", JSON.stringify(settings));
      toast.success("Settings saved to server successfully!");
    } catch (err) {
      console.error("Backend settings update error:", err);
      toast.success("Settings saved locally!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Reset all settings to default values?")) {
      try {
        const res = await settingsApi.reset();
        if (res?.data) {
          setSettings(res.data);
        } else {
          setSettings(DEFAULT_SETTINGS);
        }
        localStorage.removeItem("super_admin_settings");
        toast.info("Settings reset to defaults on server.");
      } catch {
        setSettings(DEFAULT_SETTINGS);
        localStorage.removeItem("super_admin_settings");
        toast.info("Settings reset to defaults.");
      }
    }
  };

  const tabs = [
    { id: "general", label: "General & Branding", icon: Globe },
    { id: "security", label: "Security & Access", icon: ShieldCheck },
    { id: "notifications", label: "Notifications & Email", icon: Bell },
    { id: "modules", label: "Modules & Backup", icon: Sliders }
  ];

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
                    <div className="mt-3 flex items-center gap-3">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl"
              style={{ backgroundColor: "#2563EB1A", color: "#2563EB" }}
            >
              <SettingsIcon className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Portal Settings</h1>
              <p className="text-sm text-slate-500">
                Configure global system preferences, security policies, and active modules.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:col-span-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            {activeTab === "general" && (
              <div className="flex flex-col gap-6">
                <SectionHeader
                  title="General & Branding"
                  description="Customize portal metadata, organization details, and localization."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Portal Title">
                    <input
                      type="text"
                      value={settings.portalName}
                      onChange={(e) => handleChange("portalName", e.target.value)}
                      className="input-style"
                    />
                  </Field>
                  <Field label="Campus / Organization">
                    <input
                      type="text"
                      value={settings.orgName}
                      onChange={(e) => handleChange("orgName", e.target.value)}
                      className="input-style"
                    />
                  </Field>
                  <Field label="Support Email">
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => handleChange("supportEmail", e.target.value)}
                      className="input-style"
                    />
                  </Field>
                  <Field label="Default Currency">
                    <select
                      value={settings.currency}
                      onChange={(e) => handleChange("currency", e.target.value)}
                      className="input-style"
                    >
                      <option>INR (₹)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </Field>
                  <Field label="System Timezone">
                    <select
                      value={settings.timezone}
                      onChange={(e) => handleChange("timezone", e.target.value)}
                      className="input-style"
                    >
                      <option>Asia/Kolkata (GMT+5:30)</option>
                      <option>UTC (GMT+0:00)</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </Field>
                  <Field label="Default Language">
                    <select
                      value={settings.defaultLanguage}
                      onChange={(e) => handleChange("defaultLanguage", e.target.value)}
                      className="input-style"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Hindi (हिंदी)</option>
                      <option>Marathi (मराठी)</option>
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="flex flex-col gap-6">
                <SectionHeader
                  title="Security & Access Control"
                  description="Enforce authentication policies, session timeouts, and password rules."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Session Timeout (Minutes)">
                    <input
                      type="number"
                      value={settings.sessionTimeoutMinutes}
                      onChange={(e) => handleChange("sessionTimeoutMinutes", e.target.value)}
                      className="input-style"
                      min="5"
                      max="1440"
                    />
                  </Field>
                  <Field label="Max Failed Login Attempts">
                    <input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleChange("maxLoginAttempts", e.target.value)}
                      className="input-style"
                      min="3"
                      max="10"
                    />
                  </Field>
                  <Field label="Minimum Password Length">
                    <input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleChange("passwordMinLength", e.target.value)}
                      className="input-style"
                      min="6"
                      max="32"
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <ToggleOption
                    title="Enforce Two-Factor Authentication (2FA)"
                    description="Require 2FA verification for all Administrative & Superadmin accounts."
                    checked={settings.require2FA}
                    onChange={(checked) => handleChange("require2FA", checked)}
                  />
                  <ToggleOption
                    title="Require Special Characters in Passwords"
                    description="Ensure users include at least one symbol (@, #, $, etc.) when updating passwords."
                    checked={settings.requireSpecialChar}
                    onChange={(checked) => handleChange("requireSpecialChar", checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="flex flex-col gap-6">
                <SectionHeader
                  title="Notifications & Gateway Setup"
                  description="Configure email server credentials and automated system alert dispatchers."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="SMTP Host Server">
                    <input
                      type="text"
                      value={settings.smtpHost}
                      onChange={(e) => handleChange("smtpHost", e.target.value)}
                      className="input-style"
                    />
                  </Field>
                  <Field label="SMTP Port">
                    <input
                      type="text"
                      value={settings.smtpPort}
                      onChange={(e) => handleChange("smtpPort", e.target.value)}
                      className="input-style"
                    />
                  </Field>
                  <Field label="Sender Email Address">
                    <input
                      type="email"
                      value={settings.smtpSender}
                      onChange={(e) => handleChange("smtpSender", e.target.value)}
                      className="input-style"
                    />
                  </Field>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <ToggleOption
                    title="Enable System Email Alerts"
                    description="Send system generated receipt emails, credentials, and notifications."
                    checked={settings.enableEmailAlerts}
                    onChange={(checked) => handleChange("enableEmailAlerts", checked)}
                  />
                  <ToggleOption
                    title="Hostel Leave Request Notifications"
                    description="Send instant alerts to Wardens when students submit new leave requests."
                    checked={settings.notifyNewLeaveRequests}
                    onChange={(checked) => handleChange("notifyNewLeaveRequests", checked)}
                  />
                  <ToggleOption
                    title="Library Overdue Reminders"
                    description="Automatically dispatch warning emails for overdue book returns."
                    checked={settings.notifyOverdueBooks}
                    onChange={(checked) => handleChange("notifyOverdueBooks", checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "modules" && (
              <div className="flex flex-col gap-6">
                <SectionHeader
                  title="Modules & System Maintenance"
                  description="Enable core campus sub-systems and set automated database backups."
                />
                <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <ToggleOption
                    title="Hostel Management Module"
                    description="Enable room allocations, gate passes, complaints, and visitor logs."
                    checked={settings.moduleHostel}
                    onChange={(checked) => handleChange("moduleHostel", checked)}
                  />
                  <ToggleOption
                    title="Library Management Module"
                    description="Enable catalog search, book issue/returns, and fine management."
                    checked={settings.moduleLibrary}
                    onChange={(checked) => handleChange("moduleLibrary", checked)}
                  />
                  <ToggleOption
                    title="Inventory & Asset Management"
                    description="Enable hostel furniture tracking, maintenance requests, and item stocks."
                    checked={settings.moduleInventory}
                    onChange={(checked) => handleChange("moduleInventory", checked)}
                  />
                  <ToggleOption
                    title="System Maintenance Mode"
                    description="Restrict non-admin access to the portal during scheduled maintenance."
                    checked={settings.maintenanceMode}
                    onChange={(checked) => handleChange("maintenanceMode", checked)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Automatic Database Backup Frequency">
                    <select
                      value={settings.autoBackupInterval}
                      onChange={(e) => handleChange("autoBackupInterval", e.target.value)}
                      className="input-style"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                      <option>Disabled</option>
                    </select>
                  </Field>
                </div>
              </div>
            )}

            {/* Bottom Form Actions */}
            <div className="mt-4 flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .input-style {
          width: 100%;
          border-radius: 0.5rem;
          border-width: 1px;
          border-color: #E2E8F0;
          background-color: #F8FAFC;
          padding-left: 0.75rem;
          padding-right: 0.75rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s;
        }
        .input-style:focus {
          border-color: #2563EB;
          background-color: #FFFFFF;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="border-b border-slate-100 pb-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function ToggleOption({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <div className="text-sm font-medium text-slate-900">{title}</div>
        <div className="text-xs text-slate-500">{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-primary" : "bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export { Route };
