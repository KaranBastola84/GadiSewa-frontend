import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { inventoryReportsService } from "../../services/inventoryReportsService";

export default function InventoryReportsPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [threshold, setThreshold] = useState("");

  const loadReports = async () => {
    setLoading(true);
    setError("");

    try {
      const [inventoryResponse, lowStockResponse] = await Promise.allSettled([
        inventoryReportsService.getInventory(),
        inventoryReportsService.getLowStock(
          threshold ? Number(threshold) : undefined,
        ),
      ]);

      if (inventoryResponse.status === "fulfilled") {
        setInventory(inventoryResponse.value?.result || []);
      }
      if (lowStockResponse.status === "fulfilled") {
        setLowStock(lowStockResponse.value?.result || []);
      }

      const rejected = [inventoryResponse, lowStockResponse].find(
        (item) => item.status === "rejected",
      );
      if (rejected) {
        setError(rejected.reason?.message || "Some reports could not load.");
      }
    } catch (loadError) {
      setError(loadError.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const rows = activeTab === "inventory" ? inventory : lowStock;

  return (
    <AdminLayout
      pageTitle="Inventory Reports"
      subtitle="Monitor stock levels and low stock items"
    >
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("inventory")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "inventory"
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Inventory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("low-stock")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                activeTab === "low-stock"
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Low stock
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeTab === "low-stock" && (
              <input
                type="number"
                min="1"
                placeholder="Threshold"
                value={threshold}
                onChange={(event) => setThreshold(event.target.value)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            )}
            <button
              type="button"
              onClick={loadReports}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
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
          <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <Th>Part</Th>
                    <Th>Part #</Th>
                    <Th className="text-right">Stock</Th>
                    <Th className="text-right">Reorder</Th>
                    <Th className="text-right">Unit price</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {rows.map((item) => (
                    <tr key={item.partId || item.id}>
                      <Td>
                        <div>
                          <p className="font-semibold text-slate-950">
                            {item.name || item.partName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {activeTab === "low-stock"
                              ? "Low stock"
                              : item.category || "-"}
                          </p>
                        </div>
                      </Td>
                      <Td>{item.partNumber || "-"}</Td>
                      <Td className="text-right">{item.stockQuantity}</Td>
                      <Td className="text-right">{item.reorderLevel ?? "-"}</Td>
                      <Td className="text-right">
                        Rs. {Number(item.unitPrice || 0).toLocaleString()}
                      </Td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <Td
                        colSpan={5}
                        className="py-12 text-center text-sm text-slate-500"
                      >
                        No records available.
                      </Td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "", colSpan }) {
  return (
    <td
      colSpan={colSpan}
      className={`px-4 py-4 text-sm text-slate-700 ${className}`}
    >
      {children}
    </td>
  );
}
