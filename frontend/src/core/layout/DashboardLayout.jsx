import React from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { 
  Home, 
  BookOpen, 
  Package, 
  LogOut, 
  User, 
  Menu, 
  X,
  Bell
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigationItems = [
    { 
      name: 'Hostel Module', 
      path: '/hostel', 
      icon: Home, 
      roles: ['superadmin', 'admin', 'warden', 'security', 'student'] 
    },
    { 
      name: 'Library Module', 
      path: '/library', 
      icon: BookOpen, 
      roles: ['superadmin', 'librarian', 'admin', 'student'] 
    },
    { 
      name: 'Inventory Module', 
      path: '/inventory', 
      icon: Package, 
      roles: ['superadmin', 'department poc', 'principal', 'admin', 'store'] 
    },
  ];

  const visibleItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Portal Management
          </span>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden text-slate-400 hover:text-slate-200"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col justify-between h-[calc(100vh-4rem)] py-6">
          <nav className="px-4 space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 border-t border-slate-800 pt-4">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-slate-900">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-400">
                <User size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Guest User'}</p>
                <p className="text-[10px] text-slate-400 capitalize truncate">{user?.role || 'Guest'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-6 bg-slate-950/50 backdrop-blur-md border-b border-slate-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-400 hover:text-slate-200"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-slate-200">
              {location.pathname === '/' ? 'Overview' : location.pathname.split('/')[1]?.toUpperCase()}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition-all">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
