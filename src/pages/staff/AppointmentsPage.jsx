import { useState, useEffect } from "react";
import StaffLayout from "../../components/StaffLayout";
import appointmentsService from "../../services/appointmentsService";
import adminStaffService from "../../services/adminStaffService";
import { Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, Edit, X, RefreshCw } from "lucide-react";

export default function StaffAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit / Status modal states
  const [selectedApt, setSelectedApt] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: 1, // AppointmentStatus
    assignedStaffId: "",
    notes: "",
  });
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [aptRes, staffRes] = await Promise.all([
        appointmentsService.getAppointments(),
        adminStaffService.getStaff().catch(() => ({ result: [] })), // Gracefully fall back if unauthorized for staff directory
      ]);

      const rawApts = Array.isArray(aptRes) ? aptRes : aptRes?.result || aptRes?.appointments || [];
      const rawStaff = Array.isArray(staffRes) ? staffRes : staffRes?.result || [];

      setAppointments(rawApts);
      setStaffList(rawStaff);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load appointments data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openStatusUpdate = (apt) => {
    setSelectedApt(apt);
    setStatusForm({
      status: apt.status,
      assignedStaffId: apt.assignedStaffId || "",
      notes: apt.notes || "",
    });
    setModalError("");
    setModalSuccess("");
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApt) return;
    try {
      setModalError("");
      setModalSuccess("");

      const payload = {
        status: parseInt(statusForm.status),
        notes: statusForm.notes.trim() || null,
        assignedStaffId: statusForm.assignedStaffId || null,
      };

      await appointmentsService.updateStaffAppointmentStatus(selectedApt.id, payload);
      setModalSuccess("Appointment updated successfully!");
      setTimeout(() => {
        setShowStatusModal(false);
        loadData();
      }, 1000);
    } catch (err) {
      console.error(err);
      setModalError(err.message || "Failed to update appointment status.");
    }
  };

  const statusMap = {
    1: { text: "Pending", bg: "bg-amber-50 text-amber-700", icon: Clock },
    2: { text: "Confirmed", bg: "bg-blue-50 text-blue-700", icon: CheckCircle },
    3: { text: "Cancelled", bg: "bg-red-50 text-red-700", icon: XCircle },
    4: { text: "Completed", bg: "bg-green-50 text-green-700", icon: CheckCircle },
  };

  // Helper to filter valid target statuses based on current status
  const getAvailableStatusOptions = (currentStatus) => {
    if (currentStatus === 1) {
      return [
        { value: 1, label: "Pending" },
        { value: 2, label: "Confirmed" },
        { value: 3, label: "Cancelled" },
      ];
    }
    if (currentStatus === 2) {
      return [
        { value: 2, label: "Confirmed" },
        { value: 4, label: "Completed" },
        { value: 3, label: "Cancelled" },
      ];
    }
    // Completed or Cancelled are terminal states
    return [
      { value: 3, label: "Cancelled" },
      { value: 4, label: "Completed" },
    ];
  };

  return (
    <StaffLayout pageTitle="Appointments Dashboard" subtitle="Manage bookings, assign technicians, and confirm repairs">
      <div className="space-y-6">
        {/* Header Action */}
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold">Active Bookings</h3>
          <button
            onClick={loadData}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer text-slate-650"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm animate-fade-in">
            No customer appointments found in the system.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="py-3 px-5">Booking ID</th>
                    <th className="py-3 px-5">Customer</th>
                    <th className="py-3 px-5">Vehicle</th>
                    <th className="py-3 px-5">Scheduled At</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Assigned Mechanic</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((apt) => {
                    const statusInfo = statusMap[apt.status] || { text: "Unknown", bg: "bg-slate-100 text-slate-650", icon: Clock };
                    const Icon = statusInfo.icon;
                    return (
                      <tr key={apt.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-5 font-mono text-slate-550 text-xs">#{apt.appointmentNumber || apt.id.slice(0, 8)}</td>
                        <td className="py-4 px-5 font-semibold text-slate-900">{apt.customerName}</td>
                        <td className="py-4 px-5 text-xs text-slate-600">
                          {apt.vehicleName || "Vehicle"} ({apt.registrationNumber})
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-500">
                          {new Date(apt.scheduledAt).toLocaleString()}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${statusInfo.bg}`}
                          >
                            <Icon size={10} /> {statusInfo.text}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-600 font-semibold">
                          {apt.assignedStaffName || "Unassigned"}
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => openStatusUpdate(apt)}
                            disabled={apt.status === 3 || apt.status === 4}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition shadow-xs"
                          >
                            <Edit size={12} /> Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* UPDATE STATUS MODAL */}
      {showStatusModal && selectedApt && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 w-full max-w-md shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-sky-600" /> Manage Appointment
            </h3>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{modalError}</div>
            )}
            {modalSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs">{modalSuccess}</div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Client Booking Details</p>
                <div className="mt-1.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <p><span className="font-semibold text-slate-700">Client:</span> {selectedApt.customerName}</p>
                  <p><span className="font-semibold text-slate-700">Vehicle:</span> {selectedApt.vehicleName} ({selectedApt.registrationNumber})</p>
                  <p><span className="font-semibold text-slate-700">Complaint:</span> {selectedApt.problemDescription}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-semibold">Appointment Status *</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: parseInt(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {getAvailableStatusOptions(selectedApt.status).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-semibold">Assign Mechanic / Staff</label>
                <select
                  value={statusForm.assignedStaffId}
                  onChange={(e) => setStatusForm({ ...statusForm, assignedStaffId: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">-- Leave Unassigned --</option>
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name || `${st.firstName} ${st.lastName}`} ({st.specialization || "General Mechanic"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 font-semibold">Resolution Notes</label>
                <textarea
                  placeholder="Include diagnostics or cancellation/completion notes..."
                  value={statusForm.notes}
                  onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                  rows="3"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-sky-700 transition shadow-xs"
                >
                  Confirm Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}
