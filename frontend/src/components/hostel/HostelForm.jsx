import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Save, X, Building2, MapPin, UserCog, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
function Section({ title, icon, children }) {
  return <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>;
}
function Field({ label, children, required, span }) {
  return <label className={`flex flex-col gap-1.5 text-sm ${span ? "md:col-span-2" : ""}`}>
      <span className="font-medium text-foreground">{label}{required && <span className="text-[#EF4444]"> *</span>}</span>
      {children}
    </label>;
}
const selectCls = "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground";
function HostelForm({ initial, mode }) {
  const navigate = useNavigate();
  const [d, setD] = useState({
    name: initial?.name ?? "",
    type: initial?.type ?? "Boys",
    address: initial?.address ?? "",
    capacity: initial?.capacity ?? 0,
    floors: initial?.floors ?? 1,
    blocks: initial?.blocks ?? 1,
    warden: initial?.warden ?? "",
    wardenContact: initial?.wardenContact ?? "",
    establishedYear: initial?.establishedYear ?? (/* @__PURE__ */ new Date()).getFullYear(),
    status: initial?.status ?? "Active",
    amenities: initial?.amenities?.join(", ") ?? ""
  });
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const submit = (e) => {
    e.preventDefault();
    navigate({ to: "/hostel-admin/hostels" });
  };
  return <form onSubmit={submit} className="flex flex-col gap-5">
      <Section title="Hostel Information" icon={<Building2 className="h-4 w-4" />}>
        <Field label="Hostel Name" required><Input value={d.name} onChange={(e) => set("name", e.target.value)} required /></Field>
        <Field label="Hostel Type" required>
          <select className={selectCls} value={d.type} onChange={(e) => set("type", e.target.value)}>
            <option>Boys</option><option>Girls</option><option>Co-ed</option>
          </select>
        </Field>
        <Field label="Address" span required>
          <Input value={d.address} onChange={(e) => set("address", e.target.value)} required />
        </Field>
        <Field label="Established Year"><Input type="number" value={d.establishedYear} onChange={(e) => set("establishedYear", Number(e.target.value))} /></Field>
        <Field label="Status" required>
          <select className={selectCls} value={d.status} onChange={(e) => set("status", e.target.value)}>
            <option>Active</option><option>Under Maintenance</option><option>Inactive</option>
          </select>
        </Field>
      </Section>

      <Section title="Capacity & Structure" icon={<MapPin className="h-4 w-4" />}>
        <Field label="Total Capacity (Beds)" required><Input type="number" value={d.capacity} onChange={(e) => set("capacity", Number(e.target.value))} required /></Field>
        <Field label="Number of Floors" required><Input type="number" value={d.floors} onChange={(e) => set("floors", Number(e.target.value))} required /></Field>
        <Field label="Number of Blocks"><Input type="number" value={d.blocks} onChange={(e) => set("blocks", Number(e.target.value))} /></Field>
      </Section>

      <Section title="Warden Assignment" icon={<UserCog className="h-4 w-4" />}>
        <Field label="Hostel Warden" required><Input value={d.warden} onChange={(e) => set("warden", e.target.value)} required /></Field>
        <Field label="Warden Contact"><Input value={d.wardenContact} onChange={(e) => set("wardenContact", e.target.value)} placeholder="+91 …" /></Field>
      </Section>

      <Section title="Amenities" icon={<Sparkles className="h-4 w-4" />}>
        <Field label="Amenities (comma separated)" span>
          <Input value={d.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Wi-Fi, Mess, Gym, Laundry" />
        </Field>
      </Section>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline" type="button">
          <Link to="/hostel-admin/hostels"><X className="mr-1.5 h-4 w-4" /> Cancel</Link>
        </Button>
        <Button type="submit" className="bg-[#2563EB] hover:bg-[#1e4fd1]">
          <Save className="mr-1.5 h-4 w-4" /> {mode === "add" ? "Create Hostel" : "Save Changes"}
        </Button>
      </div>
    </form>;
}
export {
  HostelForm
};
