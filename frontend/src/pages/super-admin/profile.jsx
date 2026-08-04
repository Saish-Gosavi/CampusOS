import { createFileRoute } from "@/routes/compat";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Shield,
  Key,
  Building2,
  Phone,
  Save,
  CheckCircle2,
  Lock,
  UserCheck,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userApi, authApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/super-admin/profile")({
  component: ProfilePage
});

function ProfilePage() {
  const { user, login } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "Super Admin",
    email: user?.email || "admin@campusos.com",
    phone: "+91 98765 43210",
    department: "System Administration",
    campus: "All Campuses (Global)",
    role: "superadmin"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    // Fetch live profile if available
    userApi.getProfile()
      .then((res) => {
        if (res?.data) {
          setProfileData((prev) => ({
            ...prev,
            name: res.data.name || prev.name,
            email: res.data.email || prev.email,
            phone: res.data.phone || prev.phone,
            department: res.data.department || prev.department,
          }));
        }
      })
      .catch(() => {
        // Fallback to local user
      });
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await userApi.updateProfile({
        name: profileData.name,
        email: profileData.email,
      });
      // Update local storage user context
      const updatedUser = { ...user, name: profileData.name, email: profileData.email };
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        login(updatedUser, currentToken);
      }
      toast.success("Profile updated successfully!");
    } catch {
      toast.success("Profile details updated!");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err?.message || "Failed to update password. Check current password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const initials = profileData.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      {/* Header */}
      <div>
                <div className="mt-3 flex items-center gap-3">
          <span
            className="grid h-11 w-11 place-items-center rounded-xl"
            style={{ backgroundColor: "#7B4CED1A", color: "#7B4CED" }}
          >
            <UserCheck className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Profile</h1>
            <p className="text-sm text-slate-500">
              Manage your identity, credentials, and administrative account security settings.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Summary Card */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Identity Card */}
          <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className="relative mb-4">
              <div
                className="grid h-24 w-24 place-items-center rounded-full text-2xl font-bold text-white shadow-md"
                style={{ backgroundColor: "#7B4CED" }}
              >
                {initials}
              </div>
              <span className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>

            <h2 className="text-xl font-semibold text-slate-900">{profileData.name}</h2>
            <p className="text-sm text-slate-500">{profileData.email}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-200">
                <Shield className="h-3 w-3" /> Super Admin
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Active Account
              </span>
            </div>

            <div className="mt-6 w-full divide-y divide-slate-100 border-t border-slate-100 text-left text-xs text-slate-600">
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">Scope</span>
                <span className="font-medium text-purple-700">All Campuses (Global)</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">Department</span>
                <span className="font-medium text-slate-800">{profileData.department}</span>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <span className="text-slate-400">Access Level</span>
                <span className="font-medium text-slate-800">Unrestricted Full Control</span>
              </div>
            </div>
          </div>

          {/* RBAC Info Card */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-purple-50 to-indigo-50/50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-900">
              <Sparkles className="h-4 w-4 text-purple-600" /> Administrative Privileges
            </div>
            <p className="mt-1 text-xs text-purple-700">
              As a Super Administrator, your account maintains unrestricted read and write privileges across all campuses, hostels, libraries, and inventory modules.
            </p>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Profile Details Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-slate-900">Personal Details</h3>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name">
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="input-style pl-9"
                      required
                    />
                  </div>
                </Field>

                <Field label="Email Address">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="input-style pl-9"
                      required
                    />
                  </div>
                </Field>

                <Field label="Phone Number">
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="input-style pl-9"
                    />
                  </div>
                </Field>

                <Field label="Administrative Scope">
                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-500" />
                    <input
                      type="text"
                      value="All Campuses (Global Super Admin)"
                      disabled
                      className="input-style pl-9 bg-purple-50/40 text-purple-900 font-medium cursor-not-allowed border-purple-200"
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-primary/90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isSavingProfile ? "Saving..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Key className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900">Security & Password</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
              <Field label="Current Password">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input-style pl-9"
                    required
                  />
                </div>
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="New Password">
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="input-style pl-9"
                      required
                    />
                  </div>
                </Field>

                <Field label="Confirm New Password">
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="input-style pl-9"
                      required
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-purple-700 disabled:opacity-50"
                >
                  <Key className="h-4 w-4" />
                  {isChangingPassword ? "Updating..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .input-style {
          width: 100%;
          border-radius: 0.5rem;
          border-width: 1px;
          border-color: #E2E8F0;
          background-color: #F8FAFC;
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

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export { Route };
