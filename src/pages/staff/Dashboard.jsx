import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StaffLayout from "../../components/StaffLayout";
import appointmentsService from "../../services/appointmentsService";
import partRequestsService from "../../services/partRequestsService";
import reportsService from "../../services/reportsService";
import {
  UserPlus,
  Search,
  Calendar,
  Receipt,
  CreditCard,
  Wrench,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    pendingAppointments: 0,
    activeRequests: 0,
    pendingCredits: 0,
  });
  const [recentApts, setRecentApts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [aptRes, reqRes, creditRes] = await Promise.all([
        appointmentsService.getAppointments(),
        partRequestsService.getRequests(),
        reportsService.getPendingCredits(),
      ]);

      const rawApts = Array.isArray(aptRes) ? aptRes : aptRes?.result || aptRes?.appointments || [];
      const pendingApts = rawApts.filter((a) => a.status === 1).length;

      const rawReqs = Array.isArray(reqRes) ? reqRes : reqRes?.result || reqRes?.requests || [];
      const activeReqs = rawReqs.filter((r) => r.status === 1 || r.status === 4).length;

      const rawCredits = Array.isArray(creditRes) ? creditRes : creditRes?.result || creditRes?.credits || [];
      const pendingCreditCount = rawCredits.length;

      setStats({
        pendingAppointments: pendingApts,
        activeRequests: activeReqs,
        pendingCredits: pendingCreditCount,
      });

      // Filter recent appointments (top 5 pending/upcoming)
      const statusMap = {
        1: "Pending",
        2: "Confirmed",
        3: "Cancelled",
        4: "Completed",
      };
      setRecentApts(
        rawApts
          .filter((a) => a.status === 1 || a.status === 2)
          .slice(0, 5)
          .map((a) => ({
            id: a.id,
            customerName: a.customerName,
            vehicleName: `${a.vehicleName || "Vehicle"} (${a.registrationNumber})`,
            date: a.scheduledAt,
            statusText: statusMap[a.status] || "Pending",
            status: a.status,
          }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const quickActions = [
    {
      to: "/staff/customers/register",
      title: "Register Customer",
      desc: "Add a new customer and vehicle to system",
      icon: UserPlus,
      color: "from-sky-500 to-cyan-500 shadow-sky-500/10",
    },
    {
      to: "/staff/customers/search",
      title: "Customer Search",
      desc: "Find profile by name, phone, or plate number",
      icon: Search,
      color: "from-indigo-500 to-blue-500 shadow-indigo-500/10",
    },
    {
      to: "/staff/appointments",
      title: "Appointments Board",
      desc: "Manage and update booking slots",
      icon: Calendar,
      color: "from-violet-500 to-fuchsia-500 shadow-violet-500/10",
    },
    {
      to: "/staff/invoices/create",
      title: "Create Invoice",
      desc: "Generate bill with parts selection & loyalty check",
      icon: Receipt,
      color: "from-emerald-500 to-teal-500 shadow-emerald-500/10",
    },
    {
      to: "/staff/credit-payments",
      title: "Record Payment",
      desc: "Record payment against client due invoices",
      icon: CreditCard,
      color: "from-rose-500 to-pink-500 shadow-rose-500/10",
    },
    {
      to: "/staff/reports",
      title: "Customer Reports",
      desc: "Analyze top spenders, regulars, & credits due",
      icon: BarChart3,
      color: "from-amber-500 to-orange-500 shadow-amber-500/10",
    },
  ];

  return (
    <StaffLayout pageTitle="Welcome to GadiSewa Back-Office" subtitle="Operate service center tasks efficiently">
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-slate-900" />
        </div>
      ) : (
        <div className="space-y-8">
          {error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {/* Stats Overview */}
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4">
                <Clock size={20} />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Pending Appointments</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{stats.pendingAppointments}</p>
              <Link to="/staff/appointments" className="mt-4 text-xs font-bold text-sky-600 inline-flex items-center gap-1 hover:underline">
                Review bookings <ArrowRight size={12} />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-4">
                <Wrench size={20} />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Active Part Requests</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{stats.activeRequests}</p>
              <Link to="/staff/part-requests" className="mt-4 text-xs font-bold text-sky-600 inline-flex items-center gap-1 hover:underline">
                Manage requests <ArrowRight size={12} />
              </Link>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-4">
                <AlertCircle size={20} />
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Invoices Overdue/Credit</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{stats.pendingCredits}</p>
              <Link to="/staff/reports" className="mt-4 text-xs font-bold text-sky-600 inline-flex items-center gap-1 hover:underline">
                Review debtors <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold mb-5">Quick Operations</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={idx}
                    to={action.to}
                    className="group rounded-3xl border border-slate-200/60 bg-white p-6 hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex items-start gap-4 relative"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-linear-to-br ${action.color} flex items-center justify-center text-white shrink-0 shadow-md`}>
                      <Icon size={22} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {action.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{action.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Appointments Board */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Active Bookings</h3>
              <Link to="/staff/appointments" className="text-xs font-bold text-sky-600 inline-flex items-center gap-1 hover:underline">
                View all bookings <ArrowRight size={12} />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              {recentApts.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  All clear! No pending or confirmed appointments at the moment.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentApts.map((apt) => (
                    <div key={apt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-950">{apt.customerName}</p>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              apt.status === 2 ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {apt.statusText}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {apt.vehicleName} • Scheduled: {new Date(apt.date).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        to="/staff/appointments"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
                      >
                        Details
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}
