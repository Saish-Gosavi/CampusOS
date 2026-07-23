import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WardenSidebar } from "@/components/warden/WardenSidebar";
import { WardenNavbar } from "@/components/warden/WardenNavbar";
const Route = createFileRoute("/warden")({
  head: () => ({
    meta: [
      { title: "Warden Portal \u2014 CampusOS" },
      { name: "description", content: "Warden portal for daily hostel operations at VPPCOE." },
      { property: "og:title", content: "Warden Portal \u2014 CampusOS" },
      { property: "og:description", content: "Manage students, rooms, complaints, visitors, leaves and notices." }
    ]
  }),
  component: WardenLayout
});
function WardenLayout() {
  return <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-background">
        <WardenSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <WardenNavbar />
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
