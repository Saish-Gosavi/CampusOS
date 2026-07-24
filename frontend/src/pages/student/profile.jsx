import { createFileRoute } from "@tanstack/react-router";
import { UserCircle2, Pencil, Mail, Phone, HeartPulse, Users2, BedDouble, GraduationCap } from "lucide-react";
import { useState } from "react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { studentProfile } from "@/lib/student-data";
const Route = createFileRoute("/student/profile")({
  head: () => ({ meta: [{ title: "My Profile \u2014 Student Portal" }] }),
  component: ProfilePage
});
function InfoRow({ label, value }) {
  return <div className="flex items-start justify-between gap-3 border-b border-border/70 py-2.5 last:border-b-0">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">{value}</span>
    </div>;
}
function ProfilePage() {
  const [editing, setEditing] = useState(false);
  return <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <StudentPageHeader
    title="My Profile"
    description="Personal, academic and hostel information"
    icon={UserCircle2}
    tint="#2563EB"
    breadcrumbs={[{ label: "Profile" }]}
    action={<Button onClick={() => setEditing((v) => !v)} className="bg-[#2563EB] hover:bg-[#1d4fd8]">
            <Pencil className="mr-2 h-4 w-4" /> {editing ? "Save changes" : "Edit profile"}
          </Button>}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {
    /* Summary card */
  }
        <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm lg:col-span-1">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-2xl font-bold text-white">
            {studentProfile.photo}
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">{studentProfile.name}</h2>
          <p className="text-sm text-muted-foreground">{studentProfile.enrollment}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#2563EB]/10 px-3 py-1 text-xs font-medium text-[#2563EB]">
            <GraduationCap className="h-3 w-3" /> {studentProfile.department} · {studentProfile.year}
          </div>
          <div className="mt-6 space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" /> {studentProfile.email}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" /> {studentProfile.mobile}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <HeartPulse className="h-4 w-4 text-muted-foreground" /> Blood Group: {studentProfile.bloodGroup}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <BedDouble className="h-4 w-4 text-muted-foreground" /> {studentProfile.hostel.name} · {studentProfile.hostel.room}
            </div>
          </div>
        </div>

        {
    /* Details */
  }
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Personal information</h3>
            {editing ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div><Label>Full Name</Label><Input defaultValue={studentProfile.name} /></div>
                <div><Label>Email</Label><Input defaultValue={studentProfile.email} /></div>
                <div><Label>Mobile</Label><Input defaultValue={studentProfile.mobile} /></div>
                <div><Label>Emergency Contact</Label><Input defaultValue={studentProfile.emergencyContact} /></div>
                <div className="sm:col-span-2"><Label>Address</Label><Input defaultValue={studentProfile.address} /></div>
              </div> : <div>
                <InfoRow label="Full Name" value={studentProfile.name} />
                <InfoRow label="Date of Birth" value={new Date(studentProfile.dob).toDateString()} />
                <InfoRow label="Email" value={studentProfile.email} />
                <InfoRow label="Mobile Number" value={studentProfile.mobile} />
                <InfoRow label="Blood Group" value={studentProfile.bloodGroup} />
                <InfoRow label="Emergency Contact" value={studentProfile.emergencyContact} />
                <InfoRow label="Address" value={studentProfile.address} />
              </div>}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Users2 className="h-4 w-4 text-[#7B4CED]" /> Parent details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Father</p>
                  <p className="mt-1 font-medium">{studentProfile.father.name}</p>
                  <p className="text-xs text-muted-foreground">{studentProfile.father.occupation} · {studentProfile.father.mobile}</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Mother</p>
                  <p className="mt-1 font-medium">{studentProfile.mother.name}</p>
                  <p className="text-xs text-muted-foreground">{studentProfile.mother.occupation} · {studentProfile.mother.mobile}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <BedDouble className="h-4 w-4 text-[#2563EB]" /> Hostel information
              </h3>
              <InfoRow label="Hostel" value={studentProfile.hostel.name} />
              <InfoRow label="Block" value={studentProfile.hostel.block} />
              <InfoRow label="Floor" value={studentProfile.hostel.floor} />
              <InfoRow label="Room" value={studentProfile.hostel.room} />
              <InfoRow label="Bed" value={studentProfile.hostel.bed} />
              <InfoRow label="Warden" value={`${studentProfile.hostel.warden.name} \xB7 ${studentProfile.hostel.warden.mobile}`} />
            </div>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Route
};
