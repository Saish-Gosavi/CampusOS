import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, Search, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/hostel/StatusPill";
import { furnitureItems, students, rooms } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/furniture/assign")({
  component: AssignFurniturePage
});
function AssignFurniturePage() {
  const [itemId, setItemId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [query, setQuery] = useState("");
  const unassigned = useMemo(
    () => furnitureItems.filter((f) => f.status === "In Storage" || !f.assignedTo),
    []
  );
  const rows = useMemo(() => {
    let list = furnitureItems.filter((f) => f.assignedTo);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) => f.code.toLowerCase().includes(q) || (f.assignedTo ?? "").toLowerCase().includes(q) || f.room.toLowerCase().includes(q)
      );
    }
    return list;
  }, [query]);
  const submit = () => {
    if (!itemId || !studentId || !roomNo) {
      toast.error("Select item, student and room");
      return;
    }
    const item = furnitureItems.find((f) => f.id === itemId);
    const stu = students.find((s) => s.id === studentId);
    toast.success(`${item?.code} assigned to ${stu?.name} \xB7 Room ${roomNo}`);
    setItemId("");
    setStudentId("");
    setRoomNo("");
  };
  return <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ backgroundColor: "#7B4CED1A", color: "#7B4CED" }}>
            <UserPlus className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold text-foreground">Assign Furniture</h2>
            <p className="text-xs text-muted-foreground">Allocate an available item to a student and room.</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Field label="Furniture Item">
            <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">Select item…</option>
              {unassigned.map((f) => <option key={f.id} value={f.id}>{f.code} · {f.category}</option>)}
              {furnitureItems.filter((f) => f.status === "In Use").slice(0, 6).map((f) => <option key={f.id} value={f.id}>{f.code} · {f.category} (reassign)</option>)}
            </select>
          </Field>
          <Field label="Student">
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">Select student…</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.enrollment}</option>)}
            </select>
          </Field>
          <Field label="Room">
            <select value={roomNo} onChange={(e) => setRoomNo(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
              <option value="">Select room…</option>
              {rooms.map((r) => <option key={r.id} value={r.number}>Block {r.block} · {r.number}</option>)}
            </select>
          </Field>
          <div className="flex items-end">
            <Button onClick={submit} style={{ backgroundColor: "#7B4CED" }} className="w-full text-white hover:opacity-90">
              Assign <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-sm font-semibold text-foreground">Current Assignments</h3>
          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search item, student, room" className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm" />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Furniture ID</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Assigned To</th>
                <th className="px-3 py-2 font-medium">Room</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((f) => <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-semibold">{f.code}</td>
                  <td className="whitespace-nowrap px-3 py-3">{f.category}</td>
                  <td className="whitespace-nowrap px-3 py-3">{f.assignedTo}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{f.hostel} · {f.room}</td>
                  <td className="px-3 py-3"><StatusPill status={f.status} /></td>
                  <td className="px-3 py-3 text-right">
                    <button onClick={() => toast.success(`${f.code} unassigned`)} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">
                      Unassign
                    </button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
function Field({ label, children }) {
  return <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>;
}
export {
  Route
};
