import { useState } from "react";
import CustomerLayout from "../../components/CustomerLayout";
import { useCustomer } from "../../context/CustomerContext";

export default function HistoryPage() {
  const { history, totalSpent } = useCustomer();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  // filter + search
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

  const paidTotal = history.filter((h) => h.status === "Paid").reduce((s, h) => s + h.amount, 0);
  const creditTotal = history.filter((h) => h.status === "Credit").reduce((s, h) => s + h.amount, 0);
  const discountSaved = history.reduce((s, h) => s + (h.discount || 0), 0);

  return (
    <CustomerLayout pageTitle="Purchase & Service History">

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <SummaryCard label="Total Spent" value={`Rs. ${totalSpent.toLocaleString()}`} />
        <SummaryCard label="Paid" value={`Rs. ${paidTotal.toLocaleString()}`} color="text-green-600" />
        <SummaryCard label="Pending Credit" value={`Rs. ${creditTotal.toLocaleString()}`} color="text-red-600" />
        <SummaryCard label="Discount Saved" value={`Rs. ${discountSaved.toLocaleString()}`} color="text-amber-600" />
      </div>

      {totalSpent >= 5000 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5 text-sm text-amber-800">
          ⭐ <strong>Loyalty Active!</strong> You get 10% off on any single purchase above Rs. 5,000.
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
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
                filter === f ? "bg-sky-600 text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}>{f === "credit" ? "Unpaid" : f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">No records found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Invoice</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Description</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Vehicle</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-500">Amount</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-slate-500">{item.invoiceNo}</td>
                    <td className="px-4 py-3 text-slate-600">{item.date}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        item.type === "Purchase" ? "bg-blue-50 text-blue-700" : "bg-violet-50 text-violet-700"
                      }`}>{item.type}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 max-w-xs truncate">{item.description}</td>
                    <td className="px-4 py-3 text-slate-600">{item.vehicle}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      Rs. {item.amount?.toLocaleString()}
                      {item.discount > 0 && (
                        <span className="block text-xs font-normal text-green-600">
                          -Rs. {item.discount.toLocaleString()} (10% loyalty)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        item.status === "Paid" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="p-4">
                <div className="flex justify-between mb-1">
                  <p className="font-semibold text-slate-800 text-sm truncate">{item.description}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    item.status === "Paid" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  }`}>{item.status}</span>
                </div>
                <p className="text-xs text-slate-400">{item.invoiceNo} • {item.date} • {item.vehicle}</p>
                <p className="text-sm font-bold text-slate-800 mt-1">Rs. {item.amount?.toLocaleString()}</p>
                {item.discount > 0 && (
                  <p className="text-xs text-green-600">Loyalty: -Rs. {item.discount.toLocaleString()}</p>
                )}
              </div>
            ))}
          </div>
        </div>
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
