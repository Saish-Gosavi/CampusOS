import React, { useState } from "react";
import { Clock, Search, UserCheck } from "lucide-react";

const Route = {
  head: () => ({
    meta: [
      { title: "Student Off-Day Logs — Mess Manager" },
      { name: "description", content: "Notifications of students not attending mess meals." }
    ]
  }),
  component: MessOffDaysPage
};

function MessOffDaysPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [offDays] = useState([
    { id: 1, studentName: "Rahul Sharma", room: "A-102", startDate: "2026-08-07", endDate: "2026-08-09", totalDays: 3, reason: "Home visit for weekend", status: "Notified" },
    { id: 2, studentName: "Priya Patel", room: "B-204", startDate: "2026-08-07", endDate: "2026-08-08", totalDays: 2, reason: "Family event in town", status: "Notified" },
    { id: 3, studentName: "Aman Gupta", room: "C-305", startDate: "2026-08-08", endDate: "2026-08-10", totalDays: 3, reason: "Medical leave", status: "Notified" }
  ]);

  const filteredOffDays = offDays.filter(o =>
    o.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Mess Off-Day Notifications</h1>
          <p className="text-xs text-muted-foreground">List of students who notified non-attendance for headcount and ration estimation</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 shadow-xs">
          <span className="text-xs font-semibold text-amber-800">Total Not Coming Today:</span>
          <span className="text-sm font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-md">
            {offDays.length} Students
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by student name or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-3 font-semibold">Student Name</th>
                <th className="p-3 font-semibold">Room</th>
                <th className="p-3 font-semibold">Off-Day Period</th>
                <th className="p-3 font-semibold">Total Days</th>
                <th className="p-3 font-semibold">Reason</th>
                <th className="p-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOffDays.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium text-foreground">{r.studentName}</td>
                  <td className="p-3 text-muted-foreground">{r.room}</td>
                  <td className="p-3 text-muted-foreground">{r.startDate} → {r.endDate}</td>
                  <td className="p-3 font-semibold text-foreground">{r.totalDays} Days</td>
                  <td className="p-3 text-muted-foreground max-w-xs truncate">{r.reason}</td>
                  <td className="p-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                      ● Notified (Not Coming)
                    </span>
                  </td>
                </tr>
              ))}
              {filteredOffDays.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No off-day notifications found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MessOffDaysPage;
export { Route };
