import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Home, LogOut, CheckCircle, RefreshCw } from 'lucide-react';

const HostelDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hostel/rooms');
      setData(response);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Hostel Management</h2>
          <p className="text-brand-muted text-sm">Overview of students, room allocations, and hostel facilities.</p>
        </div>
        <button 
          onClick={fetchRooms}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-brand-text text-sm font-medium rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Reload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Blue Icon Accent */}
        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-lg">
              <Home size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Total Rooms</p>
              <h3 className="text-2xl font-bold text-brand-text">120</h3>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-blue h-full w-[75%] rounded-full"></div>
          </div>
          <p className="text-xs text-brand-muted mt-2">75% occupied (90 rooms filled)</p>
        </div>

        {/* Card 2: Green Icon Accent */}
        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Allocations Active</p>
              <h3 className="text-2xl font-bold text-brand-text">268</h3>
            </div>
          </div>
          <p className="text-xs text-brand-muted mt-2">All allocations valid for current semester</p>
        </div>

        {/* Card 3: Gold Icon Accent */}
        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg">
              <LogOut size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Pending Leaves</p>
              <h3 className="text-2xl font-bold text-brand-text">12</h3>
            </div>
          </div>
          <p className="text-xs text-brand-muted mt-2">Pending Warden approval</p>
        </div>
      </div>

      <div className="bg-brand-card rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-brand-text mb-4">API Integration Status</h3>
        {loading ? (
          <div className="text-brand-muted text-sm py-4 animate-pulse">Querying Backend Services...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm bg-opacity-5">
            Backend API status: {error}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <p className="text-xs text-brand-muted mb-1">Server Response:</p>
            <pre className="text-sm text-brand-blue font-mono overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelDashboardPage;
