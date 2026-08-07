import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "./Footer";

export function BaseDashboardLayout({ Sidebar, Navbar, bgClass = "bg-[#F9FAFB]" }) {
  return (
    <SidebarProvider>
      <div className={`flex min-h-screen w-full bg-background dark:bg-background`}>
        {Sidebar && <Sidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          {Navbar && <Navbar />}
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
