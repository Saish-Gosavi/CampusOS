import React from "react";
import { Building2 } from "lucide-react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";
import PublicRoute from "./PublicRoute";

// Unified Dashboard Layout
import DashboardLayout from "@/layouts/DashboardLayout";

// Auth Components
import { Route as LoginRoute } from "@/pages/auth/Login";
import { Route as ForgotPasswordRoute } from "@/pages/auth/ForgotPassword";
import { Route as VerifyOtpRoute } from "@/pages/auth/VerifyOtp";
import { Route as ResetPasswordRoute } from "@/pages/auth/ResetPassword";
import { Route as RegisterRoute } from "@/pages/auth/Register";
import { Route as AdmissionApprovalRoute } from "@/pages/hostel/admission-approval/index";

// Super Admin Pages
import { Route as SuperAdminIndex } from "@/pages/super-admin/index";
import { Route as SuperAdminAdmins } from "@/pages/super-admin/admins";
import { Route as SuperAdminColleges } from "@/pages/super-admin/colleges";
import { Route as SuperAdminNotices } from "@/pages/super-admin/notices";
import { Route as SuperAdminSettings } from "@/pages/super-admin/settings";
import { Route as SuperAdminProfile } from "@/pages/super-admin/profile";
import { Route as SuperAdminAuditLogs } from "@/pages/super-admin/audit-logs";
import { Route as SuperAdminReports } from "@/pages/super-admin/reports";

// Senior Admin Pages
import { Route as SeniorAdminIndex } from "@/pages/senior-admin/index";
import { Route as SeniorAdminAdmins } from "@/pages/senior-admin/admins";
import { Route as SeniorAdminHostel } from "@/pages/senior-admin/hostel";
import { Route as SeniorAdminLibrary } from "@/pages/senior-admin/library";
import { Route as SeniorAdminInventory } from "@/pages/senior-admin/inventory";
import { Route as SeniorAdminSettings } from "@/pages/super-admin/settings";
import { Route as SeniorAdminProfile } from "@/pages/super-admin/profile";

// Hostel Pages
import { Route as HostelDashboard } from "@/pages/hostel/dashboard/index";
import HostelDashboardPage from "@/modules/hostel/HostelDashboardPage";
import { Route as HostelIndex } from "@/pages/hostel/hostel/index";
import { Route as HostelDetail } from "@/pages/hostel/hostel/$id";
import { Route as HostelAdd } from "@/pages/hostel/hostel/add";
import { Route as HostelBlocks } from "@/pages/hostel/blocks/index";
import { Route as HostelBlockAdd } from "@/pages/hostel/blocks/add";
import { Route as HostelBlockEdit } from "@/pages/hostel/blocks/$id.edit";
import { Route as HostelFloors } from "@/pages/hostel/floors/index";
import { Route as HostelFloorAdd } from "@/pages/hostel/floors/add";
import { Route as HostelFloorEdit } from "@/pages/hostel/floors/$id.edit";
import { Route as HostelRooms } from "@/pages/hostel/rooms/index";
import { Route as HostelRoomDetail } from "@/pages/hostel/rooms/$id/index";
import { Route as HostelRoomEdit } from "@/pages/hostel/rooms/$id/edit";
import { Route as HostelRoomAdd } from "@/pages/hostel/rooms/add";
import { Route as HostelBeds } from "@/pages/hostel/beds/index";
import { Route as HostelBedAdd } from "@/pages/hostel/beds/add";
import { Route as HostelBedEdit } from "@/pages/hostel/beds/$id.edit";
import { Route as HostelAllocations } from "@/pages/hostel/allocations/index";
import { Route as HostelRoomAllotmentLetter } from "@/pages/hostel/allocations/room-allotment-letter";
import { Route as HostelAllocationNew } from "@/pages/hostel/allocations/new";
import { Route as HostelAllocationChange } from "@/pages/hostel/allocations/change";
import { Route as HostelAllocationHistory } from "@/pages/hostel/allocations/history";
import { Route as HostelComplaints } from "@/pages/hostel/complaints/index";
import { Route as HostelLeaves } from "@/pages/hostel/leave/index";
import { Route as HostelVisitors } from "@/pages/hostel/visitors/index";
import { Route as HostelReports } from "@/pages/hostel/reports/index";
import { Route as HostelFurniture } from "@/pages/hostel/furniture/index";
import { Route as HostelFurnitureDamaged } from "@/pages/hostel/furniture/damaged";
import { Route as HostelFurnitureMaintenance } from "@/pages/hostel/furniture/maintenance";
import { Route as HostelFurnitureReplacement } from "@/pages/hostel/furniture/replacement";
import { Route as HostelFees } from "@/pages/hostel/fees/index";
import { Route as HostelFeeManagement } from "@/pages/hostel/fee-management/index";
import { Route as HostelStaff } from "@/pages/hostel/staff/index";
import { Route as HostelStudents } from "@/pages/hostel/students/index";
import { Route as HostelInOut } from "@/pages/hostel/in-out/index";
import { Route as HostelNotices } from "@/pages/hostel/notices/index";

// Warden Pages
import { Route as WardenIndex } from "@/pages/warden/index";
import { Route as WardenStudents } from "@/pages/warden/students";
import { Route as WardenLeaves } from "@/pages/warden/leaves";
import { Route as WardenVisitors } from "@/pages/warden/visitors";
import { Route as WardenAllocationLetter } from "@/pages/warden/allocation-letter";
import { Route as WardenComplaints } from "@/pages/warden/complaints";
import { Route as WardenNotices } from "@/pages/warden/notices";
import { Route as WardenFurniture } from "@/pages/warden/furniture";
import { Route as WardenOccupancy } from "@/pages/warden/occupancy";
import { Route as WardenProfile } from "@/pages/warden/profile";
import { Route as WardenReports } from "@/pages/warden/reports";
import { Route as WardenSettings } from "@/pages/warden/settings";

// Student Pages
import { Route as StudentIndex } from "@/pages/student/index";
import { Route as StudentRoom } from "@/pages/student/room";
import { Route as StudentLeaves } from "@/pages/student/leaves";
import { Route as StudentVisitors } from "@/pages/student/visitors";
import { Route as StudentComplaints } from "@/pages/student/complaints";
import { Route as StudentFees } from "@/pages/student/fees";
import { Route as StudentBooks } from "@/pages/student/books";
import { Route as StudentProfile } from "@/pages/student/profile";
import { Route as StudentSettings } from "@/pages/student/settings";
import { Route as StudentBorrowHistory } from "@/pages/student/borrow-history";
import { Route as StudentBorrowed } from "@/pages/student/borrowed";
import { Route as StudentDocuments } from "@/pages/student/documents";
import { Route as StudentHostelNotices } from "@/pages/student/hostel-notices";
import { Route as StudentFurniture } from "@/pages/student/furniture";
import { Route as StudentLibraryFines } from "@/pages/student/library-fines";
import { Route as StudentLibraryNotices } from "@/pages/student/library-notices";
import { Route as StudentNotifications } from "@/pages/student/notifications";
import { Route as StudentReserve } from "@/pages/student/reserve";

// Security Pages
import { Route as SecurityIndex } from "@/pages/security/index";
import { Route as SecurityInOut } from "@/pages/security/in-out";
import { Route as SecurityQrScanner } from "@/pages/security/qr-scanner";
import { Route as SecurityVisitors } from "@/pages/security/visitors";
import { Route as SecurityGatePass } from "@/pages/security/gate-pass";
import { Route as SecurityIncidents } from "@/pages/security/incidents";
import { Route as SecurityLogs } from "@/pages/security/logs";
import { Route as SecurityNotices } from "@/pages/security/notices";
import { Route as SecurityProfile } from "@/pages/security/profile";
import { Route as SecuritySettings } from "@/pages/security/settings";

// Library Pages
import { Route as LibraryIndex } from "@/pages/library/index";
import { Route as LibraryBooks } from "@/pages/library/books/index";
import { Route as LibraryCopies } from "@/pages/library/copies";
import { Route as LibraryDonations } from "@/pages/library/donations";
import { Route as LibraryFines } from "@/pages/library/fines/index";
import { Route as LibraryIssue } from "@/pages/library/borrow/index";
import { Route as LibraryProfile } from "@/pages/library/profile";
import { Route as LibraryReports } from "@/pages/library/reports";
import { Route as LibraryRequests } from "@/pages/library/requests";
import { Route as LibraryReservations } from "@/pages/library/reservation/index";
import { Route as LibraryReturn } from "@/pages/library/return/index";
import { Route as LibrarySettings } from "@/pages/library/settings";

// Inventory Pages
import { Route as InventoryIndex } from "@/pages/inventory/index";
import { Route as InventoryApprovals } from "@/pages/inventory/approvals";
import { Route as InventoryBorrowing } from "@/pages/inventory/borrowing";
import { Route as InventoryItems } from "@/pages/inventory/items/index";
import { Route as InventoryProfile } from "@/pages/inventory/profile";
import { Route as InventoryReceipts } from "@/pages/inventory/receipts";
import { Route as InventoryReports } from "@/pages/inventory/reports";
import { Route as InventoryRequests } from "@/pages/inventory/requests/index";
import { Route as InventorySettings } from "@/pages/inventory/settings";
import { Route as InventoryStock } from "@/pages/inventory/stock/index";

// Error Pages
import { Route as Error403 } from "@/pages/errors/403";
import { Route as Error404 } from "@/pages/errors/404";

function SeniorAdminTypoRedirect() {
  const location = useLocation();
  const cleanPath = location.pathname.replace(/\/senior%20admin|\/senior admin/gi, "/senior-admin");
  return <Navigate to={cleanPath + location.search} replace />;
}

function GenericModuleShell({ title, description }) {
  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
        <p className="text-base font-semibold text-foreground">{title} Module Active</p>
        <p className="mt-1 text-sm text-muted-foreground">This module section is configured and ready for operational records.</p>
      </div>
    </div>
  );
}

// Root navigator helper
const RootNavigator = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  const rawRole = typeof user.role === "string" ? user.role : (user.role?.name || "");
  const role = rawRole.toLowerCase();
  
  if (role === "superadmin") return <Navigate to="/super-admin" replace />;
  if (role === "senioradmin") return <Navigate to="/senior-admin" replace />;
  if (role === "admin") return <Navigate to="/hostel-admin" replace />;
  if (role === "warden") return <Navigate to="/warden" replace />;
  if (role === "librarian") return <Navigate to="/library-admin" replace />;
  if (role === "store") return <Navigate to="/inventory-admin" replace />;
  if (role === "student") return <Navigate to="/student" replace />;
  
  return <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><LoginRoute.component /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordRoute.component /></PublicRoute>} />
      <Route path="/verify-otp" element={<PublicRoute><VerifyOtpRoute.component /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordRoute.component /></PublicRoute>} />
      <Route path="/register" element={<RegisterRoute.component />} />

      {/* Navigation Dispatcher */}
      <Route path="/" element={<RootNavigator />} />

      {/* Super Admin Dashboard Routes */}
      <Route
        path="/super-admin"
        element={
          <RoleRoute allowedRoles={["superadmin"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<SuperAdminIndex.component />} />
        <Route path="admins" element={<SuperAdminAdmins.component />} />
        <Route path="colleges" element={<SuperAdminColleges.component />} />
        <Route path="notices" element={<SuperAdminNotices.component />} />
        <Route path="settings" element={<SuperAdminSettings.component />} />
        <Route path="profile" element={<SuperAdminProfile.component />} />
        <Route path="audit-logs" element={<SuperAdminAuditLogs.component />} />
        <Route path="reports" element={<SuperAdminReports.component />} />
      </Route>

      {/* Senior Admin Dashboard Routes */}
      <Route
        path="/senior-admin"
        element={
          <RoleRoute allowedRoles={["senioradmin"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<SeniorAdminIndex.component />} />
        <Route path="admins" element={<SeniorAdminAdmins.component />} />
        <Route path="hostel" element={<SeniorAdminHostel.component />} />
        <Route path="library" element={<SeniorAdminLibrary.component />} />
        <Route path="inventory" element={<SeniorAdminInventory.component />} />
        <Route path="settings" element={<SeniorAdminSettings.component />} />
        <Route path="profile" element={<SeniorAdminProfile.component />} />
      </Route>

      {/* Graceful redirects for senior admin spacing typos */}
      <Route path="/senior admin" element={<SeniorAdminTypoRedirect />} />
      <Route path="/senior admin/*" element={<SeniorAdminTypoRedirect />} />
      <Route path="/senior%20admin" element={<SeniorAdminTypoRedirect />} />
      <Route path="/senior%20admin/*" element={<SeniorAdminTypoRedirect />} />

      {/* Hostel Admin Dashboard Routes */}
      <Route
        path="/hostel-admin"
        element={
          <RoleRoute allowedRoles={["superadmin", "admin"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<HostelDashboardPage />} />
        <Route path="students" element={<HostelStudents.component />} />
        <Route path="rooms" element={<HostelRooms.component />} />
        <Route path="rooms/:id" element={<HostelRoomDetail.component />} />
        <Route path="rooms/:id/edit" element={<HostelRoomEdit.component />} />
        <Route path="rooms/add" element={<HostelRoomAdd.component />} />
        <Route path="allocation" element={<HostelAllocations.component />} />
        <Route path="allocation/allotment-letter" element={<HostelRoomAllotmentLetter.component />} />
        <Route path="allocation-letter" element={<HostelRoomAllotmentLetter.component />} />
        <Route path="allocation/new" element={<HostelAllocationNew.component />} />
        <Route path="allocation/change" element={<HostelAllocationChange.component />} />
        <Route path="allocation/history" element={<HostelAllocationHistory.component />} />
        <Route path="admission-approval" element={<AdmissionApprovalRoute.component />} />
        <Route path="complaints" element={<HostelComplaints.component />} />
        <Route path="fees" element={<HostelFees.component />} />
        <Route path="fee-management" element={<HostelFeeManagement.component />} />
        <Route path="visitors" element={<HostelVisitors.component />} />
        <Route path="in-out" element={<HostelInOut.component />} />
        <Route path="leaves" element={<HostelLeaves.component />} />
        <Route path="notices" element={<HostelNotices.component />} />
        <Route path="staff" element={<HostelStaff.component />} />
        <Route path="reports" element={<HostelReports.component />} />
        <Route path="furniture" element={<HostelFurniture.component />} />
        <Route path="furniture/damaged" element={<HostelFurnitureDamaged.component />} />
        <Route path="furniture/maintenance" element={<HostelFurnitureMaintenance.component />} />
        <Route path="furniture/replacement" element={<HostelFurnitureReplacement.component />} />
        <Route path="hostels" element={<HostelIndex.component />} />
        <Route path="hostels/:id" element={<HostelDetail.component />} />
        <Route path="hostels/add" element={<HostelAdd.component />} />
        <Route path="beds" element={<HostelBeds.component />} />
        <Route path="beds/add" element={<HostelBedAdd.component />} />
        <Route path="beds/:id/edit" element={<HostelBedEdit.component />} />
        <Route path="blocks" element={<HostelBlocks.component />} />
        <Route path="blocks/add" element={<HostelBlockAdd.component />} />
        <Route path="blocks/:id/edit" element={<HostelBlockEdit.component />} />
        <Route path="floors" element={<HostelFloors.component />} />
        <Route path="floors/add" element={<HostelFloorAdd.component />} />
        <Route path="floors/:id/edit" element={<HostelFloorEdit.component />} />
      </Route>

      {/* Warden Dashboard Routes */}
      <Route
        path="/warden"
        element={
          <RoleRoute allowedRoles={["superadmin", "warden"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<WardenIndex.component />} />
        <Route path="students" element={<WardenStudents.component />} />
        <Route path="leaves" element={<WardenLeaves.component />} />
        <Route path="visitors" element={<WardenVisitors.component />} />
        <Route path="allocation-letter" element={<WardenAllocationLetter.component />} />
        <Route path="complaints" element={<WardenComplaints.component />} />
        <Route path="notices" element={<WardenNotices.component />} />
        <Route path="furniture" element={<WardenFurniture.component />} />
        <Route path="occupancy" element={<WardenOccupancy.component />} />
        <Route path="profile" element={<WardenProfile.component />} />
        <Route path="reports" element={<WardenReports.component />} />
        <Route path="settings" element={<WardenSettings.component />} />
      </Route>

      {/* Student Dashboard Routes */}
      <Route
        path="/student"
        element={
          <RoleRoute allowedRoles={["superadmin", "student"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<StudentIndex.component />} />
        <Route path="room" element={<StudentRoom.component />} />
        <Route path="leaves" element={<StudentLeaves.component />} />
        <Route path="visitors" element={<StudentVisitors.component />} />
        <Route path="complaints" element={<StudentComplaints.component />} />
        <Route path="fees" element={<StudentFees.component />} />
        <Route path="books" element={<StudentBooks.component />} />
        <Route path="profile" element={<StudentProfile.component />} />
        <Route path="settings" element={<StudentSettings.component />} />
        <Route path="borrow-history" element={<StudentBorrowHistory.component />} />
        <Route path="borrowed" element={<StudentBorrowed.component />} />
        <Route path="documents" element={<StudentDocuments.component />} />
        <Route path="hostel-notices" element={<StudentHostelNotices.component />} />
        <Route path="furniture" element={<StudentFurniture.component />} />
        <Route path="library-fines" element={<StudentLibraryFines.component />} />
        <Route path="library-notices" element={<StudentLibraryNotices.component />} />
        <Route path="notifications" element={<StudentNotifications.component />} />
        <Route path="reserve" element={<StudentReserve.component />} />
      </Route>

      {/* Security Routes */}
      <Route
        path="/security"
        element={
          <RoleRoute allowedRoles={["superadmin", "security"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<SecurityIndex.component />} />
        <Route path="in-out" element={<SecurityInOut.component />} />
        <Route path="qr-scanner" element={<SecurityQrScanner.component />} />
        <Route path="visitors" element={<SecurityVisitors.component />} />
        <Route path="gate-pass" element={<SecurityGatePass.component />} />
        <Route path="incidents" element={<SecurityIncidents.component />} />
        <Route path="logs" element={<SecurityLogs.component />} />
        <Route path="notices" element={<SecurityNotices.component />} />
        <Route path="profile" element={<SecurityProfile.component />} />
        <Route path="settings" element={<SecuritySettings.component />} />
      </Route>

      {/* Library Admin Routes */}
      <Route
        path="/library-admin"
        element={
          <RoleRoute allowedRoles={["superadmin", "librarian"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<LibraryIndex.component />} />
        <Route path="books" element={<LibraryBooks.component />} />
        <Route path="copies" element={<LibraryCopies.component />} />
        <Route path="donations" element={<LibraryDonations.component />} />
        <Route path="fines" element={<LibraryFines.component />} />
        <Route path="issue" element={<LibraryIssue.component />} />
        <Route path="profile" element={<LibraryProfile.component />} />
        <Route path="reports" element={<LibraryReports.component />} />
        <Route path="requests" element={<LibraryRequests.component />} />
        <Route path="reservations" element={<LibraryReservations.component />} />
        <Route path="return" element={<LibraryReturn.component />} />
        <Route path="settings" element={<LibrarySettings.component />} />
      </Route>

      {/* Inventory Admin Routes */}
      <Route
        path="/inventory-admin"
        element={
          <RoleRoute allowedRoles={["superadmin", "store"]}>
            <DashboardLayout />
          </RoleRoute>
        }
      >
        <Route index element={<InventoryIndex.component />} />
        <Route path="approvals" element={<InventoryApprovals.component />} />
        <Route path="borrowing" element={<InventoryBorrowing.component />} />
        <Route path="items" element={<InventoryItems.component />} />
        <Route path="profile" element={<InventoryProfile.component />} />
        <Route path="receipts" element={<InventoryReceipts.component />} />
        <Route path="reports" element={<InventoryReports.component />} />
        <Route path="requests" element={<InventoryRequests.component />} />
        <Route path="settings" element={<InventorySettings.component />} />
        <Route path="stock" element={<InventoryStock.component />} />
      </Route>

      {/* Fallback Error Routes */}
      <Route path="/403" element={<Error403.component />} />
      <Route path="/404" element={<Error404.component />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
