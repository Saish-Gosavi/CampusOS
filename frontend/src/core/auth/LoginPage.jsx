import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Lock, Mail, Users } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('superadmin');

  const rolesList = [
    { value: 'superadmin', label: 'Super Admin (All Modules)' },
    { value: 'warden', label: 'Warden (Hostel Module)' },
    { value: 'librarian', label: 'Librarian (Library Module)' },
    { value: 'store', label: 'Store Manager (Inventory Module)' },
    { value: 'student', label: 'Student (Hostel & Library Modules)' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    const mockUserData = {
      id: 1,
      name: role === 'superadmin' ? 'Super Admin User' : `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
      email: `${role}@college.edu`,
      role: role
    };
    
    const mockToken = 'mocked-jwt-token-string';
    
    login(mockUserData, mockToken);
    
    if (role === 'warden' || role === 'student') {
      navigate('/hostel');
    } else if (role === 'librarian') {
      navigate('/library');
    } else if (role === 'store') {
      navigate('/inventory');
    } else {
      navigate('/hostel');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg px-4 font-sans text-brand-text">
      <div className="w-full max-w-md bg-brand-card p-8 rounded-2xl border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          {/* Brand navigation start to end colors simulated on title */}
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-brand-nav-start to-brand-nav-end bg-clip-text text-transparent">
            College Portal
          </h2>
          <p className="text-sm text-brand-muted mt-2">Single Sign-On Authentication Interface</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">
              Select Simulated Identity
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-muted">
                <Users size={18} />
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-slate-200 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple text-sm text-brand-text outline-none appearance-none transition-all cursor-pointer"
              >
                {rolesList.map((r) => (
                  <option key={r.value} value={r.value} className="bg-white text-brand-text">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative opacity-60 pointer-events-none">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-muted">
                <Mail size={18} />
              </span>
              <input
                type="email"
                disabled
                placeholder={`${role}@college.edu`}
                className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-slate-200 rounded-xl text-sm text-brand-muted outline-none"
              />
            </div>
          </div>

          <div className="relative opacity-60 pointer-events-none">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brand-muted">
                <Lock size={18} />
              </span>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-brand-bg border border-slate-200 rounded-xl text-sm text-brand-muted outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-medium rounded-xl shadow-lg shadow-brand-purple/20 transition-all text-sm cursor-pointer"
          >
            Authenticate Securely
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
