import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { myBorrowed } from "@/lib/student-data";
const Route = createFileRoute("/student/borrowed")({
  head: () => ({ meta: [{ title: "My Borrowed Books \u2014 Student Portal" }] }),
  component: BorrowedPage
});
function BorrowedPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="My Borrowed Books"
    description="Books currently issued to you"
    icon={BookOpen}
    tint="#0D9488"
    breadcrumbs={[{ label: "Library", to: "/student/books" }, { label: "Borrowed" }]}
  />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Issue date</th>
                <th className="px-4 py-3 text-left">Due date</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myBorrowed.map((b) => <tr key={b.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-7 shrink-0 place-items-center rounded bg-gradient-to-br from-[#0D9488] to-[#0f766e] text-[10px] font-bold text-white">
                        {b.cover}
                      </span>
                      <span className="font-medium text-foreground">{b.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{b.author}</td>
                  <td className="px-4 py-3">{new Date(b.issueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(b.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><StatusPill status={b.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm">Renew</Button>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>;
}
export {
  Route
};
