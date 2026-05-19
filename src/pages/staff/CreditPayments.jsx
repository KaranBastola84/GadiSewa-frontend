import React, { useState, useEffect } from 'react';
import Toast from '../../components/Toast';
import { getCreditPayments, recordCreditPayment, getSalesInvoices } from '../../services/staffService';

const CreditPayments = () => {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    salesInvoiceId: '',
    amount: '',
    paymentMethod: 'Cash',
    referenceNumber: '',
    isVerified: true,
    notes: ''
  });

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getCreditPayments();
      setPayments(res?.result || res?.data || res || []);

      const invoicesRes = await getSalesInvoices();
      const allInvoices = invoicesRes?.result || invoicesRes?.data || invoicesRes || [];
      setInvoices(allInvoices.filter(inv => inv.amountDue > 0));
    } catch (err) {
      showToast(err?.message || 'Failed to fetch live credit settlement data.', 'error');
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.salesInvoiceId) {
      showToast('Please select an invoice', 'error');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    try {
      const payload = {
        salesInvoiceId: formData.salesInvoiceId,
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber || 'N/A',
        isVerified: formData.isVerified,
        notes: formData.notes
      };

      await recordCreditPayment(payload);
      showToast('Credit payment recorded successfully!');
      setShowModal(false);
      setFormData({
        salesInvoiceId: '',
        amount: '',
        paymentMethod: 'Cash',
        referenceNumber: '',
        isVerified: true,
        notes: ''
      });
      loadData();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to submit credit payment to server.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Ledger & Credit Payments</h1>
          <p className="text-slate-400 font-medium">Record and track credit settlement and outstanding customer tabs.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[#1c1c1c] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
        >
          <span>Record Payment</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Date</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer & Invoice</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Method & Ref</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ledger Before</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount Paid</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-xs text-slate-400 font-medium">
                      No ledger transactions or credit payments recorded.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.creditPaymentId} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6 text-xs font-medium text-slate-500">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : 'N/A'}
                      </td>
                      <td className="p-6">
                        <p className="text-xs font-black text-slate-900 tracking-tighter uppercase">{p.customerName || 'Customer'}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{p.invoiceNumber || 'INV-N/A'}</p>
                        {p.notes && <p className="text-[10px] text-slate-400 italic mt-1">"{p.notes}"</p>}
                      </td>
                      <td className="p-6">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{p.paymentMethod}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Ref: {p.referenceNumber || 'N/A'}</p>
                      </td>
                      <td className="p-6 text-xs font-black text-slate-500">Rs. {p.amountBeforePayment.toLocaleString()}</td>
                      <td className="p-6 text-xs font-black text-green-600">Rs. {p.amount.toLocaleString()}</td>
                      <td className="p-6 text-xs font-black text-slate-900">Rs. {p.amountAfterPayment.toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">Record Credit Payment</h2>
                <p className="text-xs text-slate-400 font-medium">Settle customer tab and update invoice ledger.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Active Credit Invoice</label>
                <select
                  value={formData.salesInvoiceId}
                  onChange={(e) => {
                    const sel = invoices.find(inv => inv.id === e.target.value);
                    setFormData(prev => ({
                      ...prev,
                      salesInvoiceId: e.target.value,
                      amount: sel ? sel.amountDue.toString() : ''
                    }));
                  }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 focus:outline-none focus:border-slate-300 transition-all"
                >
                  <option value="">-- Choose Unpaid Invoice --</option>
                  {invoices.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoiceNumber} - {inv.customerName} (Due: Rs. {inv.amountDue.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Amount (Rs.)</label>
                <input
                  type="number"
                  placeholder="Enter amount to pay"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-300 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 focus:outline-none focus:border-slate-300 transition-all"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Esewa">Esewa</option>
                    <option value="Khalti">Khalti</option>
                    <option value="Card">Card / Bank</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reference Number</label>
                  <input
                    type="text"
                    placeholder="TXN ID / Cash Rec"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, referenceNumber: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes / Ledger Remarks</label>
                <textarea
                  placeholder="Any extra details about the transaction"
                  value={formData.notes}
                  rows="3"
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#1c1c1c] hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
              >
                Record Settlement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditPayments;
