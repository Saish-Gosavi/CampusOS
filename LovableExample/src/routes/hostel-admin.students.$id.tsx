import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  UserCircle2,
  Pencil,
  BedDouble,
  IdCard,
  Mail,
  Phone,
  MapPin,
  Cake,
  Droplet,
  GraduationCap,
  Users2,
  ShieldAlert,
  Building2,
  Printer,
} from "lucide-react";
import { HostelPageHeader } from "@/components/hostel/HostelPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { students } from "@/lib/hostel-data";

export const Route = createFileRoute("/hostel-admin/students/$id")({
  loader: ({ params }) => {
    const student = students.find((s) => s.id === params.id);
    if (!student) throw notFound();
    return { student };
  },
  component: StudentDetailPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="text-xl font-semibold text-foreground">Student not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">This record may have been removed.</p>
      <Button asChild className="mt-4"><Link to="/hostel-admin/students">Back to list</Link></Button>
    </div>
  ),
});

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]"><Icon className="h-4 w-4" /></span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function StudentDetailPage() {
  const { student: s } = Route.useLoaderData();

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <HostelPageHeader
        title="Student Profile"
        description="Complete academic, guardian and hostel record."
        icon={UserCircle2}
        tint="#7B4CED"
        breadcrumbs={[
          { label: "Student Management", to: "/hostel-admin/students" },
          { label: s.name },
        ]}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline"><IdCard className="mr-1.5 h-4 w-4" /> Generate ID Card</Button>
            <Button asChild variant="outline"><Link to="/hostel-admin/allocation"><BedDouble className="mr-1.5 h-4 w-4" /> Allocate Room</Link></Button>
            <Button asChild className="bg-[#2563EB] hover:bg-[#1e4fd1]">
              <Link to="/hostel-admin/students/$id/edit" params={{ id: s.id }}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Profile card */}
        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-2xl font-semibold text-white">
              {s.photo}
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">{s.name}</h2>
            <p className="text-sm text-muted-foreground">{s.enrollment}</p>
            <div className="mt-3 flex justify-center"><StatusPill status={s.status} /></div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/50 py-2"><p className="text-xs text-muted-foreground">Year</p><p className="text-sm font-semibold text-foreground">{s.year}</p></div>
              <div className="rounded-lg bg-muted/50 py-2"><p className="text-xs text-muted-foreground">CGPA</p><p className="text-sm font-semibold text-foreground">{s.cgpa}</p></div>
              <div className="rounded-lg bg-muted/50 py-2"><p className="text-xs text-muted-foreground">Room</p><p className="text-sm font-semibold text-foreground">{s.room}</p></div>
            </div>
          </div>

          {/* ID card preview */}
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#282648] to-[#211160] px-4 py-2 text-white">
              <p className="text-xs font-semibold tracking-wide">CampusOS · VPPCOE</p>
              <button className="text-white/80 hover:text-white"><Printer className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7B4CED] text-white">{s.photo}</div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.enrollment}</p>
                <p className="text-xs text-muted-foreground">{s.department} · Year {s.year}</p>
              </div>
            </div>
            <div className="border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
              Hostel: {s.hostel} · Room {s.room}
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-6">
          <Panel title="Personal Information" icon={UserCircle2}>
            <Row icon={Mail} label="Email" value={s.email} />
            <Row icon={Phone} label="Contact" value={s.contact} />
            <Row icon={Cake} label="Date of Birth" value={s.dob} />
            <Row icon={Droplet} label="Blood Group" value={s.bloodGroup} />
            <Row icon={UserCircle2} label="Gender" value={s.gender} />
            <Row icon={MapPin} label="Address" value={s.address} />
          </Panel>

          <Panel title="Academic Information" icon={GraduationCap}>
            <Row icon={GraduationCap} label="Department" value={s.department} />
            <Row icon={GraduationCap} label="Year" value={`Year ${s.year}`} />
            <Row icon={GraduationCap} label="Admission Year" value={s.admissionYear} />
            <Row icon={GraduationCap} label="CGPA" value={s.cgpa} />
          </Panel>

          <Panel title="Hostel Details" icon={Building2}>
            <Row icon={Building2} label="Hostel" value={s.hostel} />
            <Row icon={BedDouble} label="Room Number" value={s.room} />
            <Row icon={Building2} label="Joined On" value={s.joinedHostel} />
            <Row icon={Building2} label="Status" value={s.status} />
          </Panel>

          <Panel title="Guardian Details" icon={Users2}>
            <Row icon={Users2} label="Father" value={`${s.father.name} · ${s.father.occupation}`} />
            <Row icon={Phone} label="Father Contact" value={s.father.contact} />
            <Row icon={Users2} label="Mother" value={`${s.mother.name} · ${s.mother.occupation}`} />
            <Row icon={Phone} label="Mother Contact" value={s.mother.contact} />
            <Row icon={Phone} label="Parent (Primary)" value={s.parentContact} />
          </Panel>

          <Panel title="Emergency Contact" icon={ShieldAlert}>
            <Row icon={Users2} label="Name" value={s.emergency.name} />
            <Row icon={Users2} label="Relation" value={s.emergency.relation} />
            <Row icon={Phone} label="Contact" value={s.emergency.contact} />
          </Panel>
        </div>
      </div>
    </div>
  );
}
