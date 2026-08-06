import { createFileRoute } from "@/routes/compat";
import { Inbox, Check, X } from "lucide-react";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { LibraryStatusPill } from "@/components/library/LibraryStatusPill";
import { Button } from "@/components/ui/button";
import { bookRequests } from "@/lib/library-data";
const Route = createFileRoute("/library-admin/requests")({
  component: RequestsPage
});
function RequestsPage() {
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
    title="Book Requests"
    description="Review member requests for new titles to acquire."
    icon={Inbox}
    tint="#0D9488"
    breadcrumbs={[{ label: "Book Requests" }]}
  />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookRequests.map((r) => <div key={r.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-foreground">{r.bookTitle}</h3>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">by {r.author}</p>
              </div>
              <LibraryStatusPill status={r.status} />
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-sm">
              <p className="font-medium text-foreground">{r.member}</p>
              <p className="text-xs text-muted-foreground">
                {r.memberId} · requested {r.requestedOn}
              </p>
            </div>
            {r.status === "Pending" && <div className="mt-4 flex items-center gap-2">
                <Button className="flex-1 bg-[#22C55E] hover:bg-[#16A34A]" size="sm">
                  <Check className="mr-1 h-3.5 w-3.5" /> Approve
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10">
                  <X className="mr-1 h-3.5 w-3.5" /> Reject
                </Button>
              </div>}
          </div>)}
      </div>
    </div>;
}
export {
  Route
};
