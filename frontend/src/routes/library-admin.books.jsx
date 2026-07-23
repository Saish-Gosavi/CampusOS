import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Plus, Search, Filter, Pencil, Trash2, Eye, BookUp, ChevronLeft, ChevronRight } from "lucide-react";
import { LibraryPageHeader } from "@/components/library/LibraryPageHeader";
import { LibraryStatusPill } from "@/components/library/LibraryStatusPill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { books } from "@/lib/library-data";
const Route = createFileRoute("/library-admin/books")({
  component: BooksPage
});
const PAGE_SIZE = 6;
const COVER_GRADIENTS = [
  "from-[#0D9488] to-[#0f766e]",
  "from-[#7B4CED] to-[#5b21b6]",
  "from-[#2563EB] to-[#1e40af]",
  "from-[#EAB308] to-[#b45309]",
  "from-[#EF4444] to-[#b91c1c]",
  "from-[#22C55E] to-[#15803d]"
];
function BooksPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(books.map((b) => b.category)))],
    []
  );
  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return books.filter((b) => {
      const matchesQ = !query || b.title.toLowerCase().includes(query) || b.isbn.toLowerCase().includes(query) || b.author.toLowerCase().includes(query);
      const matchesCat = category === "All" || b.category === category;
      return matchesQ && matchesCat;
    });
  }, [q, category]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <LibraryPageHeader
    title="Book Management"
    description="Catalog, search and manage every title in the library."
    icon={BookOpen}
    tint="#0D9488"
    breadcrumbs={[{ label: "Book Management" }]}
    action={<Button className="bg-[#0D9488] hover:bg-[#0b7d72]">
            <Plus className="mr-1.5 h-4 w-4" /> Add Book
          </Button>}
  />

      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
    value={q}
    onChange={(e) => {
      setQ(e.target.value);
      setPage(1);
    }}
    placeholder="Search by title, ISBN or author"
    className="h-10 pl-9"
  />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
    value={category}
    onChange={(e) => {
      setCategory(e.target.value);
      setPage(1);
    }}
    className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
  >
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Book</th>
                <th className="px-3 py-2 font-medium">ISBN</th>
                <th className="px-3 py-2 font-medium">Author</th>
                <th className="px-3 py-2 font-medium">Category</th>
                <th className="px-3 py-2 font-medium">Copies</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {current.map((b, idx) => <tr key={b.id} className="transition-colors hover:bg-muted/40">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span
    className={`grid h-11 w-8 shrink-0 place-items-center rounded-md bg-gradient-to-br ${COVER_GRADIENTS[idx % COVER_GRADIENTS.length]} text-[10px] font-bold text-white shadow`}
  >
                        {b.cover}
                      </span>
                      <span className="font-medium text-foreground">{b.title}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{b.isbn}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{b.author}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">{b.category}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-foreground">
                    <span className="font-medium">{b.available}</span>
                    <span className="text-muted-foreground"> / {b.copies}</span>
                  </td>
                  <td className="px-3 py-3">
                    <LibraryStatusPill status={b.status} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
    className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#0D9488]/10 hover:text-[#0D9488]"
    title="Issue"
  >
                        <BookUp className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-[#EF4444]/10 hover:text-[#EF4444]" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
              {current.length === 0 && <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">
                    No books match your filters.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
    onClick={() => setPage((p) => Math.max(1, p - 1))}
    disabled={page === 1}
    className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-50"
  >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <button
    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
    disabled={page === totalPages}
    className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-muted disabled:opacity-50"
  >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>;
}
export {
  Route
};
