import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { financialReportsService } from "../../services/financialReportsService";

const reportButtons = [
  { key: "daily", label: "Daily" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
];

export default function FinancialReportsPage() {
  const [activeReport, setActiveReport] = useState("daily");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [range, setRange] = useState({ from: "", to: "" });
  const [customType, setCustomType] = useState("daily");

  const toDateTimeOffset = (value) => {
    if (!value) return "";
    if (value.length === 10) return `${value}T00:00:00Z`;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toISOString();
  };

  const fetchReport = async (type, customRange) => {
    setLoading(true);
    setError("");

    try {
      let response;
      if (type === "daily")
        response = await financialReportsService.getDaily(
          toDateTimeOffset(customRange?.startDate),
          toDateTimeOffset(customRange?.endDate),
        );
      if (type === "monthly")
        response = await financialReportsService.getMonthly(
          toDateTimeOffset(customRange?.startDate),
          toDateTimeOffset(customRange?.endDate),
        );
      if (type === "yearly")
        response = await financialReportsService.getYearly(
          toDateTimeOffset(customRange?.startDate),
          toDateTimeOffset(customRange?.endDate),
        );
      if (type === "custom") {
        response = await financialReportsService.getCustomRange(
          toDateTimeOffset(customRange?.from),
          toDateTimeOffset(customRange?.to),
          customRange?.type,
        );
      }

      setReport(response?.result || response || null);
    } catch (reportError) {
      setError(reportError.message || "Failed to load report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport("daily");
  }, []);

  const handleReportClick = (key) => {
    setActiveReport(key);
    fetchReport(key, { startDate: range.from, endDate: range.to });
  };

  const handleRangeChange = (event) => {
    const { name, value } = event.target;
    setRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomReport = () => {
    if (!range.from || !range.to) {
      setError("Select both start and end dates for custom range.");
      return;
    }
    setActiveReport("custom");
    fetchReport("custom", { ...range, type: customType });
  };

  const formatCurrency = (value) =>
    `Rs. ${Number(value || 0).toLocaleString()}`;

  const reportData = report || {};

  return (
    <AdminLayout
      pageTitle="Financial Reports"
      subtitle="Track revenue, invoices, tax, and discounts"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {reportButtons.map((btn) => (
              <button
                key={btn.key}
                type="button"
                onClick={() => handleReportClick(btn.key)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  activeReport === btn.key
                    ? "bg-slate-950 text-white"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="date"
              name="from"
              value={range.from}
              onChange={handleRangeChange}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              name="to"
              value={range.to}
              onChange={handleRangeChange}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <select
              value={customType}
              onChange={(event) => setCustomType(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              type="button"
              onClick={handleCustomReport}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Run custom
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-500">
            Loading report...
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <ReportCard
              label="Total revenue"
              value={formatCurrency(reportData.totalRevenue)}
            />
            <ReportCard
              label="Net revenue"
              value={formatCurrency(reportData.netRevenue)}
            />
            <ReportCard label="Tax" value={formatCurrency(reportData.tax)} />
            <ReportCard
              label="Discounts"
              value={formatCurrency(
                reportData.totalDiscounts || reportData.discounts,
              )}
            />
            <ReportCard
              label="Invoices"
              value={Number(reportData.invoiceCount || 0).toLocaleString()}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function ReportCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}
