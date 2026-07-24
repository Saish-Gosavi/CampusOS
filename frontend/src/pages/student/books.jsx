import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, BookOpen, BookMarked } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentPageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { libraryCatalog } from "@/lib/student-data";
const Route = createFileRoute("/student/books")({
  head: () => ({ meta: [{ title: "Search Books \u2014 Student Portal" }] }),
  component: BooksPage
});
function BooksPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [avail, setAvail] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(libraryCatalog.map((b) => b.category)))], []);
  const filtered = libraryCatalog.filter((b) => {
    const matchQ = !q || `${b.title} ${b.author}`.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === "All" || b.category === cat;
    const matchA = avail === "All" || (avail === "Available" ? b.copiesAvailable > 0 : b.copiesAvailable === 0);
    return matchQ && matchC && matchA;
  });
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <StudentPageHeader
    title="Search Books"
    description="Explore the central library catalog"
    icon={BookOpen}
    tint="#0D9488"
    breadcrumbs={[{ label: "Library", to: "/student/books" }, { label: "Search" }]}
  />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title or author..." className="pl-9" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={avail} onChange={(e) => setAvail(e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>All</option><option>Available</option><option>Unavailable</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((b) => <div key={b.id} className="group flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="grid h-40 place-items-center rounded-lg bg-gradient-to-br from-[#0D9488] to-[#0f766e] text-3xl font-bold text-white">
              {b.cover}
            </div>
            <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-foreground">{b.title}</h3>
            <p className="line-clamp-1 text-xs text-muted-foreground">{b.author}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="rounded-full bg-[#0D9488]/10 px-2 py-0.5 text-[11px] font-medium text-[#0D9488]">{b.category}</span>
              <span className={`text-xs font-semibold ${b.copiesAvailable > 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                {b.copiesAvailable}/{b.totalCopies} avail
              </span>
            </div>
            <Button
    disabled={b.copiesAvailable === 0}
    className="mt-3 w-full bg-[#0D9488] hover:bg-[#0f766e]"
  >
              <BookMarked className="mr-2 h-4 w-4" /> {b.copiesAvailable > 0 ? "Reserve" : "Unavailable"}
            </Button>
          </div>)}
      </div>
      {filtered.length === 0 && <div className="rounded-xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          No books match your search.
        </div>}
    </div>;
}
export {
  Route
};
