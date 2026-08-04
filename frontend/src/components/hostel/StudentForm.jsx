import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload, Save, X, User, GraduationCap, Users2, ShieldAlert, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
function Section({ title, icon, children }) {
  return <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>;
}
function Field({ label, children, required }) {
  return <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">
        {label} {required && <span className="text-[#EF4444]">*</span>}
      </span>
      {children}
    </label>;
}
const selectCls = "h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground";
function StudentForm({ initial, mode }) {
  const navigate = useNavigate();
  const [d, setD] = useState({
    name: initial?.name ?? "",
    enrollment: initial?.enrollment ?? "",
    department: initial?.department ?? "Computer",
    year: initial?.year ?? 1,
    gender: initial?.gender ?? "Male",
    dob: initial?.dob ?? "",
    bloodGroup: initial?.bloodGroup ?? "",
    email: initial?.email ?? "",
    contact: initial?.contact ?? "",
    parentContact: initial?.parentContact ?? "",
    address: initial?.address ?? "",
    admissionYear: initial?.admissionYear ?? (/* @__PURE__ */ new Date()).getFullYear(),
    cgpa: initial?.cgpa ?? 0,
    hostel: initial?.hostel ?? "Boys Hostel",
    room: initial?.room ?? "",
    joinedHostel: initial?.joinedHostel ?? "",
    status: initial?.status ?? "Active",
    fatherName: initial?.father.name ?? "",
    fatherOccupation: initial?.father.occupation ?? "",
    fatherContact: initial?.father.contact ?? "",
    motherName: initial?.mother.name ?? "",
    motherOccupation: initial?.mother.occupation ?? "",
    motherContact: initial?.mother.contact ?? "",
    emergencyName: initial?.emergency.name ?? "",
    emergencyRelation: initial?.emergency.relation ?? "",
    emergencyContact: initial?.emergency.contact ?? ""
  });
  const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/hostel-admin/students");
  };
  return <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Section title="Personal Information" icon={<User className="h-4 w-4" />}>
        <Field label="Full Name" required><Input value={d.name} onChange={(e) => set("name", e.target.value)} required /></Field>
        <Field label="Email" required><Input type="email" value={d.email} onChange={(e) => set("email", e.target.value)} required /></Field>
        <Field label="Gender" required>
          <select className={selectCls} value={d.gender} onChange={(e) => set("gender", e.target.value)}>
            <option>Male</option><option>Female</option><option>Other</option>
          </select>
        </Field>
        <Field label="Date of Birth" required><Input type="date" value={d.dob} onChange={(e) => set("dob", e.target.value)} required /></Field>
        <Field label="Blood Group"><Input value={d.bloodGroup} onChange={(e) => set("bloodGroup", e.target.value)} placeholder="e.g. O+" /></Field>
        <Field label="Contact Number" required><Input value={d.contact} onChange={(e) => set("contact", e.target.value)} required /></Field>
        <div className="md:col-span-2"><Field label="Address"><Input value={d.address} onChange={(e) => set("address", e.target.value)} /></Field></div>
      </Section>

      <Section title="Academic Information" icon={<GraduationCap className="h-4 w-4" />}>
        <Field label="Enrollment Number" required><Input value={d.enrollment} onChange={(e) => set("enrollment", e.target.value)} required /></Field>
        <Field label="Department" required>
          <select className={selectCls} value={d.department} onChange={(e) => set("department", e.target.value)}>
            {["Computer", "IT", "EXTC", "Mechanical", "Civil", "Electrical"].map((x) => <option key={x}>{x}</option>)}
          </select>
        </Field>
        <Field label="Year" required>
          <select className={selectCls} value={d.year} onChange={(e) => set("year", Number(e.target.value))}>
            {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </Field>
        <Field label="Admission Year"><Input type="number" value={d.admissionYear} onChange={(e) => set("admissionYear", Number(e.target.value))} /></Field>
        <Field label="CGPA"><Input type="number" step="0.01" value={d.cgpa} onChange={(e) => set("cgpa", Number(e.target.value))} /></Field>
      </Section>

      <Section title="Guardian Details" icon={<Users2 className="h-4 w-4" />}>
        <Field label="Father's Name"><Input value={d.fatherName} onChange={(e) => set("fatherName", e.target.value)} /></Field>
        <Field label="Father's Occupation"><Input value={d.fatherOccupation} onChange={(e) => set("fatherOccupation", e.target.value)} /></Field>
        <Field label="Father's Contact"><Input value={d.fatherContact} onChange={(e) => set("fatherContact", e.target.value)} /></Field>
        <Field label="Mother's Name"><Input value={d.motherName} onChange={(e) => set("motherName", e.target.value)} /></Field>
        <Field label="Mother's Occupation"><Input value={d.motherOccupation} onChange={(e) => set("motherOccupation", e.target.value)} /></Field>
        <Field label="Mother's Contact"><Input value={d.motherContact} onChange={(e) => set("motherContact", e.target.value)} /></Field>
        <Field label="Parent Contact (Primary)" required><Input value={d.parentContact} onChange={(e) => set("parentContact", e.target.value)} required /></Field>
      </Section>

      <Section title="Emergency Contact" icon={<ShieldAlert className="h-4 w-4" />}>
        <Field label="Name"><Input value={d.emergencyName} onChange={(e) => set("emergencyName", e.target.value)} /></Field>
        <Field label="Relation"><Input value={d.emergencyRelation} onChange={(e) => set("emergencyRelation", e.target.value)} /></Field>
        <Field label="Contact Number"><Input value={d.emergencyContact} onChange={(e) => set("emergencyContact", e.target.value)} /></Field>
      </Section>

      <Section title="Hostel Details" icon={<Building2 className="h-4 w-4" />}>
        <Field label="Hostel" required>
          <select className={selectCls} value={d.hostel} onChange={(e) => set("hostel", e.target.value)}>
            <option>Boys Hostel</option><option>Girls Hostel</option>
          </select>
        </Field>
        <Field label="Room Number"><Input value={d.room} onChange={(e) => set("room", e.target.value)} placeholder="e.g. A-204" /></Field>
        <Field label="Joined On"><Input type="date" value={d.joinedHostel} onChange={(e) => set("joinedHostel", e.target.value)} /></Field>
        <Field label="Status">
          <select className={selectCls} value={d.status} onChange={(e) => set("status", e.target.value)}>
            <option>Active</option><option>On Leave</option><option>Alumni</option>
          </select>
        </Field>
      </Section>

      <Section title="Documents Upload" icon={<FileText className="h-4 w-4" />}>
        {["Photograph", "ID Proof (Aadhaar)", "Admission Letter", "Fee Receipt"].map((doc) => <div key={doc} className="flex items-center justify-between rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{doc}</p>
              <p className="text-xs text-muted-foreground">PDF, JPG or PNG · up to 5 MB</p>
            </div>
            <Button type="button" variant="outline" size="sm">
              <Upload className="mr-1.5 h-4 w-4" /> Upload
            </Button>
          </div>)}
      </Section>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline" type="button">
          <Link to="/hostel-admin/students"><X className="mr-1.5 h-4 w-4" /> Cancel</Link>
        </Button>
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          <Save className="mr-1.5 h-4 w-4" /> {mode === "add" ? "Save Student" : "Update Student"}
        </Button>
      </div>
    </form>;
}
export {
  StudentForm
};
