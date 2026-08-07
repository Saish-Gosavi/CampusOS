import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { HostelNavbar } from "@/components/hostel/HostelNavbar";
import { WardenNavbar } from "@/components/warden/WardenNavbar";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { SecurityNavbar } from "@/components/security/SecurityNavbar";
import { LibraryNavbar } from "@/components/library/LibraryNavbar";
import { InventoryNavbar } from "@/components/inventory/InventoryNavbar";
import { MessNavbar } from "@/components/mess/MessNavbar";

export function Navbar() {
  const { user } = useAuth();
  const rawRole = typeof user?.role === "string" ? user.role : (user?.role?.name || "");
  const role = rawRole.toLowerCase();

  switch (role) {
    case "superadmin":
      return <AdminNavbar />;
    case "admin":
      return <HostelNavbar />;
    case "warden":
      return <WardenNavbar />;
    case "mess":
    case "messmanager":
    case "mess_manager":
      return <MessNavbar />;
    case "student":
      return <StudentNavbar />;
    case "security":
      return <SecurityNavbar />;
    case "librarian":
      return <LibraryNavbar />;
    case "store":
      return <InventoryNavbar />;
    default:
      return <AdminNavbar />;
  }
}
