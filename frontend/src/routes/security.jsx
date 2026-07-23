import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SecuritySidebar } from "@/components/security/SecuritySidebar";
import { SecurityNavbar } from "@/components/security/SecurityNavbar";
const Route = createFileRoute("/security")({
  head: () => ({
    meta: [
      { title: "Security Portal \u2014 CampusOS" },
      { name: "description", content: "Security portal for hostel gate operations, visitors and incidents at VPPCOE." },
      { property: "og:title", content: "Security Portal \u2014 CampusOS" },
      { property: "og:description", content: "Monitor entries, exits, visitors, gate passes and campus incidents." }
    ]
  }),
  component: SecurityLayout
});
function SecurityLayout() {
  return <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-background">
        <SecuritySidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <SecurityNavbar />
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
