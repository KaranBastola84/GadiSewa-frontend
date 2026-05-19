import React, { useState, useEffect } from "react";
import StaffLayout from "../../components/StaffLayout";
import apiConfig from "../../config/apiConfig";
import { Loader2, Plus, Banknote, CreditCard, ChevronDown } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CreditPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Controlled form inputs matching exactly CreateCreditPaymentRequestDto.cs
  const [formData, setFormData] = useState({
    salesInvoiceId: "",
    amount: "",
    paymentMethod: "Cash",
    referenceNumber: "",
    notes: ""
  });

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await apiConfig.get("/credit-payments");
      setPayments(res.data?.result || res.data || []);
    } catch (err) {
      toast.error("Failed to load credit payments.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const payload = {
        salesInvoiceId: formData.salesInvoiceId.trim(),
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        referenceNumber: formData.referenceNumber.trim(),
        isVerified: true,
        notes: formData.notes.trim()
      };

      await apiConfig.post("/credit-payments", payload);
      
      toast.success("Payment recorded successfully!");
      setShowForm(false);
      setFormData({
        salesInvoiceId: "",
        amount: "",
        paymentMethod: "Cash",
        referenceNumber: "",
        notes: ""
      });
      
      // Refresh list
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StaffLayout pageTitle="Credit Payments" subtitle="Manage and record customer credit settlements.">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-emerald-500/20"
        >
          {showForm ? <ChevronDown className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showForm ? "Cancel Entry" : "Record Payment"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-lg shadow-emerald-100/50 mb-8 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">New Payment Entry</h2>
              <p className="text-sm text-slate-500">Record a new payment for a credit invoice.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Invoice ID (UUID) *</label>
                <input 
                  type="text" 
                  name="salesInvoiceId"
                  required
                  value={formData.salesInvoiceId}
                  onChange={handleChange}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Amount (रु) *</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0.01"
                  name="amount"
                  required
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="e.g. 1500"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Payment Method *</label>
                <select 
                  name="paymentMethod"
                  required
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="Cash">Cash</option>
                  <option value="FonePay">FonePay</option>
                  <option value="eSewa">eSewa</option>
                  <option value="Khalti">Khalti</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Reference / Transaction ID</label>
                <input 
                  type="text"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. TXN-9842"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
              <textarea 
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                maxLength={500}
                placeholder="Any special notes about this payment..."
                rows="2"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm font-medium resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors text-sm"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 text-sm"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Record Payment</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment History List */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Payment History</h2>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="font-medium">No recorded payments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Customer / Invoice</th>
                  <th className="px-6 py-4 font-semibold text-right">Amount Paid</th>
                  <th className="px-6 py-4 font-semibold">Method & Ref</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(payment => (
                  <tr key={payment.creditPaymentId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900 block">{payment.customerName}</span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        INV: {payment.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-800 text-lg">
                      रु {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700 block">{payment.paymentMethod}</span>
                      <span className="text-xs text-slate-400">{payment.referenceNumber || "-"}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
