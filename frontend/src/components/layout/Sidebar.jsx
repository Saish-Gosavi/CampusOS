import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CollegeAdminSidebar } from "@/components/admin/CollegeAdminSidebar";
import { HostelSidebar } from "@/components/hostel/HostelSidebar";
import { WardenSidebar } from "@/components/warden/WardenSidebar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { SecuritySidebar } from "@/components/security/SecuritySidebar";
import { LibrarySidebar } from "@/components/library/LibrarySidebar";
import { InventorySidebar } from "@/components/inventory/InventorySidebar";

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "";

  switch (role) {
    case "superadmin":
      return <AdminSidebar />;
    case "admin":
      return <CollegeAdminSidebar />;
    case "warden":
      return <WardenSidebar />;
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
