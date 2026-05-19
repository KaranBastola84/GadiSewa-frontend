import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../../components/Toast';
import { searchCustomers, searchByVehicle, searchByPhone } from '../../services/staffService';

const TABS = ['name', 'vehicle', 'phone'];

const CustomerSearch = () => {
  const [activeTab, setActiveTab] = useState('name');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => setToast({ message, type });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    setSearched(false);
    try {
      let data;
      if (activeTab === 'name') data = await searchCustomers(query.trim());
      else if (activeTab === 'vehicle') data = await searchByVehicle(query.trim());
      else data = await searchByPhone(query.trim());

      // normalise: API may return {data:[...]} or directly [...]
      const list = Array.isArray(data) ? data : (data?.data ?? []);
      setResults(list);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
      setSearched(true);
    }
  };

  const placeholders = {
    name: 'Search by name or email…',
    vehicle: 'Enter vehicle registration number…',
    phone: 'Enter phone number…',
  };

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Customer Search</h1>
          <p className="text-slate-400 font-medium">Find customers by name, vehicle, or phone.</p>
        </div>
        <Link
          to="/staff/customers/register"
          className="bg-[#1a1a1a] hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Register New
        </Link>
      </div>

      {/* Search card */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 space-y-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-50 p-1 rounded-xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setResults([]); setSearched(false); setQuery(''); }}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'name' ? 'By Name' : tab === 'vehicle' ? 'By Vehicle' : 'By Phone'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholders[activeTab]}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="bg-[#1a1a1a] hover:bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? '...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Results */}
      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {searched && !isLoading && (
        results.length === 0 ? (
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-12 flex flex-col items-center text-center">
            <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-bold text-slate-900 uppercase tracking-widest text-sm">No results found</p>
            <p className="text-slate-400 text-xs mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map(customer => (
              <Link
                key={customer.id}
                to={`/staff/customers/${customer.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-blue-500 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-600 text-sm uppercase group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors flex-shrink-0">
                    {(customer.firstName || customer.fullName || 'C')[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm truncate">
                      {customer.firstName && customer.lastName
                        ? `${customer.firstName} ${customer.lastName}`
                        : customer.fullName || 'Customer'}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{customer.email || '—'}</p>
                    <p className="text-xs font-bold text-slate-600 mt-1">{customer.phoneNumber || customer.phone || '—'}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default CustomerSearch;
