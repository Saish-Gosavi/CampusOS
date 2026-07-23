import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { hostels, blocks } from "@/lib/hostel-data";
function BlockForm({ mode, block }) {
  const navigate = useNavigate();
  const initial = block ?? blocks[0];
  const [form, setForm] = useState({
    name: mode === "edit" ? initial.name : "",
    hostelId: mode === "edit" ? initial.hostelId : hostels[0]?.id ?? "",
    floors: mode === "edit" ? initial.floors : 4,
    totalRooms: mode === "edit" ? initial.totalRooms : 40,
    inCharge: mode === "edit" ? initial.inCharge : "",
    status: mode === "edit" ? initial.status : "Active"
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const onSubmit = (e) => {
    e.preventDefault();
    navigate({ to: "/hostel-admin/blocks" });
  };
  const Field = ({ label, children }) => <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>;
  const selectCls = "h-10 rounded-lg border border-border bg-background px-3 text-sm";
  return <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-foreground">Block Information</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Block Name">
            <Input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Block A" />
          </Field>
          <Field label="Hostel">
            <select required className={selectCls} value={form.hostelId} onChange={(e) => set("hostelId", e.target.value)}>
              {hostels.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </Field>
          <Field label="Number of Floors">
            <Input type="number" min={1} required value={form.floors} onChange={(e) => set("floors", Number(e.target.value))} />
          </Field>
          <Field label="Total Rooms">
            <Input type="number" min={0} required value={form.totalRooms} onChange={(e) => set("totalRooms", Number(e.target.value))} />
          </Field>
          <Field label="In-Charge">
            <Input value={form.inCharge} onChange={(e) => set("inCharge", e.target.value)} placeholder="Block in-charge name" />
          </Field>
          <Field label="Status">
            <select className={selectCls} value={form.status} onChange={(e) => set("status", e.target.value)}>
              {["Active", "Under Maintenance", "Inactive"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <Link to="/hostel-admin/blocks"><X className="mr-1.5 h-4 w-4" /> Cancel</Link>
        </Button>
        <Button type="submit" className="bg-[#2563EB] hover:bg-[#1e4fd1]">
          <Save className="mr-1.5 h-4 w-4" /> {mode === "add" ? "Create Block" : "Save Changes"}
        </Button>
      </div>
    </form>;
}
export {
  BlockForm
};
