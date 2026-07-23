import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { QrCode, Camera, Keyboard, CheckCircle2, LogIn, LogOut, User, RefreshCcw } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/hostel/StatusPill";
import { students } from "@/lib/hostel-data";
const Route = createFileRoute("/security/qr-scanner")({
  component: QRScannerPage
});
const TINT = "#2563EB";
function QRScannerPage() {
  const [scanned, setScanned] = useState(null);
  const [manual, setManual] = useState("");
  const [scanning, setScanning] = useState(false);
  const simulate = () => {
    setScanning(true);
    setTimeout(() => {
      setScanned(students[Math.floor(Math.random() * students.length)]);
      setScanning(false);
    }, 1400);
  };
  const submitManual = () => {
    const found = students.find((s) => s.enrollment.toLowerCase() === manual.toLowerCase()) ?? students[0];
    setScanned(found);
  };
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
    title="QR Code Scanner"
    description="Verify student identity and log entries or exits at the gate."
    icon={QrCode}
    tint={TINT}
    breadcrumbs={[{ label: "QR Scanner" }]}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Camera className="h-4 w-4 text-[#2563EB]" />
            <h3 className="text-base font-semibold text-foreground">Scanner</h3>
          </div>
          <div className="relative grid h-72 place-items-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-slate-900 text-slate-400">
            {scanning ? <>
                <div className="absolute inset-x-8 top-8 bottom-8 rounded-lg border-2 border-[#22C55E]" />
                <div className="absolute left-8 right-8 h-0.5 animate-pulse bg-[#22C55E] shadow-[0_0_20px_#22C55E]" style={{ top: "50%" }} />
                <p className="relative text-sm font-medium text-white">Scanning…</p>
              </> : <div className="text-center">
                <QrCode className="mx-auto h-16 w-16 text-slate-600" />
                <p className="mt-3 text-sm">Point camera at student ID QR</p>
              </div>}
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={simulate} style={{ backgroundColor: TINT }} className="flex-1 gap-2 text-white hover:opacity-90">
              <Camera className="h-4 w-4" /> {scanning ? "Scanning\u2026" : "Start Scan"}
            </Button>
            <Button variant="outline" onClick={() => setScanned(null)} className="gap-2">
              <RefreshCcw className="h-4 w-4" /> Reset
            </Button>
          </div>

          <div className="mt-6 border-t border-border pt-4">
            <div className="mb-2 flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-[#7B4CED]" />
              <h4 className="text-sm font-semibold text-foreground">Manual Entry</h4>
            </div>
            <div className="flex gap-2">
              <Input value={manual} onChange={(e) => setManual(e.target.value)} placeholder="Enter enrollment no. e.g. VP2023CS012" className="h-10" />
              <Button onClick={submitManual} variant="outline">Lookup</Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-[#2563EB]" />
            <h3 className="text-base font-semibold text-foreground">Scan Result</h3>
          </div>
          {!scanned ? <div className="grid h-72 place-items-center rounded-xl border border-dashed border-border bg-muted/30 text-center">
              <div>
                <CheckCircle2 className="mx-auto h-10 w-10 text-muted-foreground/60" />
                <p className="mt-2 text-sm text-muted-foreground">Awaiting scan…</p>
              </div>
            </div> : <div className="rounded-xl border border-border bg-muted/20 p-5">
              <div className="flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xl font-semibold text-white">
                  {scanned.photo}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-semibold text-foreground">{scanned.name}</p>
                  <p className="text-xs text-muted-foreground">{scanned.enrollment} · {scanned.department} · Year {scanned.year}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <StatusPill status={scanned.status} />
                    <span className="text-xs text-muted-foreground">{scanned.hostel} · {scanned.room}</span>
                  </div>
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-background p-3">
                  <dt className="text-muted-foreground">Contact</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{scanned.contact}</dd>
                </div>
                <div className="rounded-lg bg-background p-3">
                  <dt className="text-muted-foreground">Parent</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{scanned.parentContact}</dd>
                </div>
              </dl>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button className="gap-2 bg-[#22C55E] text-white hover:bg-[#16A34A]">
                  <LogIn className="h-4 w-4" /> Confirm Entry
                </Button>
                <Button className="gap-2 bg-[#F97316] text-white hover:bg-[#EA580C]">
                  <LogOut className="h-4 w-4" /> Confirm Exit
                </Button>
              </div>
            </div>}
        </div>
      </div>
    </div>;
}
export {
  Route
};
