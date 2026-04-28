import { Link } from "react-router-dom";
import CustomerLayout from "../../components/CustomerLayout";
import { useCustomer } from "../../context/CustomerContext";

export default function Dashboard() {
  const {
    profile,
    vehicles,
    appointments,
    history,
    unreadCount,
    totalSpent,
    loading,
  } = useCustomer();

  if (loading) {
    return (
      <CustomerLayout pageTitle="Dashboard">
        <div className="flex items-center justify-center py-20">
          <p className="text-slate-400">Loading...</p>
        </div>
      </CustomerLayout>
    );
  }

  // filter upcoming ones
  const upcomingAppts = appointments.filter(
    (a) => a.status !== "Cancelled" && new Date(a.date) >= new Date(),
  );

  // pending credit payments
  const creditItems = history.filter((h) => h.status === "Credit");
  const creditTotal = creditItems.reduce((s, h) => s + h.amount, 0);

  // check loyalty eligibility (spent > 5000 in single purchase)
  const hasLoyalty = totalSpent >= 5000;

  return (
    <CustomerLayout pageTitle="Dashboard">
      <div className="relative overflow-hidden rounded-[28px] p-6 sm:p-8 mb-6 text-white shadow-2xl shadow-sky-500/20 bg-linear-to-br from-sky-600 via-sky-700 to-indigo-800 border border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.22),transparent_28%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold tracking-wide uppercase text-sky-50">
            Customer overview
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold">
            Welcome, {profile?.fullName || "Customer"}!
          </h1>
          <p className="mt-2 max-w-2xl text-sky-100">
            Manage your vehicles, book appointments, and track purchases from a
            single polished workspace.
          </p>
          {hasLoyalty && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
              <span>⭐</span> Loyalty Member - 10% off on purchases over Rs.
              5,000
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Vehicles"
          value={vehicles.length}
          link="/customer/vehicles"
        />
        <StatCard
          label="Appointments"
          value={upcomingAppts.length}
          link="/customer/appointments"
        />
        <StatCard
          label="Total Spent"
          value={`Rs. ${totalSpent.toLocaleString()}`}
          link="/customer/history"
        />
        <StatCard
          label="Unread Alerts"
          value={unreadCount}
          link="/customer/notifications"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-3">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <ActionLink
                to="/customer/appointments"
                label="Book Appointment"
                desc="Schedule a service"
              />
              <ActionLink
                to="/customer/requests"
                label="Request a Part"
                desc="Ask for unavailable parts"
              />
              <ActionLink
                to="/customer/reviews"
                label="Write a Review"
                desc="Share your feedback"
              />
              <ActionLink
                to="/customer/vehicles"
                label="Add Vehicle"
                desc="Register a new vehicle"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">
                Upcoming Appointments
              </h3>
              <Link
                to="/customer/appointments"
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                View all →
              </Link>
            </div>
            {upcomingAppts.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">
                No upcoming appointments.{" "}
                <Link to="/customer/appointments" className="text-sky-600">
                  Book one
                </Link>
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingAppts.slice(0, 3).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="text-center shrink-0">
                      <p className="text-xs text-sky-600 font-semibold">
                        {new Date(apt.date).toLocaleDateString("en", {
                          month: "short",
                        })}
                      </p>
                      <p className="text-lg font-bold text-sky-700">
                        {new Date(apt.date).getDate()}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {apt.serviceType}
                      </p>
                      <p className="text-xs text-slate-400">
                        {apt.vehicleName} • {apt.time}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        apt.status === "Confirmed"
                          ? "bg-green-50 text-green-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {creditItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="text-sm font-bold text-red-800">Pending Credit</h4>
              <p className="text-xs text-red-600 mt-1">
                You have Rs. {creditTotal.toLocaleString()} in unpaid balance.
              </p>
              <Link
                to="/customer/history"
                className="text-xs text-red-700 font-semibold mt-2 inline-block"
              >
                View details →
              </Link>
            </div>
          )}

          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">Recent Purchases</h3>
              <Link
                to="/customer/history"
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                View all →
              </Link>
            </div>
            {history.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">
                No purchase history yet.
              </p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b border-slate-50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {item.description}
                      </p>
                      <p className="text-xs text-slate-400">{item.date}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-bold text-slate-800">
                        Rs. {item.amount?.toLocaleString()}
                      </p>
                      <span
                        className={`text-xs ${item.status === "Paid" ? "text-green-600" : "text-red-600"}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-slate-800 rounded-xl p-5 text-white">
            <h3 className="font-bold mb-2">About GadiSewa</h3>
            <p className="text-sm text-slate-300">
              Your trusted vehicle service center. Genuine parts, expert
              servicing, fair pricing.
            </p>
            <div className="mt-3 space-y-1.5 text-xs text-slate-400">
              <p>📍 Kathmandu, Nepal</p>
              <p>📞 +977-1-4567890</p>
              <p>🕐 Sun - Fri: 8 AM - 6 PM</p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

// small stat card
function StatCard({ label, value, link }) {
  return (
    <Link
      to={link}
      className="group rounded-2xl p-4 border border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className="text-xl font-bold text-slate-900 mt-2">{value}</p>
      <div className="mt-3 h-0.5 w-10 rounded-full bg-sky-500/0 group-hover:bg-sky-500 transition-all" />
    </Link>
  );
}

// action link card
function ActionLink({ to, label, desc }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 hover:bg-white hover:border-sky-200 hover:shadow-md transition-all duration-200"
    >
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <span className="text-slate-300 group-hover:text-sky-500 transition">
        →
      </span>
    </Link>
  );
}
