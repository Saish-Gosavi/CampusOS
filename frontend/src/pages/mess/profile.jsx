import React, { useState } from "react";
import { User, Lock, Mail, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const Route = {
  head: () => ({
    meta: [
      { title: "Profile & Account — Mess Manager" },
      { name: "description", content: "Mess Manager Profile and password security settings." }
    ]
  }),
  component: MessProfilePage
};

function MessProfilePage() {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirmPass: "" });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwords.newPass || passwords.newPass !== passwords.confirmPass) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswords({ current: "", newPass: "", confirmPass: "" });
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-4xl">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground">Mess Manager Profile & Account</h1>
        <p className="text-xs text-muted-foreground">Manage your credentials and dining portal access settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-600 font-bold text-white text-lg">
              M
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">{user?.name || "Mess Manager"}</h3>
              <p className="text-xs text-muted-foreground">{user?.email || "mess@campus.os"}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground">System Role</label>
              <div className="mt-1 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-amber-800 font-bold">
                <Shield className="h-4 w-4" /> Mess Manager (Staff)
              </div>
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Contact Email / Login Username</label>
              <div className="mt-1 flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-foreground font-medium">
                <Mail className="h-4 w-4 text-muted-foreground" /> {user?.email || "mess@campus.os"}
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Lock className="h-4 w-4 text-amber-600" />
            <h3 className="text-base font-bold text-foreground">Change Password</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground">Current Password</label>
              <input
                type="password"
                required
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">New Password</label>
              <input
                type="password"
                required
                value={passwords.newPass}
                onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="font-semibold text-muted-foreground">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirmPass}
                onChange={(e) => setPasswords({ ...passwords, confirmPass: e.target.value })}
                className="w-full rounded-xl border border-border bg-background p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-600 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors">
              <Save className="h-4 w-4" /> Update Security Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MessProfilePage;
export { Route };
