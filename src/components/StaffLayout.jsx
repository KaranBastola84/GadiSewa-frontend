import { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  UserPlus,
  Search,
  Calendar,
  Receipt,
  CreditCard,
  Wrench,
  BarChart3,
  LogOut,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

const staffNavItems = [
  { to: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/staff/customers/register", label: "Register Customer", icon: UserPlus },
  { to: "/staff/customers/search", label: "Customer Search", icon: Search },
  { to: "/staff/appointments", label: "Appointments", icon: Calendar },
  { to: "/staff/invoices", label: "Sales Invoices", icon: Receipt },
  { to: "/staff/credit-payments", label: "Credit Payments", icon: CreditCard },
  { to: "/staff/part-requests", label: "Part Requests", icon: Wrench },
  { to: "/staff/reports", label: "Customer Reports", icon: BarChart3 },
];

export default function StaffLayout({ children, pageTitle, subtitle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const userLabel = useMemo(
    () => user?.fullName || user?.email || "Staff Member",
    [user]
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="fixed inset-x-0 top-0 h-32 bg-linear-to-r from-sky-100/60 via-cyan-100/40 to-indigo-100/50 blur-3xl pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-slate-900 text-white border-r border-white/10 z-30">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight uppercase">
                GadiSewa
              </h1>
              <p className="text-xs text-slate-400">Staff Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {staffNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 bg-slate-950/40">
          <div className="rounded-2xl bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">
              Signed in as
            </p>
            <p className="mt-2 text-sm font-semibold truncate">{userLabel}</p>
            <p className="text-xs text-slate-400">Staff Member</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm w-full h-full border-none"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-900 text-white border-r border-white/10 shadow-2xl flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-black uppercase">GadiSewa</h2>
                  <p className="text-xs text-slate-400">Staff Portal</p>
                </div>
              </div>
              <button
                type="button"
                className="cursor-pointer p-1 rounded-lg hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {staffNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
            <div className="p-4 border-t border-white/10 bg-slate-950/40">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                  Signed in as
                </p>
                <p className="mt-1 text-sm font-semibold truncate">{userLabel}</p>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="relative lg:ml-72 min-h-screen">
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="lg:hidden inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
                aria-label="Open staff menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400 font-semibold">
                  Staff Workspace
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 leading-tight">
                  {pageTitle}
                </h1>
                {subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
                )}
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800 transition-colors"
            >
              Switch view
            </Link>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
