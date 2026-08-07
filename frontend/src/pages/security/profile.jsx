import { createFileRoute } from "@/routes/compat";
import { useState, useEffect } from "react";
import { UserCircle2, Mail, Phone, Shield, Lock, Save, Eye, EyeOff } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { userApi, authApi } from "@/services/api";
import { toast } from "sonner";

const Route = createFileRoute("/security/profile")({
  component: ProfilePage
});

const TINT = "#2563EB";

function ProfilePage() {
  const { user, login } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.name || "Security Staff",
    email: user?.email || "",
    phone: "",
    designation: "Security Desk",
    shift: "Morning · 06:00–14:00"
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
        const security = userData.securityProfile || {};
        setProfileData({
          fullName: security.fullName || userData.name || user?.name || "",
          email: userData.email || user?.email || "",
          phone: security.phone || userData.phone || "",
          designation: "Security Desk",
          shift: "Morning · 06:00–14:00"
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
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
    if (!name) return "SC";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
        title="My Profile"
        description="Personal details, duty assignment and password."
        icon={UserCircle2}
        tint={TINT}
        breadcrumbs={[{ label: "Profile" }]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm h-fit">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-3xl font-bold text-white">
              {getInitials(profileData.fullName)}
            </span>
            <h2 className="mt-3 text-lg font-semibold text-foreground">
              {loadingProfile ? "Loading..." : profileData.fullName}
            </h2>
            <p className="text-sm text-muted-foreground">{profileData.designation}</p>
            <span className="mt-2 rounded-full bg-[#22C55E]/10 px-2.5 py-0.5 text-xs font-medium text-[#16A34A]">
              On Duty
            </span>
          </div>
          <dl className="mt-5 space-y-2.5 text-sm">
            <Row icon={Mail} k="Email" v={profileData.email || "N/A"} />
            <Row icon={Phone} k="Contact" v={profileData.phone || "No phone registered"} />
            <Row icon={Shield} k="Shift" v={profileData.shift} />
            <Row icon={Shield} k="Assigned Gates" v="Main + Hostel Gate" />
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <form onSubmit={handleSaveProfile}>
            <h3 className="text-base font-semibold text-foreground">Edit Profile</h3>
            <p className="text-xs text-muted-foreground">Keep your contact details up to date.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</span>
                <Input
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  placeholder="Full Name"
                  required
                />
              </div>
              <div>
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Email</span>
                <Input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Email address"
                  required
                />
              </div>
              <div>
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Phone</span>
                <Input
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Duty Designation</span>
                <Input value={profileData.designation} disabled className="bg-muted/40 text-muted-foreground cursor-not-allowed" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={isSaving} style={{ backgroundColor: TINT }} className="gap-2 text-white hover:opacity-90">
                <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>

          <form onSubmit={handlePasswordSubmit} className="mt-8 border-t border-border pt-6">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#EF4444]" />
              <h3 className="text-base font-semibold text-foreground">Change Password</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Current Password</span>
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
                <span className="mb-1 block text-xs font-medium text-muted-foreground">New Password</span>
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
                <span className="mb-1 block text-xs font-medium text-muted-foreground">Confirm Password</span>
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
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, k, v }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{k}</p>
        <p className="truncate text-sm font-medium text-foreground">{v}</p>
      </div>
    </div>
  );
}

export { Route };
