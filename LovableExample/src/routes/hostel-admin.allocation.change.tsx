import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Repeat, User, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/hostel/StatusPill";
import { cn } from "@/lib/utils";
import {
  allocations,
  beds,
  blocks,
  floors,
  hostels,
  rooms,
  students,
} from "@/lib/hostel-data";
import { toast } from "sonner";

export const Route = createFileRoute("/hostel-admin/allocation/change")({
  component: RoomChangePage,
});

function RoomChangePage() {
  const navigate = useNavigate();
  const activeAllocs = allocations.filter((a) => a.status === "Active");
  const [allocId, setAllocId] = useState(activeAllocs[0]?.id ?? "");
  const [newHostelId, setNewHostelId] = useState("");
  const [newBlockId, setNewBlockId] = useState("");
  const [newFloorId, setNewFloorId] = useState("");
  const [newRoomId, setNewRoomId] = useState("");
  const [newBedId, setNewBedId] = useState("");
  const [reason, setReason] = useState("");

  const alloc = allocations.find((a) => a.id === allocId);
  const student = students.find((s) => s.id === alloc?.studentId);
  const curHostel = hostels.find((h) => h.id === alloc?.hostelId);
  const curBlock = blocks.find((b) => b.id === alloc?.blockId);
  const curFloor = floors.find((f) => f.id === alloc?.floorId);
  const curRoom = rooms.find((r) => r.id === alloc?.roomId);
  const curBed = beds.find((b) => b.id === alloc?.bedId);

  const blockOpts = useMemo(() => blocks.filter((b) => b.hostelId === newHostelId), [newHostelId]);
  const floorOpts = useMemo(() => floors.filter((f) => f.blockId === newBlockId), [newBlockId]);
  const roomOpts = useMemo(
    () => rooms.filter((r) => r.floorId === newFloorId && r.status !== "Maintenance" && r.occupied < r.beds),
    [newFloorId],
  );
  const bedOpts = useMemo(
    () => beds.filter((b) => b.roomId === newRoomId && b.status === "Available"),
    [newRoomId],
  );

  const newHostel = hostels.find((h) => h.id === newHostelId);
  const newBlock = blocks.find((b) => b.id === newBlockId);
  const newFloor = floors.find((f) => f.id === newFloorId);
  const newRoom = rooms.find((r) => r.id === newRoomId);
  const newBed = beds.find((b) => b.id === newBedId);

  const canSubmit = alloc && newBedId;

  const submit = () => {
    if (!canSubmit) return;
    toast.success(
      `${student?.name} transferred from ${curRoom?.number} → ${newRoom?.number} (${newBed?.number})`,
    );
    navigate({ to: "/hostel-admin/allocation" });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
      {/* Current */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
            <User className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">Current Allocation</h2>
            <p className="text-xs text-muted-foreground">Select the student to move.</p>
          </div>
        </div>

        <label className="mb-1 block text-xs font-medium text-muted-foreground">Student allocation</label>
        <select
          value={allocId}
          onChange={(e) => setAllocId(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground"
        >
          {activeAllocs.map((a) => {
            const s = students.find((x) => x.id === a.studentId);
            const r = rooms.find((x) => x.id === a.roomId);
            const b = beds.find((x) => x.id === a.bedId);
            return (
              <option key={a.id} value={a.id}>
                {s?.name} — Room {r?.number} · {b?.number}
              </option>
            );
          })}
        </select>

        {alloc && student && (
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                {student.photo}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{student.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {student.enrollment} · {student.department} · Year {student.year}
                </p>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <Info label="Hostel" value={curHostel?.name ?? "—"} />
              <Info label="Block" value={curBlock?.name ?? "—"} />
              <Info label="Floor" value={curFloor ? `Floor ${curFloor.number}` : "—"} />
              <Info label="Room" value={curRoom ? `${curRoom.number} (${curRoom.type})` : "—"} />
              <Info label="Bed" value={curBed ? `${curBed.number} · ${curBed.type}` : "—"} />
              <Info label="Allocated" value={alloc.allocatedOn} />
            </dl>
          </div>
        )}
      </div>

      {/* New destination */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#7B4CED]/10 text-[#7B4CED]">
            <Repeat className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">New Destination</h2>
            <p className="text-xs text-muted-foreground">Cascade through hostel → block → floor → room → bed.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select
            label="Hostel"
            value={newHostelId}
            onChange={(v) => {
              setNewHostelId(v);
              setNewBlockId("");
              setNewFloorId("");
              setNewRoomId("");
              setNewBedId("");
            }}
            options={hostels.filter((h) => h.status === "Active").map((h) => ({ value: h.id, label: h.name }))}
            placeholder="Select hostel"
          />
          <Select
            label="Block"
            value={newBlockId}
            onChange={(v) => {
              setNewBlockId(v);
              setNewFloorId("");
              setNewRoomId("");
              setNewBedId("");
            }}
            options={blockOpts.map((b) => ({ value: b.id, label: b.name }))}
            placeholder={newHostelId ? "Select block" : "Choose hostel first"}
            disabled={!newHostelId}
          />
          <Select
            label="Floor"
            value={newFloorId}
            onChange={(v) => {
              setNewFloorId(v);
              setNewRoomId("");
              setNewBedId("");
            }}
            options={floorOpts.map((f) => ({ value: f.id, label: `Floor ${f.number}` }))}
            placeholder={newBlockId ? "Select floor" : "Choose block first"}
            disabled={!newBlockId}
          />
          <Select
            label="Room"
            value={newRoomId}
            onChange={(v) => {
              setNewRoomId(v);
              setNewBedId("");
            }}
            options={roomOpts.map((r) => ({
              value: r.id,
              label: `${r.number} · ${r.beds - r.occupied} free`,
            }))}
            placeholder={newFloorId ? "Select room" : "Choose floor first"}
            disabled={!newFloorId}
          />
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Bed</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {bedOpts.map((b) => {
                const selected = newBedId === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setNewBedId(b.id)}
                    className={cn(
                      "rounded-lg border p-3 text-center text-xs transition-colors",
                      selected
                        ? "border-[#7B4CED] bg-[#7B4CED]/5 ring-2 ring-[#7B4CED]/30"
                        : "border-border hover:border-[#7B4CED]/40",
                    )}
                  >
                    <BedDouble className="mx-auto h-5 w-5 text-[#22C55E]" />
                    <p className="mt-1 font-semibold text-foreground">{b.number}</p>
                    <p className="text-[10px] text-muted-foreground">{b.type}</p>
                  </button>
                );
              })}
              {newRoomId && bedOpts.length === 0 && (
                <p className="col-span-full py-3 text-center text-xs text-muted-foreground">
                  No beds available in this room.
                </p>
              )}
              {!newRoomId && (
                <p className="col-span-full py-3 text-center text-xs text-muted-foreground">
                  Choose a room to see beds.
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Reason for change</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              placeholder="e.g. medical, roommate conflict, upgrade…"
              className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground"
            />
          </div>
        </div>

        {newBed && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-dashed border-[#7B4CED]/50 bg-[#7B4CED]/5 p-3 text-sm">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Moving to</p>
              <p className="truncate font-medium text-foreground">
                {newHostel?.name} · {newBlock?.name} · Floor {newFloor?.number} · Room {newRoom?.number} · {newBed?.number}
              </p>
            </div>
            <StatusPill status="Reserved" />
          </div>
        )}

        <Button
          className="mt-5 w-full bg-[#7B4CED] hover:bg-[#6a3dd6]"
          onClick={submit}
          disabled={!canSubmit}
        >
          Confirm Room Change <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="truncate font-medium text-foreground">{value}</dd>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
