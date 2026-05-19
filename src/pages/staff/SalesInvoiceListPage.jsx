import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StaffLayout from "../../components/StaffLayout";
import salesInvoicesService from "../../services/salesInvoicesService";
import { Search, Receipt, Plus, ArrowRight, Filter } from "lucide-react";

export default function SalesInvoiceListPage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await salesInvoicesService.getInvoices();
      const rawInvoices = Array.isArray(res) ? res : res?.result || res?.invoices || [];
      setInvoices(rawInvoices);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load sales invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? inv.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <StaffLayout pageTitle="Sales Invoices" subtitle="Monitor and manage customer billings">
      <div className="space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
          <div className="flex flex-1 gap-3 flex-col sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by Invoice No or Customer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter size={12} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-2xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Credit">Credit</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>

          <Link
            to="/staff/invoices/create"
            className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-semibold inline-flex items-center gap-1.5 transition cursor-pointer justify-center shadow-xs"
          >
            <Plus size={14} /> Create Invoice
          </Link>
        </div>

        {/* Invoice List Board */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
            No sales invoices found matching your filters.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="py-3 px-5">Invoice Number</th>
                    <th className="py-3 px-5">Billed To</th>
                    <th className="py-3 px-5">Invoice Date</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Discount</th>
                    <th className="py-3 px-5 text-right">Total Amount</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((inv) => (
                    <tr key={inv.invoiceId} className="hover:bg-slate-50/50">
                      <td className="py-4 px-5 font-mono font-bold text-slate-950 flex items-center gap-1.5">
                        <Receipt size={14} className="text-slate-400" />
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-4 px-5 text-slate-900 font-semibold">{inv.customerName}</td>
                      <td className="py-4 px-5 text-xs text-slate-500">
                        {new Date(inv.invoiceDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            inv.status === "Paid"
                              ? "bg-green-50 text-green-700"
                              : inv.status === "Credit" || inv.status === "Overdue"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right text-green-600 font-mono">
                        Rs. {Number(inv.discountAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right font-mono font-semibold text-slate-900">
                        Rs. {Number(inv.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link
                          to={`/staff/invoices/${inv.invoiceId}`}
                          className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-950 inline-flex items-center gap-1 transition shadow-xs"
                        >
                          Details <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
