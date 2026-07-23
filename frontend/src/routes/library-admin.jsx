import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { LibrarySidebar } from "@/components/library/LibrarySidebar";
import { LibraryNavbar } from "@/components/library/LibraryNavbar";
const Route = createFileRoute("/library-admin")({
  head: () => ({
    meta: [
      { title: "Library Admin \u2014 CampusOS" },
      {
        name: "description",
        content: "Manage books, copies, circulation, fines and donations for the college library."
      }
    ]
  }),
  component: LibraryLayout
});
function LibraryLayout() {
  return <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F9FAFB] dark:bg-background">
        <LibrarySidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <LibraryNavbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>;
}
export {
  Route
};
