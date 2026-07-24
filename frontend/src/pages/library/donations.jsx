import { createFileRoute } from "@tanstack/react-router";
import { Gift, Plus } from "lucide-react";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { LibraryStatusPill } from "@/components/library/LibraryStatusPill";
import { Button } from "@/components/ui/button";
import { donations } from "@/lib/library-data";
const Route = createFileRoute("/library-admin/donations")({
  component: DonationsPage
});
function DonationsPage() {
  const totalBooks = donations.reduce((s, d) => s + d.books, 0);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
    title="Donation Management"
    description="Record and catalog books donated by alumni, faculty and external partners."
    icon={Gift}
    tint="#EF4444"
    breadcrumbs={[{ label: "Donations" }]}
    action={<Button className="bg-[#EF4444] hover:bg-[#dc2626]">
            <Plus className="mr-1.5 h-4 w-4" /> Record Donation
          </Button>}
  />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{donations.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Books Donated</p>
          <p className="mt-2 text-2xl font-bold text-[#0D9488]">{totalBooks}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Awaiting Catalog</p>
          <p className="mt-2 text-2xl font-bold text-[#EAB308]">
            {donations.filter((d) => d.status !== "Cataloged").length}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Donor</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 font-medium">Books</th>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.map((d) => <tr key={d.id} className="hover:bg-muted/40">
                  <td className="px-3 py-3 font-medium text-foreground">{d.donor}</td>
                  <td className="px-3 py-3 text-foreground">{d.type}</td>
                  <td className="px-3 py-3 text-foreground">{d.books}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{d.date}</td>
                  <td className="px-3 py-3"><LibraryStatusPill status={d.status} /></td>
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
