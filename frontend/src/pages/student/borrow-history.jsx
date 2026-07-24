import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { myBorrowHistory } from "@/lib/student-data";
const Route = createFileRoute("/student/borrow-history")({
  head: () => ({ meta: [{ title: "Borrow History \u2014 Student Portal" }] }),
  component: BorrowHistoryPage
});
function BorrowHistoryPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Borrow History"
    description="Every book you've borrowed and returned"
    icon={History}
    tint="#0D9488"
    breadcrumbs={[{ label: "Library", to: "/student/books" }, { label: "History" }]}
  />

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Book</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Issued</th>
                <th className="px-4 py-3 text-left">Returned</th>
                <th className="px-4 py-3 text-left">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {myBorrowHistory.map((h) => <tr key={h.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{h.title}</td>
                  <td className="px-4 py-3">{h.author}</td>
                  <td className="px-4 py-3">{new Date(h.issueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{new Date(h.returnDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {h.fine > 0 ? <span className="rounded-full bg-[#EF4444]/10 px-2 py-0.5 text-xs font-medium text-[#EF4444]">₹{h.fine}</span> : <span className="text-xs text-muted-foreground">—</span>}
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
