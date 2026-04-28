import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { adminPartsService } from "../../services/adminPartsService";
import { adminUsersService } from "../../services/adminUsersService";
import { adminVendorsService } from "../../services/adminVendorsService";

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
  const [parts, setParts] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [partsResponse, usersResponse, vendorsResponse] =
          await Promise.allSettled([
            adminPartsService.getParts(),
            adminUsersService.getUsers(),
            adminVendorsService.getVendors(),
          ]);

        if (!isMounted) return;

        if (partsResponse.status === "fulfilled")
          setParts(partsResponse.value?.result || []);
        if (usersResponse.status === "fulfilled")
          setUsers(usersResponse.value?.result || []);
        if (vendorsResponse.status === "fulfilled")
          setVendors(vendorsResponse.value?.result || []);

        const rejected = [partsResponse, usersResponse, vendorsResponse].find(
          (item) => item.status === "rejected",
        );
        if (rejected) {
          setError(
            rejected.reason?.message ||
              "Some dashboard data could not be loaded.",
          );
        }
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

  const summary = useMemo(() => {
    const lowStock = parts.filter((part) => part.isLowStock).length;
    const activeStaff = users.filter(
      (user) => user.role === 2 && user.isActive,
    ).length;
    const activeAdmins = users.filter(
      (user) => user.role === 1 && user.isActive,
    ).length;

    return {
      lowStock,
      activeStaff,
      activeAdmins,
    };
  }, [parts, users]);

  return (
    <AdminLayout
      pageTitle="Dashboard"
      subtitle="Inventory, staff, and vendor overview at a glance"
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
              label="Vehicle parts"
              value={parts.length}
              hint="Total parts in inventory"
            />
            <StatCard
              label="Vendors"
              value={vendors.length}
              hint="Registered supply partners"
            />
            <StatCard
              label="Staff users"
              value={summary.activeStaff}
              hint="Active staff accounts"
            />
            <StatCard
              label="Low stock"
              value={summary.lowStock}
              hint="Parts at or below reorder level"
            />
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Inventory health
                  </h2>
                  <p className="text-sm text-slate-500">
                    Quick view of stock risk and catalog coverage.
                  </p>
                </div>
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                  {summary.lowStock} low stock
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {parts.slice(0, 5).map((part) => (
                  <div
                    key={part.partId}
                    className="rounded-2xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-950">
                          {part.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {part.partNumber}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          part.isLowStock
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {part.stockQuantity} in stock
                      </span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${part.isLowStock ? "bg-red-500" : "bg-emerald-500"}`}
                        style={{
                          width: `${Math.min(100, Math.max(10, part.stockQuantity || 0))}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
                {parts.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">
                    No parts found yet. Add parts from the Parts section.
                  </p>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-950">
                Business snapshot
              </h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">
                    Admins
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {summary.activeAdmins}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">
                    Vendors
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {vendors.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">
                    Parts
                  </p>
                  <p className="mt-2 text-2xl font-black text-slate-950">
                    {parts.length}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
