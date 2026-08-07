import { createFileRoute } from "@/routes/compat";
import { useState, useEffect } from "react";
import { UserCircle2, Mail, Phone, ShieldCheck, KeyRound, Bell, Save, Eye, EyeOff, Building } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { userApi, authApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/warden/profile")({
  component: ProfilePage
});

const TINT = "#7B4CED";

function ProfilePage() {
  const { user, login } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.name || "Warden",
    email: user?.email || "",
    phone: "",
    designation: "Warden",
    shift: "Day",
    hostelName: "Hostel"
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await userApi.getProfile();
      const userData = res?.data || res;
      if (userData) {
        const warden = userData.wardenProfile || {};
        const hostel = warden.hostel || userData.hostel || {};
        setProfileData({
          fullName: warden.fullName || userData.name || user?.name || "",
          email: userData.email || user?.email || "",
          phone: warden.phone || userData.phone || "",
          designation: warden.shift ? `Warden (${warden.shift} Shift)` : "Warden",
          shift: warden.shift || "Day",
          hostelName: hostel.name || "Assigned Hostel"
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
      toast.error("Failed to load warden profile data from backend.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await userApi.updateProfile({
        name: profileData.fullName,
        phone: profileData.phone,
        email: profileData.email
      });

      const updatedUser = {
        ...user,
        name: profileData.fullName,
        email: profileData.email
      };
      const token = localStorage.getItem("token");
      if (token) {
        login(updatedUser, token);
      }

      toast.success("Profile updated successfully!");
      await fetchProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }
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
      toast.error(err?.response?.data?.message || err?.message || "Failed to update password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "WD";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
        title="Profile"
        description="Manage your warden account, security and notification preferences."
        icon={UserCircle2}
        tint={TINT}
        breadcrumbs={[{ label: "Profile" }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
        {/* Left Column - Summary Card */}
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm h-fit">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-2xl font-bold text-white shadow-md">
            {getInitials(profileData.fullName)}
          </div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            {loadingProfile ? "Loading..." : profileData.fullName}
          </h2>
          <p className="text-sm text-muted-foreground">
            Warden · {profileData.hostelName}
          </p>
          <div className="mt-4 space-y-2 text-left text-sm">
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0 text-primary" /> {profileData.email || "N/A"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0 text-primary" /> {profileData.phone || "No phone registered"}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Building className="h-4 w-4 shrink-0 text-primary" /> Hostel: {profileData.hostelName}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> Shift: {profileData.shift} Shift
            </p>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="flex flex-col gap-6">
          {/* Edit Profile */}
          <form onSubmit={handleSaveProfile} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">Edit Profile</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Data synchronized directly with hostel admin records.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
                <Input
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone Number</label>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Designation / Role</label>
                <Input
                  value={profileData.designation}
                  disabled
                  className="bg-muted/40 text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                style={{ backgroundColor: TINT }}
                className="text-white hover:opacity-90 gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>

          {/* Change Password */}
          <form onSubmit={handlePasswordSubmit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <KeyRound className="h-4 w-4" /> Change Password
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Current Password</label>
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">New Password</label>
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Min. 6 chars"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Confirm Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit" variant="outline" disabled={isChangingPassword}>
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>

          {/* Notification Preferences */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Bell className="h-4 w-4" /> Notification Preferences
            </h3>
            <div className="mt-4 space-y-3">
              {[
                { label: "New leave request", desc: "Notify when a student applies for leave" },
                { label: "New complaint raised", desc: "Notify on any new complaint from residents" },
                { label: "Visitor request", desc: "Notify on new visitor approval requests" },
                { label: "Furniture damage report", desc: "Notify when damage is reported" }
              ].map((p, i) => (
                <label
                  key={p.label}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4 accent-[#7B4CED]" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Route };
