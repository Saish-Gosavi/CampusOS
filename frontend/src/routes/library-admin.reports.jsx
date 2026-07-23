import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { ChartCard } from "@/components/admin/ChartCard";
import {
  bookCirculation,
  departmentUsage,
  fineCollection,
  mostBorrowed
} from "@/lib/library-data";
const Route = createFileRoute("/library-admin/reports")({
  component: ReportsPage
});
const PIE_COLORS = ["#0D9488", "#7B4CED", "#2563EB", "#22C55E", "#EAB308"];
function ReportsPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
    title="Reports & Analytics"
    description="Circulation, fines, popular titles and department usage."
    icon={BarChart3}
    tint="#0D9488"
    breadcrumbs={[{ label: "Reports" }]}
  />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Book Circulation" description="Issued vs returned per month">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bookCirculation}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="issued" stroke="#0D9488" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="returned" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Fine Collection" description="Monthly collection (₹)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fineCollection}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip
    formatter={(v) => `\u20B9${v.toLocaleString("en-IN")}`}
    contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
  />
                <Bar dataKey="amount" fill="#EAB308" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Most Borrowed Books" description="Top titles this semester">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostBorrowed} layout="vertical" margin={{ top: 5, right: 12, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="var(--muted-foreground)" fontSize={12} width={160} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill="#7B4CED" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Department-wise Usage" description="Borrows by department">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={departmentUsage} dataKey="value" nameKey="name" outerRadius={100} paddingAngle={2}>
                  {departmentUsage.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>;
}
export {
  Route
};
