import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, ListTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import { feeStructure } from "@/lib/hostel-data";
const Route = createFileRoute("/hostel-admin/fees/structure")({
  component: FeeStructurePage
});
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
const CATEGORY_TINTS = {
  Accommodation: "#2563EB",
  Mess: "#F59E0B",
  Security: "#7B4CED",
  Utilities: "#0EA5E9",
  Amenities: "#22C55E",
  Maintenance: "#EF4444"
};
function FeeStructurePage() {
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(feeStructure.map((f) => f.category)))],
    []
  );
  const items = useMemo(
    () => category === "All" ? feeStructure : feeStructure.filter((f) => f.category === category),
    [category]
  );
  const total = useMemo(() => items.reduce((s, f) => s + f.amount, 0), [items]);
  return <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span
    className="flex h-10 w-10 items-center justify-center rounded-lg"
    style={{ backgroundColor: "#22C55E1a", color: "#22C55E" }}
  >
              <ListTree className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-foreground">Fee Structure</h2>
              <p className="text-xs text-muted-foreground">
                Configure heads that make up the semester invoice.
              </p>
            </div>
          </div>
          <Button className="bg-[#22C55E] hover:bg-[#16A34A]">
            <Plus className="mr-1.5 h-4 w-4" /> Add Fee Head
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => <button
    key={c}
    onClick={() => setCategory(c)}
    className={"rounded-full border px-3 py-1 text-xs font-medium transition-colors " + (category === c ? "border-transparent bg-[#22C55E] text-white" : "border-border bg-card text-foreground hover:bg-muted")}
  >
              {c}
            </button>)}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Fee Head</th>
                <th className="px-3 py-2 font-medium">Applicable To</th>
                <th className="px-3 py-2 font-medium">Frequency</th>
                <th className="px-3 py-2 font-medium">Amount</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((f) => <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
    className="rounded-full px-2 py-0.5 text-xs font-medium"
    style={{
      backgroundColor: `${CATEGORY_TINTS[f.category] ?? "#64748B"}1a`,
      color: CATEGORY_TINTS[f.category] ?? "#64748B"
    }}
  >
                      {f.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">
                    {f.head}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                    {f.applicableTo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{f.frequency}</td>
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-foreground">
                    {INR.format(f.amount)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border">
                <td colSpan={4} className="px-3 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground">
                  Total (selected)
                </td>
                <td className="px-3 py-3 text-base font-bold text-[#16A34A]">{INR.format(total)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>;
}
export {
  Route
};
