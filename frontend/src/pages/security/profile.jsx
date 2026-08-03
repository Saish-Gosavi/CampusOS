import { createFileRoute } from "@tanstack/react-router";
import { UserCircle2, Mail, Phone, Shield, Lock, Save } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const Route = createFileRoute("/security/profile")({
  component: ProfilePage
});
const TINT = "#2563EB";
function ProfilePage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
    title="My Profile"
    description="Personal details, duty assignment and password."
    icon={UserCircle2}
    tint={TINT}
    breadcrumbs={[{ label: "Profile" }]}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <span className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-3xl font-bold text-white">SC</span>
            <h2 className="mt-3 text-lg font-semibold text-foreground">S. Rane</h2>
            <p className="text-sm text-muted-foreground">Head — Security Desk</p>
            <span className="mt-2 rounded-full bg-[#22C55E]/10 px-2.5 py-0.5 text-xs font-medium text-[#16A34A]">On Duty</span>
          </div>
          <dl className="mt-5 space-y-2.5 text-sm">
            <Row icon={Mail} k="Email" v="security@vppcoe.edu" />
            <Row icon={Phone} k="Contact" v="+91 98200 40011" />
            <Row icon={Shield} k="Shift" v="Morning · 06:00–14:00" />
            <Row icon={Shield} k="Assigned Gates" v="Main + Hostel" />
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-foreground">Edit Profile</h3>
          <p className="text-xs text-muted-foreground">Keep your contact details up to date.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Full Name" value="S. Rane" />
            <Field label="Email" value="security@vppcoe.edu" />
            <Field label="Phone" value="+91 98200 40011" />
            <Field label="Employee ID" value="VP-SEC-014" />
          </div>
          <div className="mt-4 flex justify-end">
            <Button style={{ backgroundColor: TINT }} className="gap-2 text-white hover:opacity-90"><Save className="h-4 w-4" /> Save</Button>
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <div className="mb-3 flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#EF4444]" />
              <h3 className="text-base font-semibold text-foreground">Change Password</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Field label="Current Password" type="password" value="" />
              <Field label="New Password" type="password" value="" />
              <Field label="Confirm Password" type="password" value="" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline">Update Password</Button>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
function Row({ icon: Icon, k, v }) {
  return <div className="flex items-center gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{k}</p>
        <p className="truncate text-sm font-medium text-foreground">{v}</p>
      </div>
    </div>;
}
function Field({ label, value, type = "text" }) {
  return <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <Input defaultValue={value} type={type} className="h-10" />
    </label>;
}
export {
  Route
};
