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
          <h2 className="text-2xl font-bold text-brand-text">Inventory & Procurement</h2>
          <p className="text-brand-muted text-sm">Overview of stock items, procurement approvals, and assets borrow records.</p>
        </div>
        <button 
          onClick={fetchItems}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-brand-text text-sm font-medium rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Reload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-blue/10 text-brand-blue rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Total Items Stocked</p>
              <h3 className="text-2xl font-bold text-brand-text">842</h3>
            </div>
          </div>
          <p className="text-xs text-brand-muted mt-2">Stationery, electronics, and lab equipment</p>
        </div>

        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Procurements Pending</p>
              <h3 className="text-2xl font-bold text-brand-text">8</h3>
            </div>
          </div>
          <p className="text-xs text-brand-muted mt-2">Awaiting department head digital signatures</p>
        </div>

        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg">
              <ClipboardList size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Items Borrowed</p>
              <h3 className="text-2xl font-bold text-brand-text">34</h3>
            </div>
          </div>
          <p className="text-xs text-brand-muted mt-2">Checked out by students & department staff</p>
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

export default InventoryDashboardPage;
