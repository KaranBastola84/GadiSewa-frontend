import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Toast from '../../components/Toast';
import { getParts, createSalesInvoice, searchCustomers } from '../../services/staffService';

const LOYALTY_THRESHOLD = 5000;
const LOYALTY_DISCOUNT = 0.10;

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [parts, setParts] = useState([]);
  const [lineItems, setLineItems] = useState([{ partId: '', partName: '', quantity: 1, unitPrice: 0 }]);
  const [paymentStatus, setPaymentStatus] = useState('Paid');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Customer selection
  const [customerQuery, setCustomerQuery] = useState(searchParams.get('customerName') || '');
  const [selectedCustomer, setSelectedCustomer] = useState(
    searchParams.get('customerId')
      ? { id: searchParams.get('customerId'), name: searchParams.get('customerName') || '' }
      : null
  );
  const [customerResults, setCustomerResults] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getParts();
        setParts(Array.isArray(res) ? res : (res?.data ?? []));
      } catch (_) { /* parts optional */ }
      finally { setIsLoading(false); }
    })();
  }, []);

  const searchForCustomer = useCallback(async (q) => {
    if (!q || q.length < 2) { setCustomerResults([]); return; }
    setIsSearching(true);
    try {
      const res = await searchCustomers(q);
      setCustomerResults(Array.isArray(res) ? res : (res?.data ?? []));
      setShowCustomerDropdown(true);
    } catch (_) { setCustomerResults([]); }
    finally { setIsSearching(false); }
  }, []);

  useEffect(() => {
    if (selectedCustomer) return;
    const delay = setTimeout(() => searchForCustomer(customerQuery), 400);
    return () => clearTimeout(delay);
  }, [customerQuery, selectedCustomer, searchForCustomer]);

  const selectCustomer = (c) => {
    const name = c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.fullName || c.name || 'Customer';
    setSelectedCustomer({ id: c.id, name });
    setCustomerQuery(name);
    setShowCustomerDropdown(false);
  };

  // Line item helpers
  const updateLineItem = (idx, field, value) => {
    setLineItems(prev => prev.map((item, i) => {
      if (i !== idx) return item;
      const updated = { ...item, [field]: value };
      if (field === 'partId') {
        const found = parts.find(p => p.id === value);
        if (found) {
          updated.partName = found.name || found.partName || '';
          updated.unitPrice = found.sellingPrice ?? found.price ?? 0;
        }
      }
      return updated;
    }));
  };

  const addLine = () => setLineItems(prev => [...prev, { partId: '', partName: '', quantity: 1, unitPrice: 0 }]);
  const removeLine = (idx) => setLineItems(prev => prev.filter((_, i) => i !== idx));

  // Totals
  const subtotal = lineItems.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice)), 0);
  const hasLoyaltyDiscount = subtotal > LOYALTY_THRESHOLD;
  const discountAmount = hasLoyaltyDiscount ? subtotal * LOYALTY_DISCOUNT : 0;
  const total = subtotal - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) { showToast('Please select a customer', 'error'); return; }
    const validLines = lineItems.filter(item => item.partId || item.partName);
    if (validLines.length === 0) { showToast('Add at least one line item', 'error'); return; }

    setIsSubmitting(true);
    try {
      const payload = {
        customerId: selectedCustomer.id,
        invoiceDate: new Date().toISOString(),
        taxAmount: 0,
        items: lineItems.map(item => ({
          partId: item.partId || null,
          description: item.partName || parts.find(p => p.id === item.partId)?.name || 'Part Sale',
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
        })),
      };
      const res = await createSalesInvoice(payload);
      const newId = res?.data?.id || res?.id;
      showToast('Invoice created successfully!');
      setTimeout(() => navigate(newId ? `/staff/invoices/${newId}` : '/staff/invoices'), 1200);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to create invoice', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Create Invoice</h1>
          <p className="text-slate-400 font-medium">Add items and select customer</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Customer selection */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5">Customer</h2>
          <div className="relative max-w-md">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search customer by name…"
              value={customerQuery}
              onChange={e => { setCustomerQuery(e.target.value); setSelectedCustomer(null); }}
              onFocus={() => customerResults.length > 0 && setShowCustomerDropdown(true)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
            {showCustomerDropdown && customerResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                {customerResults.map(c => {
                  const name = c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.fullName || 'Customer';
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => selectCustomer(c)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                    >
                      <p className="text-sm font-bold text-slate-900">{name}</p>
                      <p className="text-xs text-slate-400">{c.phoneNumber || c.phone || c.email || ''}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {selectedCustomer && (
            <div className="mt-3 flex items-center gap-2 text-sm font-bold text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {selectedCustomer.name} selected
            </div>
          )}
        </div>

        {/* Line items */}
        <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Items</h2>
            <button type="button" onClick={addLine} className="text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Header row */}
              <div className="hidden md:grid grid-cols-12 gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                <div className="col-span-5">Part</div>
                <div className="col-span-2">Qty</div>
                <div className="col-span-3">Unit Price (Rs.)</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {lineItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-12 md:col-span-5">
                    {parts.length > 0 ? (
                      <select
                        value={item.partId}
                        onChange={e => updateLineItem(idx, 'partId', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500 text-slate-900 transition-colors"
                      >
                        <option value="">Select a part…</option>
                        {parts.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name || p.partName} — Rs. {(p.sellingPrice ?? p.price ?? 0).toLocaleString()}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Part name"
                        value={item.partName}
                        onChange={e => updateLineItem(idx, 'partName', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    )}
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => updateLineItem(idx, 'quantity', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500 text-center transition-colors"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <input
                      type="number"
                      min="0"
                      value={item.unitPrice}
                      onChange={e => updateLineItem(idx, 'unitPrice', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      Rs. {(Number(item.quantity) * Number(item.unitPrice)).toLocaleString()}
                    </span>
                    {lineItems.length > 1 && (
                      <button type="button" onClick={() => removeLine(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary + Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Notes + Payment */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Payment & Notes</h2>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Payment Status</label>
              <div className="flex gap-2 mt-2">
                {['Paid', 'Credit'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPaymentStatus(s)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      paymentStatus === s ? (s === 'Paid' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white') : 'bg-slate-50 text-slate-400 border border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Optional notes…"
                className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-blue-500 resize-none transition-colors"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
            <div className="space-y-3">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Summary</h2>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {hasLoyaltyDiscount && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                      🎉 10% Loyalty Discount
                    </span>
                  </div>
                  <span className="font-bold text-green-600">- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-lg border-t border-slate-100 pt-3">
                <span className="font-black text-slate-900 uppercase tracking-tight">Total</span>
                <span className="font-black text-slate-900">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Creating…</>
              ) : 'Create Invoice →'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
