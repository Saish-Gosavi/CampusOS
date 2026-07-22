import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { myDocuments } from "@/lib/student-data";

export const Route = createFileRoute("/student/documents")({
  head: () => ({ meta: [{ title: "Documents — Student Portal" }] }),
  component: DocumentsPage,
});

const TINTS: Record<string, string> = {
  "Hostel Receipt": "#2563EB",
  "Library Receipt": "#0D9488",
  "Leave Approval": "#F97316",
  "Gate Pass": "#7B4CED",
};

function DocumentsPage() {
  const groups = Array.from(new Set(myDocuments.map((d) => d.type)));
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <StudentPageHeader
        title="Documents"
        description="Receipts, approvals and gate passes"
        icon={FileText}
        tint="#7B4CED"
        breadcrumbs={[{ label: "Documents" }]}
      />

      {groups.map((g) => {
        const tint = TINTS[g] ?? "#2563EB";
        const items = myDocuments.filter((d) => d.type === g);
        return (
          <div key={g}>
            <h3 className="mb-3 text-sm font-semibold text-foreground">{g}s</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${tint}1A`, color: tint }}>
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(d.issuedOn).toDateString()} · {d.size}</p>
                  </div>
                  <button className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
