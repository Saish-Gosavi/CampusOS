import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FilePlus2, Users, IndianRupee, CalendarClock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { feeStructure, students } from "@/lib/hostel-data";

export const Route = createFileRoute("/hostel-admin/fees/generate")({
  component: GenerateFeesPage,
});

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const HOSTELS = ["All Hostels", "Sahyadri Boys", "Aravali Girls", "Nilgiri Boys"];
const YEARS = ["All Years", "1st Year", "2nd Year", "3rd Year", "4th Year"];

function GenerateFeesPage() {
  const navigate = useNavigate();
  const [semester, setSemester] = useState("Aug-Dec 2026");
  const [dueDate, setDueDate] = useState("2026-08-01");
  const [hostel, setHostel] = useState(HOSTELS[0]);
  const [year, setYear] = useState(YEARS[0]);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(feeStructure.filter((f) => f.frequency === "Semester").map((f) => f.id)),
  );

  const targetCount = useMemo(() => {
    let list = students;
    if (hostel !== "All Hostels") list = list.filter((s) => s.hostel === hostel);
    return list.length;
  }, [hostel]);

  const perStudent = useMemo(
    () => feeStructure.filter((f) => selected.has(f.id)).reduce((s, f) => s + f.amount, 0),
    [selected],
  );

  const grandTotal = perStudent * targetCount;

  const toggle = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const handleGenerate = () => {
    if (selected.size === 0) {
      toast.error("Select at least one fee head.");
      return;
    }
    toast.success(`Generated ${targetCount} invoices for ${semester}`);
    navigate({ to: "/hostel-admin/fees/pending" });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: "#22C55E1a", color: "#22C55E" }}
            >
              <FilePlus2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Invoice Setup</h2>
              <p className="text-xs text-muted-foreground">
                Choose semester, due date and the target audience.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Semester">
              <input
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Due Date">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </Field>
            <Field label="Hostel">
              <select
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {HOSTELS.map((h) => (
                  <option key={h}>{h}</option>
                ))}
              </select>
            </Field>
            <Field label="Year">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-base font-semibold text-foreground">Fee Heads to Include</h3>
          <p className="text-xs text-muted-foreground">Tick the heads applicable to this cycle.</p>
          <div className="mt-4 divide-y divide-border">
            {feeStructure.map((f) => {
              const checked = selected.has(f.id);
              return (
                <label
                  key={f.id}
                  className="flex cursor-pointer items-center justify-between gap-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(f.id)}
                      className="h-4 w-4 accent-[#22C55E]"
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{f.head}</p>
                      <p className="text-xs text-muted-foreground">
                        {f.category} • {f.frequency}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {INR.format(f.amount)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Summary
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            <SummaryRow icon={CalendarClock} label="Semester" value={semester} tint="#2563EB" />
            <SummaryRow icon={Users} label="Target students" value={`${targetCount}`} tint="#7B4CED" />
            <SummaryRow
              icon={IndianRupee}
              label="Per student"
              value={INR.format(perStudent)}
              tint="#F59E0B"
            />
            <div className="mt-2 rounded-lg bg-[#22C55E]/10 p-4">
              <p className="text-xs uppercase tracking-wide text-[#16A34A]">Grand Total</p>
              <p className="mt-1 text-2xl font-bold text-[#16A34A]">{INR.format(grandTotal)}</p>
            </div>
          </div>
          <Button
            onClick={handleGenerate}
            className="mt-5 w-full bg-[#22C55E] hover:bg-[#16A34A]"
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" /> Generate Invoices
          </Button>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Invoices become pending until paid.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border p-3">
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md"
          style={{ backgroundColor: `${tint}1a`, color: tint }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
