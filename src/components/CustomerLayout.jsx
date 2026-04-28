import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCustomer } from "../context/CustomerContext";
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

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  }

  function isActive(path) {
    return location.pathname === path;
  }

  const sidebarBody = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive(item.path)
                  ? "bg-sky-600/20 text-sky-400"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
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

      <div className="px-3 py-4 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold text-sm">
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
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900 z-30">
        {sidebarBody}
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-slate-900 z-50">
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

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(true)}
                className="lg:hidden text-slate-600 hover:text-slate-900"
              >
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-slate-900">{pageTitle}</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/customer/notifications"
                className="relative p-2 text-slate-500 hover:text-slate-700 rounded-lg transition"
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
                className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white font-semibold text-sm"
              >
                {profile?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">{children}</main>

        <footer className="px-4 py-3 border-t border-slate-200 bg-white">
          <p className="text-center text-xs text-slate-400">
            &copy; 2026 GadiSewa Vehicle Service Center
          </p>
        </footer>
      </div>
    </div>
  );
}
