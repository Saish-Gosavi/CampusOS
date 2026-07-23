import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Auth Components
import { Route as LoginRoute } from "@/routes/login";
import { Route as ForgotPasswordRoute } from "@/routes/forgot-password";
import { Route as VerifyOtpRoute } from "@/routes/verify-otp";
import { Route as ResetPasswordRoute } from "@/routes/reset-password";

// Layouts
import { Route as SuperAdminLayout } from "@/routes/super-admin";
import { Route as HostelAdminLayout } from "@/routes/hostel-admin";
import { Route as WardenLayout } from "@/routes/warden";
import { Route as StudentLayout } from "@/routes/student";
import { Route as SecurityLayout } from "@/routes/security";
import { Route as LibraryLayout } from "@/routes/library-admin";
import { Route as InventoryLayout } from "@/routes/inventory-admin";

// Super Admin Pages
import { Route as SuperAdminIndex } from "@/routes/super-admin.index";
import { Route as SuperAdminAdmins } from "@/routes/super-admin.admins";
import { Route as SuperAdminRoles } from "@/routes/super-admin.roles";
import { Route as SuperAdminColleges } from "@/routes/super-admin.colleges";
import { Route as SuperAdminNotices } from "@/routes/super-admin.notices";
import { Route as SuperAdminSettings } from "@/routes/super-admin.settings";
import { Route as SuperAdminSystemHealth } from "@/routes/super-admin.system-health";
import { Route as SuperAdminProfile } from "@/routes/super-admin.profile";

// Hostel Admin Pages
import { Route as HostelAdminIndex } from "@/routes/hostel-admin.index";
import { Route as HostelAdminStudents } from "@/routes/hostel-admin.students.index";
import { Route as HostelAdminStudentDetail } from "@/routes/hostel-admin.students.$id";
import { Route as HostelAdminRooms } from "@/routes/hostel-admin.rooms.index";
import { Route as HostelAdminRoomDetail } from "@/routes/hostel-admin.rooms.$id.index";
import { Route as HostelAdminRoomEdit } from "@/routes/hostel-admin.rooms.$id.edit";
import { Route as HostelAdminAllocation } from "@/routes/hostel-admin.allocation.index";
import { Route as HostelAdminAllocationNew } from "@/routes/hostel-admin.allocation.new";
import { Route as HostelAdminAllocationChange } from "@/routes/hostel-admin.allocation.change";
import { Route as HostelAdminAllocationHistory } from "@/routes/hostel-admin.allocation.history";
import { Route as HostelAdminComplaints } from "@/routes/hostel-admin.complaints";
import { Route as HostelAdminFees } from "@/routes/hostel-admin.fees.index";
import { Route as HostelAdminVisitors } from "@/routes/hostel-admin.visitors";
import { Route as HostelAdminInOut } from "@/routes/hostel-admin.in-out";
import { Route as HostelAdminLeaves } from "@/routes/hostel-admin.leaves";
import { Route as HostelAdminNotices } from "@/routes/hostel-admin.notices.index";
import { Route as HostelAdminStaff } from "@/routes/hostel-admin.staff";

// Warden Pages
import { Route as WardenIndex } from "@/routes/warden.index";
import { Route as WardenStudents } from "@/routes/warden.students";
import { Route as WardenLeaves } from "@/routes/warden.leaves";
import { Route as WardenVisitors } from "@/routes/warden.visitors";
import { Route as WardenComplaints } from "@/routes/warden.complaints";
import { Route as WardenNotices } from "@/routes/warden.notices";
import { Route as WardenFurniture } from "@/routes/warden.furniture";
import { Route as WardenOccupancy } from "@/routes/warden.occupancy";

// Student Pages
import { Route as StudentIndex } from "@/routes/student.index";
import { Route as StudentRoom } from "@/routes/student.room";
import { Route as StudentLeaves } from "@/routes/student.leaves";
import { Route as StudentVisitors } from "@/routes/student.visitors";
import { Route as StudentComplaints } from "@/routes/student.complaints";
import { Route as StudentFees } from "@/routes/student.fees";
import { Route as StudentBooks } from "@/routes/student.books";

// Security Pages
import { Route as SecurityIndex } from "@/routes/security.index";
import { Route as SecurityInOut } from "@/routes/security.in-out";
import { Route as SecurityQrScanner } from "@/routes/security.qr-scanner";
import { Route as SecurityVisitors } from "@/routes/security.visitors";

// Library Pages
import { Route as LibraryIndex } from "@/routes/library-admin.index";
import { Route as LibraryBooks } from "@/routes/library-admin.books";
import { Route as LibraryCopies } from "@/routes/library-admin.copies";
import { Route as LibraryFines } from "@/routes/library-admin.fines";

// Inventory Pages
import { Route as InventoryIndex } from "@/routes/inventory-admin.index";
import { Route as InventoryItems } from "@/routes/inventory-admin.items";
import { Route as InventoryStock } from "@/routes/inventory-admin.stock";
import { Route as InventoryBorrowing } from "@/routes/inventory-admin.borrowing";

// Route guard wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Root navigator helper
const RootNavigator = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  // Forward to appropriate dashboard based on user role
  if (user.role === "superadmin") return <Navigate to="/super-admin" replace />;
  if (user.role === "admin") return <Navigate to="/hostel-admin" replace />;
  if (user.role === "warden") return <Navigate to="/warden" replace />;
  if (user.role === "librarian") return <Navigate to="/library-admin" replace />;
  if (user.role === "store") return <Navigate to="/inventory-admin" replace />;
  if (user.role === "student") return <Navigate to="/student" replace />;
  
  return <Navigate to="/login" replace />;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginRoute.component />} />
      <Route path="/forgot-password" element={<ForgotPasswordRoute.component />} />
      <Route path="/verify-otp" element={<VerifyOtpRoute.component />} />
      <Route path="/reset-password" element={<ResetPasswordRoute.component />} />

      {/* Navigation Dispatcher */}
      <Route path="/" element={<RootNavigator />} />

      {/* Super Admin Dashboard Routes */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute allowedRoles={["superadmin"]}>
            <SuperAdminLayout.component />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminIndex.component />} />
        <Route path="admins" element={<SuperAdminAdmins.component />} />
        <Route path="roles" element={<SuperAdminRoles.component />} />
        <Route path="colleges" element={<SuperAdminColleges.component />} />
        <Route path="notices" element={<SuperAdminNotices.component />} />
        <Route path="settings" element={<SuperAdminSettings.component />} />
        <Route path="system-health" element={<SuperAdminSystemHealth.component />} />
        <Route path="profile" element={<SuperAdminProfile.component />} />
      </Route>

      {/* Hostel Admin Dashboard Routes */}
      <Route
        path="/hostel-admin"
        element={
          <ProtectedRoute allowedRoles={["superadmin", "admin"]}>
            <HostelAdminLayout.component />
          </ProtectedRoute>
        }
      >
        <Route index element={<HostelAdminIndex.component />} />
        <Route path="students" element={<HostelAdminStudents.component />} />
        <Route path="students/:id" element={<HostelAdminStudentDetail.component />} />
        <Route path="rooms" element={<HostelAdminRooms.component />} />
        <Route path="rooms/:id" element={<HostelAdminRoomDetail.component />} />
        <Route path="rooms/:id/edit" element={<HostelAdminRoomEdit.component />} />
        <Route path="allocation" element={<HostelAdminAllocation.component />} />
        <Route path="allocation/new" element={<HostelAdminAllocationNew.component />} />
        <Route path="allocation/change" element={<HostelAdminAllocationChange.component />} />
        <Route path="allocation/history" element={<HostelAdminAllocationHistory.component />} />
        <Route path="complaints" element={<HostelAdminComplaints.component />} />
        <Route path="fees" element={<HostelAdminFees.component />} />
        <Route path="visitors" element={<HostelAdminVisitors.component />} />
        <Route path="in-out" element={<HostelAdminInOut.component />} />
        <Route path="leaves" element={<HostelAdminLeaves.component />} />
        <Route path="notices" element={<HostelAdminNotices.component />} />
        <Route path="staff" element={<HostelAdminStaff.component />} />
      </Route>

      {/* Warden Dashboard Routes */}
      <Route
        path="/warden"
        element={
          <ProtectedRoute allowedRoles={["superadmin", "warden"]}>
            <WardenLayout.component />
          </ProtectedRoute>
        }
      >
        <Route index element={<WardenIndex.component />} />
        <Route path="students" element={<WardenStudents.component />} />
        <Route path="leaves" element={<WardenLeaves.component />} />
        <Route path="visitors" element={<WardenVisitors.component />} />
        <Route path="complaints" element={<WardenComplaints.component />} />
        <Route path="notices" element={<WardenNotices.component />} />
        <Route path="furniture" element={<WardenFurniture.component />} />
        <Route path="occupancy" element={<WardenOccupancy.component />} />
      </Route>

      {/* Student Dashboard Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["superadmin", "student"]}>
            <StudentLayout.component />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentIndex.component />} />
        <Route path="room" element={<StudentRoom.component />} />
        <Route path="leaves" element={<StudentLeaves.component />} />
        <Route path="visitors" element={<StudentVisitors.component />} />
        <Route path="complaints" element={<StudentComplaints.component />} />
        <Route path="fees" element={<StudentFees.component />} />
        <Route path="books" element={<StudentBooks.component />} />
      </Route>

      {/* Security Routes */}
      <Route
        path="/security"
        element={
          <ProtectedRoute allowedRoles={["superadmin", "security"]}>
            <SecurityLayout.component />
          </ProtectedRoute>
        }
      >
        <Route index element={<SecurityIndex.component />} />
        <Route path="in-out" element={<SecurityInOut.component />} />
        <Route path="qr-scanner" element={<SecurityQrScanner.component />} />
        <Route path="visitors" element={<SecurityVisitors.component />} />
      </Route>

      {/* Library Admin Routes */}
      <Route
        path="/library-admin"
        element={
          <ProtectedRoute allowedRoles={["superadmin", "librarian"]}>
            <LibraryLayout.component />
          </ProtectedRoute>
        }
      >
        <Route index element={<LibraryIndex.component />} />
        <Route path="books" element={<LibraryBooks.component />} />
        <Route path="copies" element={<LibraryCopies.component />} />
        <Route path="fines" element={<LibraryFines.component />} />
      </Route>

      {/* Inventory Admin Routes */}
      <Route
        path="/inventory-admin"
        element={
          <ProtectedRoute allowedRoles={["superadmin", "store"]}>
            <InventoryLayout.component />
          </ProtectedRoute>
        }
      >
        <Route index element={<InventoryIndex.component />} />
        <Route path="items" element={<InventoryItems.component />} />
        <Route path="stock" element={<InventoryStock.component />} />
        <Route path="borrowing" element={<InventoryBorrowing.component />} />
      </Route>

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
