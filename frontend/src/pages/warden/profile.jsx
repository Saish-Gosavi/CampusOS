import { createFileRoute } from "@/routes/compat";
import { UserCircle2, Mail, Phone, ShieldCheck, KeyRound, Bell } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
const Route = createFileRoute("/warden/profile")({
  component: ProfilePage
});
const TINT = "#7B4CED";
function ProfilePage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Profile"
    description="Manage your warden account, security and notification preferences."
    icon={UserCircle2}
    tint={TINT}
    breadcrumbs={[{ label: "Profile" }]}
  />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-2xl font-bold text-white shadow-md">WD</div>
          <h2 className="mt-4 text-lg font-semibold text-foreground">R. Kulkarni</h2>
          <p className="text-sm text-muted-foreground">Warden · Boys Hostel</p>
          <div className="mt-4 space-y-2 text-left text-sm">
            <p className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> warden@vppcoe.edu</p>
            <p className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> +91 98200 40011</p>
            <p className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4" /> Assigned: Block A, B</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">Edit Profile</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Full Name</label>
                <Input defaultValue="R. Kulkarni" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Email</label>
                <Input defaultValue="warden@vppcoe.edu" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
                <Input defaultValue="+91 98200 40011" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Designation</label>
                <Input defaultValue="Warden" />
              </div>
            </div>
            <div className="mt-4 flex justify-end"><Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90">Save Changes</Button></div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground"><KeyRound className="h-4 w-4" /> Change Password</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Current</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">New</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Confirm</label>
                <Input type="password" placeholder="••••••••" />
              </div>
            </div>
            <div className="mt-4 flex justify-end"><Button variant="outline">Update Password</Button></div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground"><Bell className="h-4 w-4" /> Notification Preferences</h3>
            <div className="mt-4 space-y-3">
              {[
    { label: "New leave request", desc: "Notify when a student applies for leave" },
    { label: "New complaint raised", desc: "Notify on any new complaint from residents" },
    { label: "Visitor request", desc: "Notify on new visitor approval requests" },
    { label: "Furniture damage report", desc: "Notify when damage is reported" }
  ].map((p, i) => <label key={p.label} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked={i < 3} className="h-4 w-4 accent-[#7B4CED]" />
                </label>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Route
};
