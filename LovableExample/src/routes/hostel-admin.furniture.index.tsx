import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Eye, Pencil, Trash2, Package, CheckCircle2, AlertTriangle, Wrench, Download, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/hostel/StatusPill";
import { furnitureItems, type FurnitureItem } from "@/lib/hostel-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/hostel-admin/furniture/")({
  component: FurnitureListPage,
});

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const CATEGORIES = ["All", "Bed", "Study Table", "Chair", "Wardrobe", "Fan", "Cupboard", "Mattress", "Desk Lamp", "Curtain", "Shelf"] as const;
const STATUSES = ["All", "In Use", "In Storage", "Assigned", "Under Maintenance", "Replaced", "Retired"] as const;

function FurnitureListPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<FurnitureItem | null>(null);
  const [deleting, setDeleting] = useState<FurnitureItem | null>(null);

  const rows = useMemo(() => {
    let list = furnitureItems;
    if (category !== "All") list = list.filter((f) => f.category === category);
    if (status !== "All") list = list.filter((f) => f.status === status);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.code.toLowerCase().includes(q) ||
          f.room.toLowerCase().includes(q) ||
          f.hostel.toLowerCase().includes(q) ||
          f.vendor.toLowerCase().includes(q) ||
          (f.assignedTo ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [category, status, query]);

  const stats = useMemo(() => {
    const totalValue = furnitureItems.reduce((s, f) => s + f.cost, 0);
    return {
      total: furnitureItems.length,
      inUse: furnitureItems.filter((f) => f.status === "In Use" || f.status === "Assigned").length,
      damaged: furnitureItems.filter((f) => f.condition === "Damaged").length,
      maintenance: furnitureItems.filter((f) => f.status === "Under Maintenance").length,
      totalValue,
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tile icon={Package} label="Total Items" value={String(stats.total)} hint={INR.format(stats.totalValue)} tint="#7B4CED" />
        <Tile icon={CheckCircle2} label="In Use" value={String(stats.inUse)} hint="Active in rooms" tint="#22C55E" />
        <Tile icon={AlertTriangle} label="Damaged" value={String(stats.damaged)} hint="Needs review" tint="#EF4444" />
        <Tile icon={Wrench} label="Under Maintenance" value={String(stats.maintenance)} hint="In workshop" tint="#F59E0B" />
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c === "All" ? "All Categories" : c}</option>)}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ID, room, vendor…"
                className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.success("Furniture inventory exported")}>
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
            <Button size="sm" style={{ backgroundColor: "#7B4CED" }} className="text-white hover:opacity-90" onClick={() => toast.success("Open Assign tab to add & assign items")}>
              <Plus className="mr-1.5 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Furniture ID</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Room</th>
                <th className="px-3 py-2 font-medium">Condition</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((f) => (
                <tr key={f.id} className="hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs font-semibold text-foreground">{f.code}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{f.category}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{f.hostel} · {f.room}</td>
                  <td className="px-3 py-3"><StatusPill status={f.condition} /></td>
                  <td className="px-3 py-3"><StatusPill status={f.status} /></td>
                  <td className="px-3 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => setViewing(f)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-muted">
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                      <button onClick={() => toast.success(`Edit form opened for ${f.code}`)} className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-muted">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => setDeleting(f)} className="inline-flex items-center gap-1 rounded-md border border-[#EF4444]/30 px-2 py-1 text-xs text-[#DC2626] hover:bg-[#EF4444]/10">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No furniture matches your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-mono">{viewing?.code}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Category" value={viewing.category} />
              <Info label="Hostel" value={viewing.hostel} />
              <Info label="Room" value={viewing.room} />
              <Info label="Block" value={viewing.block ?? "—"} />
              <Info label="Vendor" value={viewing.vendor} />
              <Info label="Cost" value={INR.format(viewing.cost)} />
              <Info label="Purchased" value={viewing.purchaseDate} />
              <Info label="Last Inspected" value={viewing.lastInspected ?? "—"} />
              <div><p className="text-xs text-muted-foreground">Condition</p><div className="mt-1"><StatusPill status={viewing.condition} /></div></div>
              <div><p className="text-xs text-muted-foreground">Status</p><div className="mt-1"><StatusPill status={viewing.status} /></div></div>
              <Info label="Assigned To" value={viewing.assignedTo ?? "—"} />
              {viewing.notes && <div className="col-span-2"><p className="text-xs text-muted-foreground">Notes</p><p className="mt-1 text-foreground">{viewing.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Delete Furniture Item</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-mono font-semibold text-foreground">{deleting?.code}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button className="bg-[#EF4444] text-white hover:bg-[#DC2626]" onClick={() => { toast.success(`Deleted ${deleting?.code}`); setDeleting(null); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}

function Tile({ icon: Icon, label, value, hint, tint }: { icon: typeof Package; label: string; value: string; hint: string; tint: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold" style={{ color: tint }}>{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${tint}1a`, color: tint }}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
