import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

// Layouts
import DashboardLayout from '../layout/DashboardLayout';

// Pages
import LoginPage from '../auth/LoginPage';
import HostelDashboardPage from '../../modules/hostel/HostelDashboardPage';
import LibraryDashboardPage from '../../modules/library/LibraryDashboardPage';
import InventoryDashboardPage from '../../modules/inventory/InventoryDashboardPage';

// Route guards
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
    return <Navigate to="/" replace />;
  }

  return children;
};

// Root navigator wrapper to forward role to correct main sub-dashboard
const RootNavigator = () => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  
  if (user.role === 'librarian') {
    return <Navigate to="/library" replace />;
  }
  if (user.role === 'store') {
    return <Navigate to="/inventory" replace />;
  }
  return <Navigate to="/hostel" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Main dashboard routes protected by Authentication */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RootNavigator />} />
        
        <Route 
          path="hostel/*" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'warden', 'security', 'student']}>
              <HostelDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="library/*" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'librarian', 'admin', 'student']}>
              <LibraryDashboardPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="inventory/*" 
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'department poc', 'principal', 'admin', 'store']}>
              <InventoryDashboardPage />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
