import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSalesInvoices } from '../../services/staffService';

const STATUS_OPTIONS = ['All', 'Paid', 'Credit', 'Pending', 'Cancelled'];

const statusStyle = (s) => {
  switch (s) {
    case 'Paid': return 'bg-green-50 text-green-600';
    case 'Credit': return 'bg-orange-50 text-orange-600';
    case 'Cancelled': return 'bg-red-50 text-red-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSalesInvoices();
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        setInvoices(list);
        setFiltered(list);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load invoices');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let list = invoices;
    if (statusFilter !== 'All') {
      list = list.filter(inv => (inv.paymentStatus || inv.status) === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(inv =>
        (inv.invoiceNumber || '').toLowerCase().includes(q) ||
        (inv.customerName || inv.customer?.name || '').toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [statusFilter, search, invoices]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Sales Invoices</h1>
          <p className="text-slate-400 font-medium">{invoices.length} total invoices</p>
        </div>
        <Link
          to="/staff/invoices/create"
          className="bg-[#1a1a1a] hover:bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Invoice
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">{error}</div>
      )}

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Filters bar */}
        <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search invoice or customer…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  statusFilter === s ? 'bg-[#1a1a1a] text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  {['Invoice #', 'Customer', 'Date', 'Total', 'Payment', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No invoices found</td>
                  </tr>
                ) : filtered.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-blue-600">
                      {inv.invoiceNumber || `INV-${inv.id?.toString().slice(0, 6)}`}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-900">
                        {inv.customerName || `${inv.customer?.firstName ?? ''} ${inv.customer?.lastName ?? ''}`.trim() || '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">
                      Rs. {Number(inv.totalAmount ?? inv.total ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${statusStyle(inv.paymentStatus || inv.status)}`}>
                        {inv.paymentStatus || inv.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/staff/invoices/${inv.id}`}
                        className="text-xs font-bold text-blue-600 hover:underline uppercase tracking-widest"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
