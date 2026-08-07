import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { HostelSidebar } from "@/components/hostel/HostelSidebar";
import { WardenSidebar } from "@/components/warden/WardenSidebar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { SecuritySidebar } from "@/components/security/SecuritySidebar";
import { LibrarySidebar } from "@/components/library/LibrarySidebar";
import { InventorySidebar } from "@/components/inventory/InventorySidebar";
import { MessSidebar } from "@/components/mess/MessSidebar";

export function Sidebar() {
  const { user } = useAuth();
  const rawRole = typeof user?.role === "string" ? user.role : (user?.role?.name || "");
  const role = rawRole.toLowerCase();

  switch (role) {
    case "superadmin":
      return <AdminSidebar />;
    case "admin":
      return <HostelSidebar />;
    case "warden":
      return <WardenSidebar />;
    case "mess":
    case "messmanager":
    case "mess_manager":
      return <MessSidebar />;
    case "student":
      return <StudentSidebar />;
    case "security":
      return <SecuritySidebar />;
    case "librarian":
      return <LibrarySidebar />;
    case "store":
      return <InventorySidebar />;
    default:
      return <AdminSidebar />;
  }
}
