import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { hostels, blocks, floors, rooms, type Room, type RoomType } from "@/lib/hostel-data";

type Props = { mode: "add" | "edit"; room?: Room };

const ROOM_TYPES: RoomType[] = ["Single", "Double", "Triple", "Dormitory", "Deluxe"];
const AMENITY_OPTIONS = ["Wi-Fi", "Attached Bath", "AC", "Study Table", "Wardrobe", "Balcony", "Mini Fridge", "Lockers"];

export function RoomForm({ mode, room }: Props) {
  const navigate = useNavigate();
  const initial = room ?? rooms[0];
  const initialBlock = blocks.find((b) => b.id === initial.blockId);

  const [hostelId, setHostelId] = useState<string>(
    mode === "edit" ? initialBlock?.hostelId ?? hostels[0]?.id ?? "" : hostels[0]?.id ?? "",
  );
  const [blockId, setBlockId] = useState<string>(
    mode === "edit" ? initial.blockId ?? "" : "",
  );
  const [form, setForm] = useState({
    number: mode === "edit" ? initial.number : "",
    floorId: mode === "edit" ? initial.floorId ?? "" : "",
    type: (mode === "edit" ? initial.type ?? "Double" : "Double") as RoomType,
    capacity: mode === "edit" ? initial.beds : 2,
    occupied: mode === "edit" ? initial.occupied : 0,
    rent: mode === "edit" ? initial.rent ?? 8500 : 8500,
    status: (mode === "edit" ? initial.status : "Available") as Room["status"],
    description: mode === "edit" ? initial.description ?? "" : "",
    amenities: mode === "edit" ? initial.amenities ?? [] : [],
  });

  const availableBlocks = useMemo(
    () => blocks.filter((b) => b.hostelId === hostelId),
    [hostelId],
  );
  const currentBlockId =
    availableBlocks.some((b) => b.id === blockId) ? blockId : availableBlocks[0]?.id ?? "";
  const availableFloors = useMemo(
    () => floors.filter((f) => f.blockId === currentBlockId),
    [currentBlockId],
  );
  const currentFloorId =
    availableFloors.some((f) => f.id === form.floorId) ? form.floorId : availableFloors[0]?.id ?? "";

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const toggleAmenity = (a: string) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/hostel-admin/rooms" });
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );

  const selectCls = "h-10 rounded-lg border border-border bg-background px-3 text-sm";
  const available = Math.max(0, form.capacity - form.occupied);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">Location</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Hostel">
            <select
              required
              className={selectCls}
              value={hostelId}
              onChange={(e) => {
                setHostelId(e.target.value);
                const first = blocks.find((b) => b.hostelId === e.target.value);
                setBlockId(first?.id ?? "");
                const firstFloor = floors.find((f) => f.blockId === first?.id);
                set("floorId", firstFloor?.id ?? "");
              }}
            >
              {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </Field>
          <Field label="Block">
            <select
              required
              className={selectCls}
              value={currentBlockId}
              onChange={(e) => {
                setBlockId(e.target.value);
                const firstFloor = floors.find((f) => f.blockId === e.target.value);
                set("floorId", firstFloor?.id ?? "");
              }}
            >
              {availableBlocks.length === 0 && <option value="">No blocks</option>}
              {availableBlocks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Floor">
            <select
              required
              className={selectCls}
              value={currentFloorId}
              onChange={(e) => set("floorId", e.target.value)}
            >
              {availableFloors.length === 0 && <option value="">No floors</option>}
              {availableFloors.map((f) => (
                <option key={f.id} value={f.id}>Floor {f.number}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">Room Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Field label="Room Number">
            <Input required value={form.number} onChange={(e) => set("number", e.target.value)} placeholder="e.g. 204" />
          </Field>
          <Field label="Room Type">
            <select className={selectCls} value={form.type} onChange={(e) => set("type", e.target.value as RoomType)}>
              {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select
              className={selectCls}
              value={form.status}
              onChange={(e) => set("status", e.target.value as Room["status"])}
            >
              {["Available", "Occupied", "Maintenance"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Capacity (Beds)">
            <Input type="number" min={1} required value={form.capacity} onChange={(e) => set("capacity", Number(e.target.value))} />
          </Field>
          <Field label="Occupied Beds">
            <Input type="number" min={0} max={form.capacity} required value={form.occupied} onChange={(e) => set("occupied", Number(e.target.value))} />
          </Field>
          <Field label="Available Beds">
            <Input value={available} readOnly className="bg-muted/50" />
          </Field>
          <Field label="Monthly Rent (₹)">
            <Input type="number" min={0} value={form.rent} onChange={(e) => set("rent", Number(e.target.value))} />
          </Field>
          <div className="md:col-span-2 lg:col-span-3">
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
                placeholder="Optional notes about the room"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">Amenities</h3>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => {
            const active = form.amenities.includes(a);
            return (
              <button
                type="button"
                key={a}
                onClick={() => toggleAmenity(a)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-transparent bg-[#7B4CED] text-white"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <Link to="/hostel-admin/rooms"><X className="mr-1.5 h-4 w-4" /> Cancel</Link>
        </Button>
        <Button type="submit" className="bg-[#7B4CED] hover:bg-[#6a3dd6]">
          <Save className="mr-1.5 h-4 w-4" /> {mode === "add" ? "Create Room" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
