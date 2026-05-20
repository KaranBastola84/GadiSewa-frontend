import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { financialReportsService } from "../../services/financialReportsService";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const StatCard = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">
      {label}
    </p>
    <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
    <p className="mt-2 text-sm text-slate-500">{hint}</p>
  </div>
);

export default function AdminDashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await financialReportsService.getDaily();

        if (!isMounted) return;

        setReport(response?.result || response || null);
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load admin dashboard.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString()}`;

  const reportData = report || {};

  return (
    <AdminLayout
      pageTitle="Dashboard"
      subtitle="Daily revenue snapshot and invoice performance"
    >
      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900" />
        </div>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total revenue"
              value={formatCurrency(reportData.totalRevenue)}
              hint="Daily revenue from invoices"
            />
            <StatCard
              label="Net revenue"
              value={formatCurrency(reportData.netRevenue)}
              hint="Revenue after discounts"
            />
            <StatCard
              label="Invoices"
              value={Number(reportData.invoiceCount || 0).toLocaleString()}
              hint="Total invoices created"
            />
            <StatCard
              label="Discounts"
              value={formatCurrency(reportData.totalDiscounts)}
              hint="Total discounts given"
            />
          </div>

          {/* Charts Section */}
          {reportData.lines && reportData.lines.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2 mt-8">
              {/* Revenue & Profit Area Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-6">Revenue vs Profit (Last 30 Days)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reportData.lines} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="period" tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(str) => {
                          if(!str) return '';
                          const d = new Date(str);
                          return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                      }} />
                      <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `Rs.${value/1000}k`} width={80} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, undefined]}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" name="Total Revenue" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Transactions Bar Chart */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-6">Daily Transactions</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportData.lines} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="period" tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(str) => {
                          if(!str) return '';
                          const d = new Date(str);
                          return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                      }} />
                      <YAxis tick={{fontSize: 12, fill: '#64748b'}} allowDecimals={false} width={40} />
                      <RechartsTooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend />
                      <Bar dataKey="transactionCount" name="Transactions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}