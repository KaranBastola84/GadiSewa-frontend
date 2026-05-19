import { useState } from "react";
import { Link } from "react-router-dom";
import CustomerLayout from "../../components/CustomerLayout";
import { useCustomer } from "../../context/CustomerContext";
import { Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, markRead, markAllRead, unreadCount } = useCustomer();
  const [filter, setFilter] = useState("all");

  const sorted = [...notifications].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return new Date(b.date) - new Date(a.date);
  });

  const filtered = sorted.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  function timeAgo(dateStr) {
    const days = Math.floor((new Date() - new Date(dateStr)) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return days + " days ago";
    if (days < 30) return Math.floor(days / 7) + "w ago";
    return Math.floor(days / 30) + "mo ago";
  }

  function typeBadge(type) {
    const map = {
      appointment: { label: "Appointment", cls: "bg-sky-50 text-sky-700" },
      payment: { label: "Payment", cls: "bg-red-50 text-red-700" },
      credit_reminder: { label: "Payment", cls: "bg-red-50 text-red-700" },
      loyalty: { label: "Loyalty", cls: "bg-amber-50 text-amber-700" },
      service: { label: "Service", cls: "bg-violet-50 text-violet-700" },
      general: { label: "Info", cls: "bg-slate-50 text-slate-700" },
    };
    return map[type] || map.general;
  }

  return (
    <CustomerLayout pageTitle="Notifications">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">
          {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
        </p>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
          >
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {["all", "unread", "read"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
              filter === f
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <Bell size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-400">
            {filter === "unread" ? "No unread notifications." : "No notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => {
            const badge = typeBadge(n.type);
            return (
              <div
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={`bg-white rounded-xl border p-4 cursor-pointer hover:shadow transition ${
                  n.read ? "border-slate-100 opacity-70" : "border-sky-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4
                        className={`text-sm font-bold ${n.read ? "text-slate-500" : "text-slate-800"}`}
                      >
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                      )}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                      <span className="text-xs text-slate-400 ml-auto">
                        {timeAgo(n.date)}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${n.read ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {n.message}
                    </p>
                    {!n.read && n.type === "credit_reminder" && (
                      <Link
                        to="/customer/history"
                        className="inline-block mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded font-semibold"
                      >
                        View Payment
                      </Link>
                    )}
                    {!n.read && (n.type === "appointment" || n.type === "service") && (
                      <Link
                        to="/customer/appointments"
                        className="inline-block mt-2 px-3 py-1 bg-sky-600 text-white text-xs rounded font-semibold"
                      >
                        View Appointments
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CustomerLayout>
  );
}
