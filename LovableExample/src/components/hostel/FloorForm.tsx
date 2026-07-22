import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { blocks, hostels, floors, type Floor } from "@/lib/hostel-data";

type Props = { mode: "add" | "edit"; floor?: Floor };

export function FloorForm({ mode, floor }: Props) {
  const navigate = useNavigate();
  const initial = floor ?? floors[0];
  const initialBlock = blocks.find((b) => b.id === initial.blockId);

  const [hostelId, setHostelId] = useState<string>(
    mode === "edit" ? initialBlock?.hostelId ?? hostels[0]?.id ?? "" : hostels[0]?.id ?? "",
  );
  const [form, setForm] = useState({
    number: mode === "edit" ? initial.number : 1,
    blockId: mode === "edit" ? initial.blockId : "",
    totalRooms: mode === "edit" ? initial.totalRooms : 12,
    status: mode === "edit" ? initial.status : "Active" as Floor["status"],
  });

  const availableBlocks = useMemo(
    () => blocks.filter((b) => b.hostelId === hostelId),
    [hostelId],
  );

  // ensure blockId matches selected hostel
  const currentBlockId =
    availableBlocks.some((b) => b.id === form.blockId)
      ? form.blockId
      : availableBlocks[0]?.id ?? "";

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/hostel-admin/floors" });
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );

  const selectCls = "h-10 rounded-lg border border-border bg-background px-3 text-sm";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">Floor Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Hostel">
            <select
              required
              className={selectCls}
              value={hostelId}
              onChange={(e) => {
                setHostelId(e.target.value);
                const first = blocks.find((b) => b.hostelId === e.target.value);
                set("blockId", first?.id ?? "");
              }}
            >
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Block">
            <select
              required
              className={selectCls}
              value={currentBlockId}
              onChange={(e) => set("blockId", e.target.value)}
            >
              {availableBlocks.length === 0 && <option value="">No blocks available</option>}
              {availableBlocks.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Floor Number">
            <Input
              type="number"
              min={0}
              required
              value={form.number}
              onChange={(e) => set("number", Number(e.target.value))}
              placeholder="e.g. 1"
            />
          </Field>
          <Field label="Total Rooms">
            <Input
              type="number"
              min={0}
              required
              value={form.totalRooms}
              onChange={(e) => set("totalRooms", Number(e.target.value))}
            />
          </Field>
          <Field label="Status">
            <select
              className={selectCls}
              value={form.status}
              onChange={(e) => set("status", e.target.value as Floor["status"])}
            >
              {["Active", "Under Maintenance", "Inactive"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <Link to="/hostel-admin/floors"><X className="mr-1.5 h-4 w-4" /> Cancel</Link>
        </Button>
        <Button type="submit" className="bg-[#7B4CED] hover:bg-[#6a3dd6]">
          <Save className="mr-1.5 h-4 w-4" /> {mode === "add" ? "Create Floor" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
