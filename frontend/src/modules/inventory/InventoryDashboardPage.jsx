import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Package, RefreshCw, FileText, ClipboardList } from 'lucide-react';

const InventoryDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await api.get('/inventory/items');
      setData(response);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Inventory & Procurement</h2>
          <p className="text-slate-400 text-sm">Overview of stock items, procurement approvals, and assets borrow records.</p>
        </div>
        <button 
          onClick={fetchItems}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-all"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Reload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Total Items Stocked</p>
              <h3 className="text-2xl font-bold text-slate-100">842</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Stationery, electronics, and lab equipment</p>
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-indigo-500/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Procurements Pending</p>
              <h3 className="text-2xl font-bold text-slate-100">8</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Awaiting department head digital signatures</p>
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-teal-500/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-teal-500/10 text-teal-400 rounded-lg">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Items Borrowed</p>
              <h3 className="text-2xl font-bold text-slate-100">34</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Checked out by students & department staff</p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">API Integration Test</h3>
        {loading ? (
          <div className="text-slate-400 text-sm py-4 animate-pulse">Querying Backend Services...</div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm">
            Backend API Disconnected: {error}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
            <p className="text-xs text-slate-400 mb-1">Server Response:</p>
            <pre className="text-sm text-cyan-400 font-mono overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryDashboardPage;
