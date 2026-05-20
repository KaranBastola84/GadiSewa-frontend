import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import StaffLayout from "../../components/StaffLayout";
import staffCustomersService from "../../services/staffCustomersService";
import customerService from "../../services/customerService";
import {
  User,
  Car,
  Calendar,
  Receipt,
  Edit2,
  Plus,
  Phone,
  Mail,
  MapPin,
  Award,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  X,
  FileText,
} from "lucide-react";

export default function CustomerProfilePage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview"); // overview, appointments, billing
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals status
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // Forms state
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phoneNumber: "", address: "" });
  const [vehicleForm, setVehicleForm] = useState({ registrationNumber: "", make: "", model: "", year: "", mileage: "0", color: "" });

  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [profData, histData] = await Promise.all([
        staffCustomersService.getCustomerFullProfile(id),
        staffCustomersService.getCustomerHistory(id),
      ]);
      setProfile(profData?.result || profData);
      setHistory(histData?.result || histData);

      // Populate edit form
      const info = profData?.result?.customerInfo || profData?.customerInfo;
      if (info) {
        const names = info.name.split(" ");
        setEditForm({
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          phoneNumber: info.phone || "",
          address: info.address || "",
        });
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load customer profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  async function handleEditCustomer(e) {
    e.preventDefault();
    try {
      setModalError("");
      await staffCustomersService.updateCustomer(id, {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
        address: editForm.address.trim(),
      });
      setShowEditModal(false);
      loadData();
    } catch (err) {
      setModalError(err.message || "Failed to update profile.");
    }
  }

  async function handleAddVehicle(e) {
    e.preventDefault();
    try {
      setModalError("");
      await customerService.addVehicle(id, {
        registrationNumber: vehicleForm.registrationNumber.trim().toUpperCase(),
        make: vehicleForm.make.trim(),
        model: vehicleForm.model.trim(),
        year: parseInt(vehicleForm.year),
        mileage: parseInt(vehicleForm.mileage) || 0,
        color: vehicleForm.color.trim(),
      });
      setShowVehicleModal(false);
      setVehicleForm({ registrationNumber: "", make: "", model: "", year: "", mileage: "0", color: "" });
      loadData();
    } catch (err) {
      setModalError(err.message || "Failed to add vehicle.");
    }
  }

  if (loading) {
    return (
      <StaffLayout pageTitle="Loading Profile...">
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
        </div>
      </StaffLayout>
    );
  }

  if (error || !profile) {
    return (
      <StaffLayout pageTitle="Customer Profile Error">
        <div className="bg-red-50 p-4 rounded-3xl text-red-700 text-center max-w-md mx-auto">
          <p>{error || "Customer profile could not be retrieved."}</p>
          <Link to="/staff/customers/search" className="text-sm font-semibold mt-3 inline-block underline">
            Back to Search
          </Link>
        </div>
      </StaffLayout>
    );
  }

  const info = profile.customerInfo;
  const statusMap = {
    1: "Pending",
    2: "Confirmed",
    3: "Cancelled",
    4: "Completed",
  };

  return (
    <StaffLayout pageTitle={info.name} subtitle={`Customer profile and service logs`}>
      <div className="space-y-6">
        {/* Profile Info Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl">
              {info.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{info.name}</h2>
                <button
                  onClick={() => {
                    setModalError("");
                    setShowEditModal(true);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Customer ID: {info.id}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Mail size={12} /> {info.email}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone size={12} /> {info.phone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {info.address}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Award size={18} />
              </span>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Loyalty Points</p>
              <p className="text-lg font-black text-slate-900">{info.loyaltyPoints || 0} pts</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-100 align-self-center" />
            <div className="text-center">
              <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <DollarSign size={18} />
              </span>
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Total Billing</p>
              <p className="text-lg font-black text-slate-900">Rs. {Number(info.totalSpent || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 gap-6">
          {["overview", "appointments", "billing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider cursor-pointer border-b-2 transition ${
                activeTab === tab
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}

        {/* 1. OVERVIEW & VEHICLES */}
        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left summary details */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs h-fit space-y-4">
              <h3 className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold mb-4">Summary Metrics</h3>
              <div>
                <p className="text-xs text-slate-400">Total Credit Due</p>
                <p className="text-lg font-black text-rose-600">Rs. {Number(history?.totalUnpaid || 0).toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Appointments</p>
                  <p className="text-base font-bold text-slate-800">{history?.totalAppointments || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Completed</p>
                  <p className="text-base font-bold text-green-600">{history?.completedAppointments || 0}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 space-y-1">
                <p>First Seen: {history?.firstAppointmentDate ? new Date(history.firstAppointmentDate).toLocaleDateString() : "N/A"}</p>
                <p>Last Activity: {history?.lastAppointmentDate ? new Date(history.lastAppointmentDate).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>

            {/* Right vehicles details */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Registered Vehicles</h3>
                <button
                  onClick={() => {
                    setModalError("");
                    setShowVehicleModal(true);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 transition cursor-pointer shadow-xs"
                >
                  <Plus size={12} /> Add Vehicle
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {profile.vehicles && profile.vehicles.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center text-slate-400 text-xs sm:col-span-2">
                    No vehicles registered for this client.
                  </div>
                ) : (
                  profile.vehicles.map((v) => (
                    <div key={v.vehicleId} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                            <Car size={16} />
                          </span>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{v.make} {v.model}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Year: {v.year} • Color: {v.color}</p>
                          </div>
                        </div>
                        {v.mileage > 0 && (
                          <p className="text-[11px] text-slate-500 mt-2 font-mono">Mileage: {v.mileage.toLocaleString()} km</p>
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {v.registrationNumber}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. APPOINTMENTS TAB */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {!history?.recentAppointments || history.recentAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No appointment history found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {history.recentAppointments.map((apt) => (
                  <div key={apt.appointmentId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-slate-500">#{apt.appointmentNumber}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            apt.status === "Completed"
                              ? "bg-green-50 text-green-700"
                              : apt.status === "Cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 mt-2">{apt.problemDescription}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Vehicle: <span className="font-mono">{apt.vehicleRegistration}</span> • Staff: {apt.assignedStaffName}
                      </p>
                      {apt.notes && <p className="text-xs text-slate-500 mt-1 italic">Notes: {apt.notes}</p>}
                    </div>
                    <div className="text-left sm:text-right text-[11px] text-slate-400 shrink-0">
                      <p className="font-semibold">Scheduled Date</p>
                      <p>{new Date(apt.scheduledAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. BILLING & INVOICES TAB */}
        {activeTab === "billing" && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {!history?.recentInvoices || history.recentInvoices.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">No billing records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[11px] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-5">Invoice No</th>
                      <th className="py-3 px-5">Date</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Discount</th>
                      <th className="py-3 px-5 text-right">Total Amount</th>
                      <th className="py-3 px-5 text-right">Due</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {history.recentInvoices.map((inv) => (
                      <tr key={inv.invoiceId} className="hover:bg-slate-50/50">
                        <td className="py-4 px-5 font-mono font-bold text-slate-800">{inv.invoiceNumber}</td>
                        <td className="py-4 px-5 text-xs text-slate-500">
                          {new Date(inv.invoiceDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                              inv.status === "Paid"
                                ? "bg-green-50 text-green-700"
                                : inv.status === "Credit" || inv.status === "Overdue"
                                ? "bg-red-50 text-red-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right text-green-600 font-mono">
                          Rs. {inv.discountAmount.toLocaleString()}
                        </td>
                        <td className="py-4 px-5 text-right font-mono font-semibold text-slate-850">
                          Rs. {inv.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-4 px-5 text-right font-mono text-rose-600">
                          Rs. {inv.amountDue.toLocaleString()}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <Link
                            to={`/staff/invoices/${inv.invoiceId}`}
                            className="text-sky-600 hover:text-sky-700 font-semibold text-xs inline-flex items-center gap-0.5"
                          >
                            Details <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 w-full max-w-md shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <User size={18} className="text-sky-600" /> Edit Profile Details
            </h3>
            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{modalError}</div>
            )}

            <form onSubmit={handleEditCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-sky-700 transition shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD VEHICLE MODAL */}
      {showVehicleModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 w-full max-w-md shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowVehicleModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Car size={18} className="text-sky-600" /> Register Vehicle
            </h3>
            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{modalError}</div>
            )}

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Plate Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BA-3-PA-1010"
                  value={vehicleForm.registrationNumber}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Make *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Honda"
                    value={vehicleForm.make}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, make: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Model *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Civic"
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Mileage</label>
                  <input
                    type="number"
                    value={vehicleForm.mileage}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, mileage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Color *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Red"
                    value={vehicleForm.color}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, color: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-sky-700 transition shadow-xs"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}
