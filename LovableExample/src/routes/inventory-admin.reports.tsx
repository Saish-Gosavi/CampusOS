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
  YAxis,
} from "recharts";
import { InventoryPageHeader } from "@/components/inventory/InventoryPageHeader";
import { InventoryStatusPill } from "@/components/inventory/InventoryStatusPill";
import { ChartCard } from "@/components/admin/ChartCard";
import {
  borrowingTrend,
  departmentSpend,
  inventoryItems,
  monthlyProcurement,
  stockByCategory,
} from "@/lib/inventory-data";

export const Route = createFileRoute("/inventory-admin/reports")({
  component: ReportsPage,
});

const PIE_COLORS = ["#2563EB", "#7B4CED", "#0D9488", "#22C55E", "#EAB308", "#EF4444"];

function ReportsPage() {
  const lowStock = inventoryItems.filter((i) => i.status !== "In Stock");

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <InventoryPageHeader
        title="Reports & Analytics"
        description="Inventory, department spend, low stock and borrowing trends."
        icon={BarChart3}
        tint="#2563EB"
        breadcrumbs={[{ label: "Reports" }]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Inventory Report" description="Stock by category">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stockByCategory} dataKey="value" nameKey="name" outerRadius={100} paddingAngle={2}>
                  {stockByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Department-wise Report" description="Spend by department (₹)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentSpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="value" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Borrow Report" description="Borrowed vs returned per month">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={borrowingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="borrowed" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="returned" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Procurement Trend" description="Requested vs approved">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProcurement}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="requested" fill="#7B4CED" radius={[6, 6, 0, 0]} />
                <Bar dataKey="approved" fill="#22C55E" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Low Stock Report" description="Items below reorder threshold">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Item</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Available</th>
                <th className="px-3 py-2 font-medium">Min Stock</th>
                <th className="px-3 py-2 font-medium">Location</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {lowStock.map((i) => (
                <tr key={i.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="font-medium text-foreground">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{i.sku}</div>
                  </td>
                  <td className="px-3 py-3 text-foreground">{i.category}</td>
                  <td className="px-3 py-3 font-semibold text-foreground">
                    {i.available} <span className="text-xs font-normal text-muted-foreground">{i.unit}</span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{i.minStock}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{i.location}</td>
                  <td className="px-3 py-3"><InventoryStatusPill status={i.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
