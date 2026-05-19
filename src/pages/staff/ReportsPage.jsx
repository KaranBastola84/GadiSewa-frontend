import React, { useState, useEffect } from "react";
import StaffLayout from "../../components/StaffLayout";
import apiConfig from "../../config/apiConfig";
import { Loader2, TrendingUp, Users, Clock, AlertCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("top-spenders");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const TABS = [
    { id: "top-spenders", label: "Top Spenders", icon: TrendingUp },
    { id: "regulars", label: "Regular Customers", icon: Users },
    { id: "pending-credits", label: "Pending Credits", icon: Clock }
  ];

  const fetchReport = async (tabId) => {
    try {
      setIsLoading(true);
      setError(null);
      setData([]);

      const endpointMap = {
        "top-spenders": "/reports/customers/top-spenders",
        "regulars": "/reports/customers/regulars",
        "pending-credits": "/reports/customers/pending-credits"
      };

      const res = await apiConfig.get(endpointMap[tabId]);
      setData(res.data?.result || res.data || []);
    } catch (err) {
      setError("Failed to load report data.");
      toast.error("Failed to load report data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Switch tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    fetchReport(tabId);
  };

  // Initial load
  useEffect(() => {
    fetchReport(activeTab);
  }, []);

  const renderTableHead = () => {
    switch (activeTab) {
      case "top-spenders":
        return (
          <tr>
            <th className="px-6 py-4 font-semibold">Customer Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold text-center">Purchases</th>
            <th className="px-6 py-4 font-semibold text-right">Total Spent (रु)</th>
            <th className="px-6 py-4 font-semibold">Last Purchase</th>
          </tr>
        );
      case "regulars":
        return (
          <tr>
            <th className="px-6 py-4 font-semibold">Customer Name</th>
            <th className="px-6 py-4 font-semibold text-center">Purchases</th>
            <th className="px-6 py-4 font-semibold text-right">Total Spent (रु)</th>
            <th className="px-6 py-4 font-semibold">First Purchase</th>
            <th className="px-6 py-4 font-semibold">Last Purchase</th>
            <th className="px-6 py-4 font-semibold text-center">Pts</th>
          </tr>
        );
      case "pending-credits":
        return (
          <tr>
            <th className="px-6 py-4 font-semibold">Invoice No</th>
            <th className="px-6 py-4 font-semibold">Customer Name</th>
            <th className="px-6 py-4 font-semibold">Email</th>
            <th className="px-6 py-4 font-semibold text-right">Amount Due (रु)</th>
            <th className="px-6 py-4 font-semibold text-center">Days Overdue</th>
          </tr>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (row, idx) => {
    switch (activeTab) {
      case "top-spenders":
        return (
          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
            <td className="px-6 py-4 font-bold text-slate-900">{row.customerName || row.name}</td>
            <td className="px-6 py-4 text-sm text-slate-500">{row.email}</td>
            <td className="px-6 py-4 text-center font-bold text-slate-700">{row.purchaseCount}</td>
            <td className="px-6 py-4 text-right font-bold text-emerald-600 border-l border-emerald-50 bg-emerald-50/10">
              {row.totalSpent?.toLocaleString()}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              {row.lastPurchaseDate ? new Date(row.lastPurchaseDate).toLocaleDateString() : "-"}
            </td>
          </tr>
        );
      case "regulars":
        return (
          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
            <td className="px-6 py-4 font-bold text-slate-900">
                <span className="block">{row.customerName || row.name}</span>
                <span className="text-xs text-slate-500 font-normal">{row.email}</span>
            </td>
            <td className="px-6 py-4 text-center font-bold text-slate-700">{row.purchaseCount}</td>
            <td className="px-6 py-4 text-right font-bold text-slate-700">
              {row.totalSpent?.toLocaleString()}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              {row.firstPurchaseDate ? new Date(row.firstPurchaseDate).toLocaleDateString() : "-"}
            </td>
            <td className="px-6 py-4 text-sm text-slate-600">
              {row.lastPurchaseDate ? new Date(row.lastPurchaseDate).toLocaleDateString() : "-"}
            </td>
            <td className="px-6 py-4 text-center font-bold text-blue-600 bg-blue-50/50">
              {row.loyaltyPoints || 0}
            </td>
          </tr>
        );
      case "pending-credits":
        return (
          <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
            <td className="px-6 py-4 font-bold text-slate-900">
              <span className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded inline-block">INV: {row.invoiceNumber}</span>
            </td>
            <td className="px-6 py-4 font-bold text-slate-900">{row.customerName}</td>
            <td className="px-6 py-4 text-sm text-slate-500">{row.email}</td>
            <td className="px-6 py-4 text-right font-bold text-rose-600 border-l border-rose-50 bg-rose-50/30">
              {row.amountDue?.toLocaleString()}
            </td>
            <td className="px-6 py-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none bg-rose-100 text-rose-700">
                <AlertCircle className="w-3 h-3" />
                {row.daysOverdue} days
              </div>
            </td>
          </tr>
        );
      default:
        return null;
    }
  };

  return (
    <StaffLayout pageTitle="Reports & Analytics" subtitle="View detailed customer intelligence and pending credit reports.">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl mb-6 shadow-inner border border-slate-200/50 w-full md:w-max">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                isActive 
                  ? "bg-white text-emerald-600 shadow-xs shadow-slate-200" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/30"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium">Loading report data...</p>
          </div>
        ) : error ? (
          <div className="p-16 flex flex-col items-center justify-center text-rose-500">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold">{error}</p>
            <button onClick={() => fetchReport(activeTab)} className="mt-4 px-4 py-2 bg-rose-100 text-rose-700 rounded-lg text-sm font-bold hover:bg-rose-200 transition-colors">
              Retry
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <p className="font-medium">No records found for this report.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  {renderTableHead()}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row, idx) => renderTableRow(row, idx))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </StaffLayout>
  );
}
