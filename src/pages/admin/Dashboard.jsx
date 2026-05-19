import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { financialReportsService } from "../../services/financialReportsService";

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
        </div>
      )}
    </AdminLayout>
  );
}
