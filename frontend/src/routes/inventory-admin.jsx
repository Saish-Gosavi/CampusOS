import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InventorySidebar } from "@/components/inventory/InventorySidebar";
import { InventoryNavbar } from "@/components/inventory/InventoryNavbar";
const Route = createFileRoute("/inventory-admin")({
  head: () => ({
    meta: [
      { title: "Inventory Admin \u2014 CampusOS" },
      {
        name: "description",
        content: "Manage stock, procurement requests, approvals, goods receipt and borrowings across the college."
      }
    ]
  }),
  component: InventoryLayout
});
function InventoryLayout() {
  return <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F9FAFB] dark:bg-background">
        <InventorySidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <InventoryNavbar />
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
