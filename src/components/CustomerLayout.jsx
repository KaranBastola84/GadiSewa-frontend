import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";
import { useAuthContext } from "../context/AuthContext";
import {
  Home,
  User,
  Truck,
  CalendarDays,
  Clock,
  Package,
  Star,
  Bell,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { path: "/customer/dashboard", label: "Dashboard", icon: Home },
  { path: "/customer/profile", label: "My Profile", icon: User },
  { path: "/customer/vehicles", label: "My Vehicles", icon: Truck },
  { path: "/customer/appointments", label: "Appointments", icon: CalendarDays },
  { path: "/customer/history", label: "Purchase History", icon: Clock },
  { path: "/customer/requests", label: "Part Requests", icon: Package },
  { path: "/customer/reviews", label: "Reviews", icon: Star },
  { path: "/customer/notifications", label: "Notifications", icon: Bell },
];

export default function CustomerLayout({ children, pageTitle }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, unreadCount } = useCustomer();
  const { logout } = useAuthContext();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  const sidebarBody = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-white/10 bg-white/3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
            <span className="text-white font-black text-lg">G</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">GadiSewa</h1>
            <p className="text-slate-400 text-xs">Vehicle Service Center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-linear-to-r from-sky-500/20 to-indigo-500/20 text-white ring-1 ring-white/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {item.label}
              {item.icon === Bell && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 bg-white/2">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-sky-500/20">
            {profile?.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {profile?.fullName || "Customer"}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {profile?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_30%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]">
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-slate-950/95 backdrop-blur-xl border-r border-white/10 z-30 shadow-2xl shadow-slate-900/20">
        {sidebarBody}
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-slate-950/98 backdrop-blur-xl border-r border-white/10 z-50 shadow-2xl shadow-slate-900/40">
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            {sidebarBody}
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white/75 backdrop-blur-xl border-b border-white/60 px-4 sm:px-6 lg:px-8 py-4 shadow-sm shadow-slate-900/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden text-slate-600 hover:text-slate-900 rounded-lg p-2 hover:bg-slate-100"
              >
                <Menu size={24} />
              </button>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400 font-semibold">
                  GadiSewa Console
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  {pageTitle}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/customer/notifications"
                className="relative p-2 text-slate-500 hover:text-slate-700 rounded-xl transition hover:bg-slate-100"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                to="/customer/profile"
                className="w-9 h-9 rounded-full bg-linear-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-sky-500/20"
              >
                {profile?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</main>

        <footer className="px-4 py-3 border-t border-slate-200/80 bg-white/70 backdrop-blur-xl">
          <p className="text-center text-xs text-slate-400">
            &copy; 2026 GadiSewa Vehicle Service Center
          </p>
        </footer>
      </div>
    </div>
  );
}
