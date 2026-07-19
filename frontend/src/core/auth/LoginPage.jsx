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
    <div className="flex items-center justify-center min-h-screen bg-slate-950 px-4 font-sans text-slate-100">
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            College Portal
          </h2>
          <p className="text-sm text-slate-400 mt-2">Single Sign-On Authentication Interface</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Select Simulated Identity
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Users size={18} />
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-slate-200 outline-none appearance-none transition-all cursor-pointer"
              >
                {rolesList.map((r) => (
                  <option key={r.value} value={r.value} className="bg-slate-900 text-slate-200">
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="relative opacity-60 pointer-events-none">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                disabled
                placeholder={`${role}@college.edu`}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="relative opacity-60 pointer-events-none">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-400 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm"
          >
            Authenticate Securely
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
