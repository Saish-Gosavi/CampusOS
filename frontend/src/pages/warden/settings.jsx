import { createFileRoute } from "@/routes/compat";
import { Settings, Moon, Languages, Bell } from "lucide-react";
import { WardenPageHeader } from "@/components/warden/WardenPageHeader";
import { Button } from "@/components/ui/button";
const Route = createFileRoute("/warden/settings")({
  component: SettingsPage
});
const TINT = "#2563EB";
function SettingsPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <WardenPageHeader
    title="Settings"
    description="Personalise your warden portal experience."
    icon={Settings}
    tint={TINT}
    breadcrumbs={[{ label: "Settings" }]}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SettingSection icon={Moon} title="Theme" description="Switch between light and dark mode.">
          <div className="flex gap-2">
            <Button variant="outline">Light</Button>
            <Button variant="outline">Dark</Button>
            <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90">System</Button>
          </div>
        </SettingSection>

        <SettingSection icon={Languages} title="Language" description="Choose your preferred display language.">
          <select className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm">
            <option>English (India)</option>
            <option>हिन्दी</option>
            <option>मराठी</option>
          </select>
        </SettingSection>

        <SettingSection icon={Bell} title="Notifications" description="Manage in-app and email alerts.">
          <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <span className="text-sm text-foreground">Email alerts</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2563EB]" />
          </label>
          <label className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-3">
            <span className="text-sm text-foreground">Weekly summary</span>
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-[#2563EB]" />
          </label>
        </SettingSection>
      </div>
    </div>;
}
function SettingSection({ icon: Icon, title, description, children }) {
  return <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span>
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>;
}
export {
  Route
};
