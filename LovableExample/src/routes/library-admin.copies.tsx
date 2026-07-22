import { createFileRoute } from "@tanstack/react-router";
import { Library, Plus, Pencil, Trash2 } from "lucide-react";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { LibraryStatusPill } from "@/components/library/LibraryStatusPill";
import { Button } from "@/components/ui/button";
import { bookCopies } from "@/lib/library-data";

export const Route = createFileRoute("/library-admin/copies")({
  component: CopiesPage,
});

function CopiesPage() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
        title="Book Copies"
        description="Every physical accession — track shelf, condition and status."
        icon={Library}
        tint="#7B4CED"
        breadcrumbs={[{ label: "Book Copies" }]}
        action={
          <Button className="bg-[#7B4CED] hover:bg-[#6b3ed6]">
            <Plus className="mr-1.5 h-4 w-4" /> Add Copy
          </Button>
        }
      />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Accession</th>
                <th className="px-3 py-2 font-medium">Book</th>
                <th className="px-3 py-2 font-medium">Shelf</th>
                <th className="px-3 py-2 font-medium">Condition</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookCopies.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-muted/40">
                  <td className="whitespace-nowrap px-3 py-3 font-medium text-foreground">{c.accession}</td>
                  <td className="px-3 py-3 text-foreground">{c.bookTitle}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{c.shelf}</td>
                  <td className="px-3 py-3"><LibraryStatusPill status={c.condition} /></td>
                  <td className="px-3 py-3"><LibraryStatusPill status={c.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
