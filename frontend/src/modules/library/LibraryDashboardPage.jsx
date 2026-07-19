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
          <h2 className="text-2xl font-bold text-white">Library Management</h2>
          <p className="text-slate-400 text-sm">Overview of library book catalog, issued volumes, and outstanding fines.</p>
        </div>
        <button 
          onClick={fetchBooks}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-all"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Reload
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-violet-500/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-violet-500/10 text-violet-400 rounded-lg">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Catalog Size</p>
              <h3 className="text-2xl font-bold text-slate-100">14,250</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Books, Journals, and digital assets registered</p>
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-pink-500/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-lg">
              <Bookmark size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Books Issued</p>
              <h3 className="text-2xl font-bold text-slate-100">1,120</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Currently on loan to students & faculty</p>
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 hover:border-red-500/50 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">Overdue Issues</p>
              <h3 className="text-2xl font-bold text-slate-100">45</h3>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Fines pending calculation</p>
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
            <pre className="text-sm text-violet-400 font-mono overflow-auto">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryDashboardPage;
