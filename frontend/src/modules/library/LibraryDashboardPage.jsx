import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { BookOpen, RefreshCw, Bookmark, AlertCircle } from 'lucide-react';

const LibraryDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/library/books');
      setData(response);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-text">Library Management</h2>
          <p className="text-brand-muted text-sm">Overview of library book catalog, issued volumes, and outstanding fines.</p>
        </div>
        <button 
          onClick={fetchBooks}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-brand-text text-sm font-medium rounded-lg shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Reload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-purple/10 text-brand-purple rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Catalog Size</p>
              <h3 className="text-2xl font-bold text-brand-text">14,250</h3>
            </div>
          </div>
          <p className="text-xs text-brand-muted mt-2">Books, Journals, and digital assets registered</p>
        </div>

        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-green/10 text-brand-green rounded-lg">
              <Bookmark size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Books Issued</p>
              <h3 className="text-2xl font-bold text-brand-text">1,120</h3>
            </div>
          </div>
          <p className="text-xs text-brand-muted mt-2">Currently on loan to students & faculty</p>
        </div>

        <div className="bg-brand-card p-6 rounded-xl border border-slate-200 hover:shadow-md transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-gold/10 text-brand-gold rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-brand-muted text-xs uppercase font-semibold tracking-wider">Overdue Issues</p>
              <h3 className="text-2xl font-bold text-brand-text">45</h3>
            </div>
          </div>
          <p className="text-xs text-brand-muted mt-2">Fines pending calculation</p>
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
            <pre className="text-sm text-brand-purple font-mono overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryDashboardPage;
