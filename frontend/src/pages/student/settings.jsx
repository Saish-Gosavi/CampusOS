import { createFileRoute } from "@tanstack/react-router";
import { Settings, Moon, Sun, Globe, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
const Route = createFileRoute("/student/settings")({
  head: () => ({ meta: [{ title: "Settings \u2014 Student Portal" }] }),
  component: SettingsPage
});
function SettingsPage() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("campusos-theme") : null;
    setDark(stored === "dark");
  }, []);
  const toggle = (v) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    window.localStorage.setItem("campusos-theme", v ? "dark" : "light");
  };
  return <div className="mx-auto flex max-w-[1000px] flex-col gap-6">
      <StudentPageHeader
    title="Settings"
    description="Personalize your experience"
    icon={Settings}
    tint="#64748B"
    breadcrumbs={[{ label: "Settings" }]}
  />

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} Appearance
        </h3>
        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium">Dark mode</p>
            <p className="text-xs text-muted-foreground">Toggle between light and dark themes</p>
          </div>
          <Switch checked={dark} onCheckedChange={toggle} />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Globe className="h-4 w-4" /> Language
        </h3>
        <select className="h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm">
          <option>English (India)</option>
          <option>हिन्दी</option>
          <option>मराठी</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Bell className="h-4 w-4" /> Notification preferences
        </h3>
        <div className="space-y-3">
          {[
    { label: "Hostel alerts (leaves, complaints, notices)", def: true },
    { label: "Library alerts (due dates, fines, arrivals)", def: true },
    { label: "College announcements", def: true },
    { label: "Email digest (weekly)", def: false }
  ].map((n) => <div key={n.label} className="flex items-center justify-between rounded-lg border border-border p-3">
              <p className="text-sm">{n.label}</p>
              <Switch defaultChecked={n.def} />
            </div>)}
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">Save preferences</Button>
        </div>
      </div>
    </div>;
}
export {
  Route
};
