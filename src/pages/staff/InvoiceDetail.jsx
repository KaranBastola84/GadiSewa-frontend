import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Toast from '../../components/Toast';
import { getSalesInvoiceById, sendInvoiceEmail } from '../../services/staffService';

const Badge = ({ status }) => {
  const styles = {
    Paid: 'bg-green-100 text-green-700',
    Credit: 'bg-orange-100 text-orange-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status || 'Pending'}
    </span>
  );
};

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    (async () => {
      try {
        const res = await getSalesInvoiceById(id);
        setInvoice(res?.data ?? res);
      } catch (err) {
        showToast(err?.response?.data?.message || 'Failed to load invoice', 'error');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      await sendInvoiceEmail(id);
      showToast('Invoice emailed to customer successfully!');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to send email', 'error');
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!invoice) return (
    <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest">Invoice not found</div>
  );

  const items = invoice.items ?? invoice.lineItems ?? [];
  const subtotal = items.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unitPrice ?? item.unitPrice)), 0);
  const total = Number(invoice.totalAmount ?? invoice.total ?? subtotal);
  const discount = subtotal > total ? subtotal - total : 0;
  const customerName = invoice.customerName ||
    (invoice.customer ? `${invoice.customer.firstName ?? ''} ${invoice.customer.lastName ?? ''}`.trim() : '—');

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">
              {invoice.invoiceNumber || `Invoice #${id?.slice(0, 8)}`}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge status={invoice.paymentStatus || invoice.status} />
              <span className="text-slate-400 text-xs font-medium">
                {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleSendEmail}
          disabled={isSendingEmail}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60"
        >
          {isSendingEmail ? (
            <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Sending…</>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Email
            </>
          )}
        </button>
      </div>

      {/* Invoice Card */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Customer info */}
        <div className="p-6 border-b border-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
            <p className="text-base font-bold text-slate-900">{customerName}</p>
            {invoice.customer?.email && <p className="text-sm text-slate-400">{invoice.customer.email}</p>}
            {invoice.customer?.phoneNumber && <p className="text-sm text-slate-500 font-medium">{invoice.customer.phoneNumber}</p>}
            {invoice.customer?.id && (
              <Link to={`/staff/customers/${invoice.customer.id}`} className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block">
                View Profile →
              </Link>
            )}
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicle</p>
            {invoice.vehicleRegistration || invoice.vehicle?.registrationNumber ? (
              <p className="text-base font-bold text-slate-900">
                {invoice.vehicleRegistration || invoice.vehicle?.registrationNumber}
              </p>
            ) : <p className="text-sm text-slate-400">—</p>}
            {invoice.notes && (
              <div className="mt-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Notes</p>
                <p className="text-sm text-slate-600">{invoice.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Line items */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Qty</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Unit Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-sm">No items</td>
                </tr>
              ) : items.map((item, i) => (
                <tr key={item.id ?? i} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{item.partName || item.name || '—'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right">Rs. {Number(item.unitPrice).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                    Rs. {(Number(item.quantity) * Number(item.unitPrice)).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="p-6 border-t border-slate-50 flex justify-end">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-bold text-slate-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-bold flex items-center gap-1">
                  <span>🎉</span> Loyalty Discount (10%)
                </span>
                <span className="font-bold text-green-600">- Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base border-t border-slate-100 pt-2 mt-2">
              <span className="font-black text-slate-900 uppercase tracking-tight">Total</span>
              <span className="font-black text-slate-900">Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;
