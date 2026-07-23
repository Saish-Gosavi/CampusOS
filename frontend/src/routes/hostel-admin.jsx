import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { HostelSidebar } from "@/components/hostel/HostelSidebar";
import { HostelNavbar } from "@/components/hostel/HostelNavbar";
const Route = createFileRoute("/hostel-admin")({
  head: () => ({
    meta: [
      { title: "Hostel Admin \u2014 CampusOS" },
      {
        name: "description",
        content: "Manage students, rooms, staff, fees, complaints and notices for the hostel."
      }
    ]
  }),
  component: HostelLayout
});
function HostelLayout() {
  return <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F9FAFB] dark:bg-background">
        <HostelSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <HostelNavbar />
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
