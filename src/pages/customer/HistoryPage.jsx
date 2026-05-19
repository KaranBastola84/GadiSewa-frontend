import { useState, useEffect } from "react";
import CustomerLayout from "../../components/CustomerLayout";
import { Star, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import customerService from "../../services/customerService";
import { useAuthContext } from "../../context/AuthContext";

export default function HistoryPage() {
  const { user } = useAuthContext();
  const [history, setHistory] = useState([]);
  const [creditHistory, setCreditHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const [activeTab, setActiveTab] = useState("history");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const customerId = user?.userId;

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return;
      try {
        setLoading(true);
        const [historyRes, invoicesRes, creditRes] = await Promise.allSettled([
          customerService.getHistory(),
          customerService.getSalesInvoices(),
          customerService.getCreditHistory(customerId),
        ]);

        let combined = [];

        if (historyRes.status === "fulfilled") {
          const serviceData = Array.isArray(historyRes.value) ? historyRes.value : historyRes.value?.result || [];
          combined = [...combined, ...serviceData.map(item => ({
            ...item,
            type: "Service"
          }))];
        }

        if (invoicesRes.status === "fulfilled") {
          const invoiceData = Array.isArray(invoicesRes.value) ? invoicesRes.value : invoicesRes.value?.result || [];
          combined = [...combined, ...invoiceData.map(item => ({
            ...item,
            type: "Purchase"
          }))];
        }

        combined.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        setHistory(combined);

        const spent = combined.filter(h => h.status === "Paid").reduce((s, h) => s + (h.amount || 0), 0);
        setTotalSpent(spent);

        if (creditRes.status === "fulfilled") {
          const creditData = Array.isArray(creditRes.value) ? creditRes.value : creditRes.value?.result || [];
          setCreditHistory(creditData);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load history data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  const filtered = history.filter((item) => {
    const matchFilter =
      filter === "all" ||
      item.type?.toLowerCase() === filter ||
      item.status?.toLowerCase() === filter;

    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      item.description?.toLowerCase().includes(q) ||
      item.vehicle?.toLowerCase().includes(q) ||
      item.invoiceNo?.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  const paidTotal = history
    .filter((h) => h.status === "Paid")
    .reduce((s, h) => s + (h.amount || 0), 0);
  const creditTotal = history
    .filter((h) => h.status === "Credit" || h.status === "Unpaid")
    .reduce((s, h) => s + (h.amount || 0), 0);
  const discountSaved = history.reduce((s, h) => s + (h.discount || 0), 0);

  return (
    <CustomerLayout pageTitle="Purchase & Service History">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "history"
              ? "bg-sky-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Purchase & Service
        </button>
        <button
          onClick={() => setActiveTab("credit")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
            activeTab === "credit"
              ? "bg-sky-600 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <CreditCard size={15} /> Credit History
        </button>
      </div>

      {activeTab === "history" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            <SummaryCard
              label="Total Spent"
              value={`Rs. ${totalSpent.toLocaleString()}`}
            />
            <SummaryCard
              label="Paid"
              value={`Rs. ${paidTotal.toLocaleString()}`}
              color="text-green-600"
            />
            <SummaryCard
              label="Pending Credit"
              value={`Rs. ${creditTotal.toLocaleString()}`}
              color="text-red-600"
            />
            <SummaryCard
              label="Discount Saved"
              value={`Rs. ${discountSaved.toLocaleString()}`}
              color="text-amber-600"
            />
          </div>

          {totalSpent >= 5000 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-sm text-amber-800">
              <Star size={16} className="inline mr-1 text-amber-500 fill-amber-500" /> <strong>Loyalty Active!</strong> You get 10% off once your total
              spending reaches Rs. 5,000.
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Search by description, vehicle, or invoice..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex gap-2">
              {["all", "purchase", "service", "credit"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
                    filter === f
                      ? "bg-sky-600 text-white"
                      : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  {f === "credit" ? "Unpaid" : f}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <p className="text-slate-400">Loading history...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <p className="text-slate-400">No records found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500">
                        Invoice
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500">
                        Date
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500">
                        Type
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500">
                        Description
                      </th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500">
                        Vehicle
                      </th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-500">
                        Amount
                      </th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((item) => (
                      <tr key={item.id || Math.random()} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {item.type === "Purchase" && item.id ? (
                            <Link to={`/customer/invoice/${item.id}`} className="text-sky-600 hover:underline">
                              {item.invoiceNo || `INV-${item.id}`}
                            </Link>
                          ) : (
                            item.invoiceNo || "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.date ? new Date(item.date).toLocaleDateString() : "-"}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              item.type === "Purchase"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-violet-50 text-violet-700"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-800 max-w-xs truncate">
                          {item.description || "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{item.vehicle || "-"}</td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800">
                          Rs. {item.amount?.toLocaleString() || 0}
                          {item.discount > 0 && (
                            <span className="block text-xs font-normal text-green-600">
                              -Rs. {item.discount.toLocaleString()} (10% loyalty)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              item.status === "Paid"
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-slate-100">
                {filtered.map((item) => (
                  <div key={item.id || Math.random()} className="p-4">
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {item.description || "-"}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          item.status === "Paid"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {item.type === "Purchase" && item.id ? (
                        <Link to={`/customer/invoice/${item.id}`} className="text-sky-600 hover:underline">
                          {item.invoiceNo || `INV-${item.id}`}
                        </Link>
                      ) : (
                        item.invoiceNo || "-"
                      )} • {item.date ? new Date(item.date).toLocaleDateString() : "-"} • {item.vehicle || "-"}
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-1">
                      Rs. {item.amount?.toLocaleString() || 0}
                    </p>
                    {item.discount > 0 && (
                      <p className="text-xs text-green-600">
                        Loyalty: -Rs. {item.discount.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "credit" && (
        <>
          {loading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <p className="text-slate-400">Loading credit history...</p>
            </div>
          ) : creditHistory.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
              <p className="text-slate-400">No credit records found.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500">Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-500">Description</th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-500">Amount</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-500">Type</th>
                      <th className="text-right px-4 py-3 font-semibold text-slate-500">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {creditHistory.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-600">
                          {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-3 text-slate-800">
                          {item.description || item.notes || "-"}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800">
                          Rs. {(item.amount || 0).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            item.type === "Payment" || item.type === "Credit"
                              ? "bg-green-50 text-green-700"
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {item.type || "Record"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-700">
                          Rs. {(item.balance || 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-slate-100">
                {creditHistory.map((item, idx) => (
                  <div key={item.id || idx} className="p-4">
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold text-slate-800 text-sm truncate">
                        {item.description || item.notes || "-"}
                      </p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        item.type === "Payment" || item.type === "Credit"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {item.type || "Record"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {item.date ? new Date(item.date).toLocaleDateString() : "-"}
                    </p>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm font-bold text-slate-800">
                        Rs. {(item.amount || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500">
                        Bal: Rs. {(item.balance || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </CustomerLayout>
  );
}

function SummaryCard({ label, value, color = "text-slate-800" }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      <p className="text-xs text-slate-400 uppercase">{label}</p>
      <p className={`text-lg font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}
