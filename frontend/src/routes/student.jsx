import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { StudentNavbar } from "@/components/student/StudentNavbar";
const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Portal \u2014 CampusOS" },
      { name: "description", content: "Unified student portal for hostel and library services at VPPCOE." },
      { property: "og:title", content: "Student Portal \u2014 CampusOS" },
      { property: "og:description", content: "One login for hostel life, library, fees, complaints and notices." }
    ]
  }),
  component: StudentLayout
});
function StudentLayout() {
  return <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC] dark:bg-background">
        <StudentSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <StudentNavbar />
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
