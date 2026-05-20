import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StaffLayout from "../../components/StaffLayout";
import reportsService from "../../services/reportsService";
import { BarChart3, TrendingUp, Users, AlertTriangle, ArrowRight, ShieldAlert, Award } from "lucide-react";

export default function CustomerReportsPage() {
  const [activeTab, setActiveTab] = useState("top-spenders"); // top-spenders, regulars, pending-credits
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Report config parameters
  const [limit, setLimit] = useState(10);
  const [minPurchases, setMinPurchases] = useState(3);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");
      let res;

      if (activeTab === "top-spenders") {
        res = await reportsService.getTopSpenders(limit);
      } else if (activeTab === "regulars") {
        res = await reportsService.getRegularCustomers(minPurchases);
      } else if (activeTab === "pending-credits") {
        res = await reportsService.getPendingCredits();
      }

      const raw = Array.isArray(res) ? res : res?.result || [];
      setData(raw);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load report data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [activeTab, limit, minPurchases]);

  return (
    <StaffLayout pageTitle="Customer Analytics & Reports" subtitle="Analyze customer transactions, regular frequency, and overdue credits">
      <div className="space-y-6">
        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-6">
          <button
            onClick={() => {
              setActiveTab("top-spenders");
              setData([]);
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition inline-flex items-center gap-1.5 ${
              activeTab === "top-spenders"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            <TrendingUp size={14} /> Top Spenders
          </button>
          <button
            onClick={() => {
              setActiveTab("regulars");
              setData([]);
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition inline-flex items-center gap-1.5 ${
              activeTab === "regulars"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-655"
            }`}
          >
            <Users size={14} /> Regular Clients
          </button>
          <button
            onClick={() => {
              setActiveTab("pending-credits");
              setData([]);
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition inline-flex items-center gap-1.5 ${
              activeTab === "pending-credits"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-655"
            }`}
          >
            <AlertTriangle size={14} /> Pending Credits
          </button>
        </div>

        {/* Report configuration inputs */}
        {activeTab !== "pending-credits" && (
          <div className="bg-white border border-slate-200 p-4 rounded-3xl flex items-center gap-4 text-xs shadow-xs">
            {activeTab === "top-spenders" ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Limit results to:</span>
                <select
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="p-1.5 border border-slate-200 rounded-lg bg-white font-mono"
                >
                  <option value={5}>5 customers</option>
                  <option value={10}>10 customers</option>
                  <option value={20}>20 customers</option>
                  <option value={50}>50 customers</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Min purchase count:</span>
                <input
                  type="number"
                  min="1"
                  value={minPurchases}
                  onChange={(e) => setMinPurchases(Math.max(1, parseInt(e.target.value) || 1))}
                  className="p-1 border border-slate-200 rounded-lg w-16 text-center font-mono"
                />
              </div>
            )}
            <button
              onClick={loadReport}
              className="px-3 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        )}

        {/* Report Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
            <ShieldAlert size={16} />
            {error}
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
            No records found for this query.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                {/* TOP SPENDERS THEAD */}
                {activeTab === "top-spenders" && (
                  <>
                    <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      <tr>
                        <th className="py-3 px-5">Rank</th>
                        <th className="py-3 px-5">Customer Name</th>
                        <th className="py-3 px-5">Email Address</th>
                        <th className="py-3 px-5 text-right">Loyalty Points</th>
                        <th className="py-3 px-5 text-right font-semibold">Total Revenue Generated</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.map((c, index) => (
                        <tr key={c.customerId} className="hover:bg-slate-50/50">
                          <td className="py-4 px-5 font-mono font-bold text-slate-400">#{index + 1}</td>
                          <td className="py-4 px-5 font-semibold text-slate-950">{c.fullName || c.customerName}</td>
                          <td className="py-4 px-5 text-slate-500 text-xs">{c.email}</td>
                          <td className="py-4 px-5 text-right font-mono text-amber-600 font-bold">
                            {c.loyaltyPoints || 0} pts
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-black text-slate-900 text-sky-600">
                            Rs. {Number(c.totalSpent).toLocaleString()}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Link
                              to={`/staff/customers/${c.customerId}/full-profile`}
                              className="text-slate-800 hover:text-slate-900 font-bold text-xs inline-flex items-center gap-0.5"
                            >
                              Profile <ArrowRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* REGULAR CUSTOMERS THEAD */}
                {activeTab === "regulars" && (
                  <>
                    <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      <tr>
                        <th className="py-3 px-5">Customer Name</th>
                        <th className="py-3 px-5">Email Address</th>
                        <th className="py-3 px-5 text-right">Purchase Visits</th>
                        <th className="py-3 px-5 text-right">Total Spent</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.map((c) => (
                        <tr key={c.customerId} className="hover:bg-slate-50/50">
                          <td className="py-4 px-5 font-semibold text-slate-950">{c.fullName || c.customerName}</td>
                          <td className="py-4 px-5 text-slate-500 text-xs">{c.email}</td>
                          <td className="py-4 px-5 text-right font-mono font-bold text-slate-900">
                            {c.purchaseCount || c.invoiceCount || c.visitCount} visits
                          </td>
                          <td className="py-4 px-5 text-right font-mono text-slate-850">
                            Rs. {Number(c.totalSpent).toLocaleString()}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Link
                              to={`/staff/customers/${c.customerId}/full-profile`}
                              className="text-slate-800 hover:text-slate-900 font-bold text-xs inline-flex items-center gap-0.5"
                            >
                              Profile <ArrowRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}

                {/* PENDING CREDITS THEAD */}
                {activeTab === "pending-credits" && (
                  <>
                    <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      <tr>
                        <th className="py-3 px-5">Invoice Number</th>
                        <th className="py-3 px-5">Client Name</th>
                        <th className="py-3 px-5">Due Date</th>
                        <th className="py-3 px-5 text-right">Total Amount</th>
                        <th className="py-3 px-5 text-right font-black text-rose-600">Pending Credit Due</th>
                        <th className="py-3 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.map((c) => (
                        <tr key={c.invoiceId || c.id} className="hover:bg-slate-50/50">
                          <td className="py-4 px-5 font-mono font-bold text-slate-950">{c.invoiceNumber}</td>
                          <td className="py-4 px-5 font-semibold text-slate-900">{c.customerName}</td>
                          <td className="py-4 px-5 text-xs text-rose-600 font-semibold">
                            {c.dueDate ? new Date(c.dueDate).toLocaleDateString() : "Immediate"}
                          </td>
                          <td className="py-4 px-5 text-right font-mono text-slate-500">
                            Rs. {Number(c.totalAmount).toLocaleString()}
                          </td>
                          <td className="py-4 px-5 text-right font-mono font-black text-rose-600">
                            Rs. {Number(c.amountDue || c.pendingAmount).toLocaleString()}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <Link
                              to={`/staff/invoices/${c.invoiceId || c.id}`}
                              className="text-slate-800 hover:text-slate-900 font-bold text-xs inline-flex items-center gap-0.5"
                            >
                              View Invoice <ArrowRight size={12} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </>
                )}
              </table>
            </div>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
