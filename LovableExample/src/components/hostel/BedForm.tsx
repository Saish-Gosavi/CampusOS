import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  beds,
  rooms,
  hostels,
  blocks,
  students,
  type Bed,
  type BedStatus,
  type BedType,
} from "@/lib/hostel-data";

type Props = { mode: "add" | "edit"; bed?: Bed };

const STATUSES: BedStatus[] = ["Available", "Occupied", "Reserved", "Maintenance"];
const TYPES: BedType[] = ["Single", "Bunk-Upper", "Bunk-Lower"];

export function BedForm({ mode, bed }: Props) {
  const navigate = useNavigate();
  const initial = bed ?? beds[0];

  const [form, setForm] = useState({
    number: mode === "edit" ? initial.number : "",
    roomId: mode === "edit" ? initial.roomId : rooms[0]?.id ?? "",
    studentId: mode === "edit" ? initial.studentId ?? "" : "",
    type: mode === "edit" ? initial.type : ("Single" as BedType),
    status: mode === "edit" ? initial.status : ("Available" as BedStatus),
    notes: mode === "edit" ? initial.notes ?? "" : "",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const roomMeta = useMemo(() => {
    const r = rooms.find((x) => x.id === form.roomId);
    if (!r) return null;
    const blk = blocks.find((b) => b.id === r.blockId);
    const hst = hostels.find((h) => h.id === r.hostelId);
    return { room: r, block: blk, hostel: hst };
  }, [form.roomId]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/hostel-admin/beds" });
  };

  const selectCls =
    "h-10 rounded-lg border border-border bg-background px-3 text-sm";

  const Field = ({
    label,
    children,
    hint,
  }: {
    label: string;
    children: React.ReactNode;
    hint?: string;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );

  const showStudent = form.status === "Occupied" || form.status === "Reserved";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">
          Bed Information
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Bed Number">
            <Input
              required
              value={form.number}
              onChange={(e) => set("number", e.target.value)}
              placeholder="e.g. B1"
            />
          </Field>

          <Field
            label="Room"
            hint={
              roomMeta
                ? `${roomMeta.hostel?.name ?? "—"} · ${roomMeta.block?.name ?? "—"} · Floor ${roomMeta.room.floor ?? "—"}`
                : undefined
            }
          >
            <select
              required
              className={selectCls}
              value={form.roomId}
              onChange={(e) => set("roomId", e.target.value)}
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Room {r.number} · Block {r.block}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Bed Type">
            <select
              className={selectCls}
              value={form.type}
              onChange={(e) => set("type", e.target.value as BedType)}
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              className={selectCls}
              value={form.status}
              onChange={(e) => set("status", e.target.value as BedStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field
            label={form.status === "Reserved" ? "Reserved For" : "Assigned Student"}
            hint={
              !showStudent
                ? "Available or Maintenance beds are not assigned to students."
                : undefined
            }
          >
            <select
              className={selectCls}
              value={form.studentId}
              onChange={(e) => set("studentId", e.target.value)}
              disabled={!showStudent}
            >
              <option value="">— None —</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.enrollment}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Notes">
            <Input
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Optional remarks"
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <Link to="/hostel-admin/beds">
            <X className="mr-1.5 h-4 w-4" /> Cancel
          </Link>
        </Button>
        <Button type="submit" className="bg-[#2563EB] hover:bg-[#1e4fd1]">
          <Save className="mr-1.5 h-4 w-4" />{" "}
          {mode === "add" ? "Create Bed" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
