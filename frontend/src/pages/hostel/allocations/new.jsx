import { useMemo, useState } from "react";
import { createFileRoute } from "@/routes/compat";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  Blocks as BlocksIcon,
  Layers,
  DoorClosed,
  BedDouble,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/hostel/StatusPill";
import { cn } from "@/lib/utils";
import {
  beds,
  blocks,
  floors,
  hostels,
  rooms,
  students
} from "@/lib/hostel-data";
import { toast } from "sonner";
const Route = createFileRoute("/hostel-admin/allocation/new")({
  component: AllocateWizardPage
});
const STEPS = [
  { key: "student", label: "Student", icon: User },
  { key: "hostel", label: "Hostel", icon: Building2 },
  { key: "block", label: "Block", icon: BlocksIcon },
  { key: "floor", label: "Floor", icon: Layers },
  { key: "room", label: "Room", icon: DoorClosed },
  { key: "bed", label: "Bed", icon: BedDouble }
];
function AllocateWizardPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [q, setQ] = useState("");
  const [studentId, setStudentId] = useState(null);
  const [hostelId, setHostelId] = useState(null);
  const [blockId, setBlockId] = useState(null);
  const [floorId, setFloorId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [bedId, setBedId] = useState(null);
  const student = students.find((s) => s.id === studentId);
  const hostel = hostels.find((h) => h.id === hostelId);
  const block = blocks.find((b) => b.id === blockId);
  const floor = floors.find((f) => f.id === floorId);
  const room = rooms.find((r) => r.id === roomId);
  const bed = beds.find((b) => b.id === bedId);
  const filteredStudents = useMemo(
    () => students.filter((s) => {
      const hay = `${s.name} ${s.enrollment} ${s.department}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    }),
    [q]
  );
  const blocksInHostel = blocks.filter((b) => b.hostelId === hostelId);
  const floorsInBlock = floors.filter((f) => f.blockId === blockId);
  const roomsOnFloor = rooms.filter((r) => r.floorId === floorId);
  const bedsInRoom = beds.filter((b) => b.roomId === roomId);
  const canNext = step === 0 && !!studentId || step === 1 && !!hostelId || step === 2 && !!blockId || step === 3 && !!floorId || step === 4 && !!roomId || step === 5 && !!bedId;
  const next = () => setStep((s) => Math.min(5, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const submit = () => {
    if (!student || !hostel || !block || !floor || !room || !bed) return;
    toast.success(
      `${student.name} allocated \u2192 ${hostel.name} \xB7 ${block.name} \xB7 Floor ${floor.number} \xB7 Room ${room.number} \xB7 ${bed.number}`
    );
    navigate("/hostel-admin/allocation");
  };
  const availPct = (occ, cap) => cap === 0 ? 0 : Math.round((cap - occ) / cap * 100);
  return <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      {
    /* Wizard */
  }
      <div className="flex flex-col gap-5">
        {
    /* Stepper */
  }
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <ol className="flex items-center gap-1 overflow-x-auto">
            {STEPS.map((s, i) => {
    const active = i === step;
    const done = i < step;
    return <li key={s.key} className="flex flex-1 items-center gap-1">
                  <button
      type="button"
      onClick={() => i <= step && setStep(i)}
      className={cn(
        "group flex min-w-max items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
        active && "bg-[#7B4CED]/10 text-[#7B4CED]",
        done && "text-[#22C55E] hover:bg-muted",
        !active && !done && "text-muted-foreground"
      )}
    >
                    <span
      className={cn(
        "grid h-6 w-6 place-items-center rounded-full border text-[10px] font-semibold",
        active && "border-[#7B4CED] bg-[#7B4CED] text-white",
        done && "border-[#22C55E] bg-[#22C55E] text-white",
        !active && !done && "border-border bg-background"
      )}
    >
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />}
                </li>;
  })}
          </ol>
        </div>

        {
    /* Panel */
  }
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#7B4CED]/10 text-[#7B4CED]">
              {(() => {
    const Icon = STEPS[step].icon;
    return <Icon className="h-4 w-4" />;
  })()}
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Step {step + 1} · Select {STEPS[step].label}
              </h2>
              <p className="text-xs text-muted-foreground">
                {step === 0 && "Search and pick the student to allocate."}
                {step === 1 && "Choose the hostel building."}
                {step === 2 && "Choose a block within the hostel."}
                {step === 3 && "Choose the floor within the block."}
                {step === 4 && "Choose an available room."}
                {step === 5 && "Pick a specific bed to finalise the allocation."}
              </p>
            </div>
          </div>

          {
    /* STUDENT */
  }
          {step === 0 && <>
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
    value={q}
    onChange={(e) => setQ(e.target.value)}
    placeholder="Search by name, enrollment or department…"
    className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground"
  />
              </div>
              <div className="grid max-h-[420px] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2">
                {filteredStudents.map((s) => {
    const selected = studentId === s.id;
    return <button
      key={s.id}
      type="button"
      onClick={() => setStudentId(s.id)}
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
        selected ? "border-[#7B4CED] bg-[#7B4CED]/5 ring-2 ring-[#7B4CED]/30" : "border-border hover:border-[#7B4CED]/40 hover:bg-muted/40"
      )}
    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-xs font-semibold text-white">
                        {s.photo}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{s.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {s.enrollment} · {s.department} · Year {s.year}
                        </p>
                      </div>
                      {selected && <Check className="h-4 w-4 text-[#7B4CED]" />}
                    </button>;
  })}
              </div>
            </>}

          {
    /* HOSTEL */
  }
          {step === 1 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {hostels.map((h) => {
    const selected = hostelId === h.id;
    const disabled = h.status !== "Active";
    const pct = availPct(h.occupied, h.capacity);
    return <button
      key={h.id}
      type="button"
      disabled={disabled}
      onClick={() => {
        setHostelId(h.id);
        setBlockId(null);
        setFloorId(null);
        setRoomId(null);
        setBedId(null);
      }}
      className={cn(
        "rounded-xl border p-4 text-left transition-all disabled:opacity-50",
        selected ? "border-[#7B4CED] bg-[#7B4CED]/5 ring-2 ring-[#7B4CED]/30" : "border-border hover:border-[#7B4CED]/40 hover:bg-muted/40"
      )}
    >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{h.name}</p>
                        <p className="text-xs text-muted-foreground">{h.type} · {h.blocks} blocks</p>
                      </div>
                      <StatusPill status={h.status} />
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{h.capacity - h.occupied} beds available</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="mt-1 h-1.5 rounded-full bg-muted">
                        <div
      className="h-1.5 rounded-full bg-[#22C55E]"
      style={{ width: `${pct}%` }}
    />
                      </div>
                    </div>
                  </button>;
  })}
            </div>}

          {
    /* BLOCK */
  }
          {step === 2 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {blocksInHostel.map((b) => {
    const selected = blockId === b.id;
    const disabled = b.status !== "Active";
    const avail = b.totalRooms - b.occupiedRooms;
    const pct = availPct(b.occupiedRooms, b.totalRooms);
    return <button
      key={b.id}
      type="button"
      disabled={disabled}
      onClick={() => {
        setBlockId(b.id);
        setFloorId(null);
        setRoomId(null);
        setBedId(null);
      }}
      className={cn(
        "rounded-xl border p-4 text-left transition-all disabled:opacity-50",
        selected ? "border-[#7B4CED] bg-[#7B4CED]/5 ring-2 ring-[#7B4CED]/30" : "border-border hover:border-[#7B4CED]/40 hover:bg-muted/40"
      )}
    >
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                        <BlocksIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.floors} floors</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between text-xs">
                      <span className="text-muted-foreground">{avail} rooms free</span>
                      <StatusPill status={b.status} />
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-muted">
                      <div className="h-1.5 rounded-full bg-[#22C55E]" style={{ width: `${pct}%` }} />
                    </div>
                  </button>;
  })}
            </div>}

          {
    /* FLOOR */
  }
          {step === 3 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {floorsInBlock.map((f) => {
    const selected = floorId === f.id;
    const disabled = f.status !== "Active";
    const avail = f.totalRooms - f.occupiedRooms;
    return <button
      key={f.id}
      type="button"
      disabled={disabled}
      onClick={() => {
        setFloorId(f.id);
        setRoomId(null);
        setBedId(null);
      }}
      className={cn(
        "rounded-xl border p-4 text-left transition-all disabled:opacity-50",
        selected ? "border-[#7B4CED] bg-[#7B4CED]/5 ring-2 ring-[#7B4CED]/30" : "border-border hover:border-[#7B4CED]/40 hover:bg-muted/40"
      )}
    >
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#7B4CED]/10 text-[#7B4CED]">
                        <Layers className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Floor {f.number}</p>
                        <p className="text-xs text-muted-foreground">{f.totalRooms} rooms</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{avail} rooms available</p>
                  </button>;
  })}
            </div>}

          {
    /* ROOM */
  }
          {step === 4 && <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {roomsOnFloor.map((r) => {
    const selected = roomId === r.id;
    const disabled = r.status === "Maintenance" || r.occupied >= r.beds;
    const avail = r.beds - r.occupied;
    return <button
      key={r.id}
      type="button"
      disabled={disabled}
      onClick={() => {
        setRoomId(r.id);
        setBedId(null);
      }}
      className={cn(
        "rounded-xl border p-4 text-left transition-all disabled:opacity-50",
        selected ? "border-[#7B4CED] bg-[#7B4CED]/5 ring-2 ring-[#7B4CED]/30" : "border-border hover:border-[#7B4CED]/40 hover:bg-muted/40"
      )}
    >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Room {r.number}</p>
                        <p className="text-xs text-muted-foreground">{r.type} · ₹{r.rent?.toLocaleString()}/mo</p>
                      </div>
                      <StatusPill status={r.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {r.occupied}/{r.beds} occupied
                      </span>
                      <span className={cn("font-medium", avail > 0 ? "text-[#22C55E]" : "text-[#DC2626]")}>
                        {avail} free
                      </span>
                    </div>
                    <div className="mt-2 flex gap-1">
                      {Array.from({ length: r.beds }).map((_, i) => <span
      key={i}
      className={cn(
        "h-2 flex-1 rounded",
        i < r.occupied ? "bg-[#7B4CED]" : "bg-[#22C55E]/40"
      )}
    />)}
                    </div>
                  </button>;
  })}
            </div>}

          {
    /* BED */
  }
          {step === 5 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {bedsInRoom.map((b) => {
    const selected = bedId === b.id;
    const disabled = b.status !== "Available";
    return <button
      key={b.id}
      type="button"
      disabled={disabled}
      onClick={() => setBedId(b.id)}
      className={cn(
        "rounded-xl border p-4 text-center transition-all disabled:opacity-50",
        selected ? "border-[#7B4CED] bg-[#7B4CED]/5 ring-2 ring-[#7B4CED]/30" : "border-border hover:border-[#7B4CED]/40 hover:bg-muted/40"
      )}
    >
                    <BedDouble
      className={cn(
        "mx-auto h-8 w-8",
        b.status === "Available" && "text-[#22C55E]",
        b.status === "Occupied" && "text-[#7B4CED]",
        b.status === "Reserved" && "text-[#3B82F6]",
        b.status === "Maintenance" && "text-[#EAB308]"
      )}
    />
                    <p className="mt-2 text-sm font-semibold text-foreground">{b.number}</p>
                    <p className="text-[11px] text-muted-foreground">{b.type}</p>
                    <div className="mt-2 flex justify-center">
                      <StatusPill status={b.status} />
                    </div>
                  </button>;
  })}
              {bedsInRoom.length === 0 && <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
                  No beds configured for this room.
                </p>}
            </div>}
        </div>

        {
    /* Nav buttons */
  }
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={back} disabled={step === 0}>
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Button>
          {step < 5 ? <Button className="bg-[#7B4CED] hover:bg-[#6a3dd6]" onClick={next} disabled={!canNext}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button> : <Button
    className="bg-[#22C55E] hover:bg-[#16A34A]"
    onClick={submit}
    disabled={!canNext}
  >
              <Sparkles className="mr-1.5 h-4 w-4" /> Confirm Allocation
            </Button>}
        </div>
      </div>

      {
    /* Summary */
  }
      <aside className="rounded-xl border border-border bg-card p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <h3 className="text-sm font-semibold text-foreground">Allocation Summary</h3>
        <p className="text-xs text-muted-foreground">Review before confirming.</p>
        <ul className="mt-4 space-y-3 text-sm">
          <SummaryRow icon={User} label="Student" value={student ? `${student.name} \xB7 ${student.enrollment}` : "\u2014"} />
          <SummaryRow icon={Building2} label="Hostel" value={hostel?.name ?? "\u2014"} />
          <SummaryRow icon={BlocksIcon} label="Block" value={block?.name ?? "\u2014"} />
          <SummaryRow icon={Layers} label="Floor" value={floor ? `Floor ${floor.number}` : "\u2014"} />
          <SummaryRow
    icon={DoorClosed}
    label="Room"
    value={room ? `Room ${room.number} (${room.type})` : "\u2014"}
  />
          <SummaryRow icon={BedDouble} label="Bed" value={bed ? `${bed.number} \xB7 ${bed.type}` : "\u2014"} />
        </ul>
        {room && <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <p><span className="font-medium text-foreground">Rent:</span> ₹{room.rent?.toLocaleString()}/mo</p>
            <p className="mt-1"><span className="font-medium text-foreground">Amenities:</span> {room.amenities?.join(", ") || "\u2014"}</p>
          </div>}
      </aside>
    </div>;
}
function SummaryRow({
  icon: Icon,
  label,
  value
}) {
  const filled = value !== "\u2014";
  return <li className="flex items-start gap-2">
      <span
    className={cn(
      "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md",
      filled ? "bg-[#7B4CED]/10 text-[#7B4CED]" : "bg-muted text-muted-foreground"
    )}
  >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={cn("truncate text-sm", filled ? "font-medium text-foreground" : "text-muted-foreground")}>
          {value}
        </p>
      </div>
    </li>;
}
export {
  Route
};
