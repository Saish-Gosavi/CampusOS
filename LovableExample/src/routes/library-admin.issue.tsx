import { createFileRoute } from "@tanstack/react-router";
import { BookUp } from "lucide-react";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { LibraryStatusPill } from "@/components/library/LibraryStatusPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { issuedBooks } from "@/lib/library-data";

export const Route = createFileRoute("/library-admin/issue")({
  component: IssuePage,
});

function IssuePage() {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
        title="Issue Books"
        description="Lend a copy to a library member and track due dates."
        icon={BookUp}
        tint="#2563EB"
        breadcrumbs={[{ label: "Issue Books" }]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-1">
          <h2 className="text-base font-semibold text-foreground">New Issue</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Fill member and book details</p>
          <div className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Member ID</Label>
              <Input placeholder="e.g. VP2023CS012" />
            </div>
            <div className="space-y-1.5">
              <Label>Book Accession</Label>
              <Input placeholder="e.g. ACC-00121" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Issue Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <Button className="mt-2 w-full bg-[#2563EB] hover:bg-[#1e4fd1]">
              <BookUp className="mr-1.5 h-4 w-4" /> Issue Book
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between px-1 pb-3">
            <h2 className="text-base font-semibold text-foreground">Currently Issued</h2>
            <span className="text-xs text-muted-foreground">{issuedBooks.length} active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-3 py-2 font-medium">Member</th>
                  <th className="px-3 py-2 font-medium">Book</th>
                  <th className="px-3 py-2 font-medium">Due</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {issuedBooks.map((i) => (
                  <tr key={i.id} className="hover:bg-muted/40">
                    <td className="px-3 py-3">
                      <div className="font-medium text-foreground">{i.member}</div>
                      <div className="text-xs text-muted-foreground">{i.memberId}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="text-foreground">{i.bookTitle}</div>
                      <div className="text-xs text-muted-foreground">{i.accession}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-foreground">{i.dueDate}</td>
                    <td className="px-3 py-3"><LibraryStatusPill status={i.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
