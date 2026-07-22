import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Pin, Eye } from "lucide-react";
import { SecurityPageHeader } from "@/components/security/SecurityPageHeader";
import { StatusPill } from "@/components/hostel/StatusPill";
import { Button } from "@/components/ui/button";
import { notices } from "@/lib/hostel-data";

export const Route = createFileRoute("/security/notices")({
  component: NoticesPage,
});

const TINT = "#EAB308";

function NoticesPage() {
  const list = notices.filter((n) => n.status === "Published");
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <SecurityPageHeader
        title="Notices"
        description="Read-only feed of hostel notices relevant to the gate and security staff."
        icon={Megaphone}
        tint={TINT}
        breadcrumbs={[{ label: "Notices" }]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((n) => (
          <article key={n.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {n.pinned && <Pin className="h-4 w-4 text-[#EAB308]" />}
                <StatusPill status={n.status} />
              </div>
              <span className="text-xs text-muted-foreground">{n.publishDate}</span>
            </div>
            <h3 className="text-base font-semibold text-foreground">{n.title}</h3>
            <p className="line-clamp-3 text-sm text-muted-foreground">{n.body}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5">{n.audience}</span>
              <span>Expires {n.expiryDate}</span>
            </div>
            <Button variant="outline" size="sm" className="gap-2 self-start">
              <Eye className="h-3.5 w-3.5" /> Read
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
