import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus, Eye, LogIn, LogOut, ShieldAlert } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { dailyLogs } from "@/lib/security-data";
const Route = createFileRoute("/security/logs")({
  component: LogsPage
});
const TINT = "#0EA5E9";
function LogsPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
    title="Daily Logs"
    description="Shift-wise activity summary maintained by the security desk."
    icon={ClipboardList}
    tint={TINT}
    breadcrumbs={[{ label: "Daily Logs" }]}
    action={<AddLogDialog />}
  />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dailyLogs.map((log) => <div key={log.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">{log.id}</p>
                <p className="mt-0.5 text-lg font-bold text-foreground">{log.date}</p>
              </div>
              <span
    className="rounded-full px-2.5 py-1 text-xs font-semibold"
    style={{
      background: log.shift === "Night" ? "#7B4CED1A" : log.shift === "Morning" ? "#22C55E1A" : "#F973161A",
      color: log.shift === "Night" ? "#7B4CED" : log.shift === "Morning" ? "#16A34A" : "#EA580C"
    }}
  >
                {log.shift} Shift
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Staff on duty: <span className="font-medium text-foreground">{log.staff}</span></p>
            <p className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-foreground">{log.remarks}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Entries" value={log.entries} icon={LogIn} tint="#22C55E" />
              <Stat label="Exits" value={log.exits} icon={LogOut} tint="#F97316" />
              <Stat label="Incidents" value={log.incidents} icon={ShieldAlert} tint="#EF4444" />
            </div>
            <Button variant="outline" size="sm" className="gap-2 self-start">
              <Eye className="h-3.5 w-3.5" /> View Log
            </Button>
          </div>)}
      </div>
    </div>;
}
function Stat({ label, value, icon: Icon, tint }) {
  return <div className="rounded-lg bg-muted/20 p-3">
      <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg" style={{ backgroundColor: `${tint}1A`, color: tint }}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>;
}
function AddLogDialog() {
  return <Dialog>
      <DialogTrigger asChild>
        <Button style={{ backgroundColor: TINT }} className="gap-2 text-white hover:opacity-90">
          <Plus className="h-4 w-4" /> Add Log
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Daily Log</DialogTitle>
          <DialogDescription>Record end-of-shift remarks.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Date</span>
              <Input type="date" className="h-10" />
            </label>
            <label>
              <span className="mb-1 block text-xs font-medium text-muted-foreground">Shift</span>
              <select className="h-10 w-full rounded-lg border border-border bg-background px-3">
                <option>Morning</option><option>Afternoon</option><option>Night</option>
              </select>
            </label>
          </div>
          <label>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Staff on Duty</span>
            <Input placeholder="Name" className="h-10" />
          </label>
          <label>
            <span className="mb-1 block text-xs font-medium text-muted-foreground">Remarks</span>
            <textarea rows={4} className="w-full rounded-lg border border-border bg-background p-3 text-sm" placeholder="Highlights, unusual events, follow-ups…" />
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button style={{ backgroundColor: TINT }} className="text-white hover:opacity-90">Save Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}
export {
  Route
};
