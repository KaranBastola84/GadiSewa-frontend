import { useState, useEffect } from "react";
import StaffLayout from "../../components/StaffLayout";
import creditPaymentsService from "../../services/creditPaymentsService";
import reportsService from "../../services/reportsService";
import { CreditCard, Plus, Calendar, User, Search, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

export default function StaffCreditPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [pendingInvoices, setPendingInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Record payment modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [form, setForm] = useState({
    salesInvoiceId: "",
    amount: "",
    paymentMethod: "Cash",
    referenceNumber: "",
    notes: "",
  });
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [payRes, invRes] = await Promise.all([
        creditPaymentsService.getCreditPayments(),
        reportsService.getPendingCredits(),
      ]);

      const rawPayments = Array.isArray(payRes) ? payRes : payRes?.result || [];
      const rawInvoices = Array.isArray(invRes) ? invRes : invRes?.result || [];

      setPayments(rawPayments);
      setPendingInvoices(rawInvoices);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load credit payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openRecordModal = () => {
    setForm({
      salesInvoiceId: "",
      amount: "",
      paymentMethod: "Cash",
      referenceNumber: "",
      notes: "",
    });
    setSelectedInvoice(null);
    setModalError("");
    setModalSuccess("");
    setShowModal(true);
  };

  const handleInvoiceChange = (invoiceId) => {
    if (!invoiceId) {
      setSelectedInvoice(null);
      setForm({ ...form, salesInvoiceId: "", amount: "" });
      return;
    }
    const inv = pendingInvoices.find((i) => (i.invoiceId || i.id) === invoiceId);
    if (inv) {
      setSelectedInvoice(inv);
      setForm({
        ...form,
        salesInvoiceId: invoiceId,
        amount: (inv.amountDue || inv.pendingAmount || 0).toString(),
      });
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!form.salesInvoiceId) {
      setModalError("Please select a credit invoice.");
      return;
    }
    const payAmt = parseFloat(form.amount) || 0;
    if (payAmt <= 0) {
      setModalError("Amount must be greater than zero.");
      return;
    }
    if (selectedInvoice && payAmt > (selectedInvoice.amountDue || selectedInvoice.pendingAmount)) {
      setModalError(`Amount cannot exceed the due balance of Rs. ${(selectedInvoice.amountDue || selectedInvoice.pendingAmount).toLocaleString()}`);
      return;
    }

    try {
      setModalError("");
      setModalSuccess("");

      const payload = {
        salesInvoiceId: form.salesInvoiceId,
        amount: payAmt,
        paymentMethod: form.paymentMethod,
        referenceNumber: form.referenceNumber.trim(),
        isVerified: true,
        notes: form.notes.trim(),
      };

      await creditPaymentsService.recordCreditPayment(payload);
      setModalSuccess("Credit payment recorded successfully!");
      setTimeout(() => {
        setShowModal(false);
        loadData();
      }, 1200);
    } catch (err) {
      console.error(err);
      setModalError(err.message || "Failed to record payment.");
    }
  };

  return (
    <StaffLayout pageTitle="Credit Payments Ledger" subtitle="Review credit transaction logs and settle pending invoices">
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <span className="text-xs font-semibold text-slate-500">
            Pending customer dues count: <span className="font-bold text-rose-600 font-mono">{pendingInvoices.length}</span>
          </span>
          <button
            onClick={openRecordModal}
            disabled={pendingInvoices.length === 0}
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Plus size={14} /> Record Payment
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{error}</div>
        ) : payments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
            No credit payment transactions have been logged.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="py-3 px-5">Receipt Date</th>
                    <th className="py-3 px-5">Invoice Number</th>
                    <th className="py-3 px-5">Client Name</th>
                    <th className="py-3 px-5">Payment Method</th>
                    <th className="py-3 px-5">Ref Number</th>
                    <th className="py-3 px-5 text-right font-black text-green-700">Amount Settle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => (
                    <tr key={pay.creditPaymentId} className="hover:bg-slate-50/50">
                      <td className="py-4 px-5 text-xs text-slate-500">
                        {new Date(pay.paymentDate).toLocaleString()}
                      </td>
                      <td className="py-4 px-5 font-mono font-semibold text-slate-800">{pay.invoiceNumber}</td>
                      <td className="py-4 px-5 text-slate-900 font-semibold">{pay.customerName}</td>
                      <td className="py-4 px-5 text-xs text-slate-650">{pay.paymentMethod}</td>
                      <td className="py-4 px-5 font-mono text-xs text-slate-450">{pay.referenceNumber || "-"}</td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-green-700">
                        Rs. {Number(pay.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* RECORD PAYMENT DIALOG */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 w-full max-w-md shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-sky-600" /> Record Credit Settle
            </h3>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{modalError}</div>
            )}
            {modalSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs">{modalSuccess}</div>
            )}

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Credit Invoice *</label>
                <select
                  required
                  value={form.salesInvoiceId}
                  onChange={(e) => handleInvoiceChange(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">-- Choose Credit Invoice --</option>
                  {pendingInvoices.map((inv) => (
                    <option key={inv.invoiceId || inv.id} value={inv.invoiceId || inv.id}>
                      {inv.invoiceNumber} - {inv.customerName} (Due: Rs. {(inv.amountDue || inv.pendingAmount || 0).toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {selectedInvoice && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <p><span className="font-semibold text-slate-700">Invoice:</span> {selectedInvoice.invoiceNumber}</p>
                  <p><span className="font-semibold text-slate-700">Client:</span> {selectedInvoice.customerName}</p>
                  <p><span className="font-semibold text-slate-700">Remaining Balance:</span> Rs. {(selectedInvoice.amountDue || selectedInvoice.pendingAmount || 0).toLocaleString()}</p>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Amount to Settle (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Payment Method *</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Fonepay">Fonepay</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Reference Number</label>
                  <input
                    type="text"
                    value={form.referenceNumber}
                    onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
                    placeholder="e.g. TXN-10102"
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Payment Notes</label>
                <textarea
                  placeholder="Add any receipt details or verification notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows="2"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-sky-700 transition shadow-xs"
                >
                  Post Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}
