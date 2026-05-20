import { useState, useEffect } from "react";
import StaffLayout from "../../components/StaffLayout";
import partRequestsService from "../../services/partRequestsService";
import adminVendorsService from "../../services/adminVendorsService";
import { Wrench, Clock, CheckCircle2, XCircle, FileText, X, AlertCircle } from "lucide-react";

export default function StaffPartRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal and form state
  const [selectedReq, setSelectedReq] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: 1,
    vendorId: "",
    notes: "",
  });
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [reqRes, vendorRes] = await Promise.all([
        partRequestsService.getRequests(),
        adminVendorsService.getVendors().catch(() => ({ result: [] })), // Fallback if unauthorized for vendor directory
      ]);

      const rawReqs = Array.isArray(reqRes) ? reqRes : reqRes?.result || reqRes?.requests || [];
      const rawVendors = Array.isArray(vendorRes) ? vendorRes : vendorRes?.result || [];

      setRequests(rawReqs);
      setVendors(rawVendors);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load part requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openStatusUpdate = (req) => {
    setSelectedReq(req);
    setStatusForm({
      status: req.status,
      vendorId: req.vendorId || "",
      notes: req.notes || "",
    });
    setModalError("");
    setModalSuccess("");
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    try {
      setModalError("");
      setModalSuccess("");

      const payload = {
        status: parseInt(statusForm.status),
        notes: statusForm.notes.trim() || null,
        vendorId: statusForm.vendorId || null,
      };

      await partRequestsService.updateRequestStatus(selectedReq.id, payload);
      setModalSuccess("Part request status updated!");
      setTimeout(() => {
        setShowStatusModal(false);
        loadData();
      }, 1000);
    } catch (err) {
      console.error(err);
      setModalError(err.message || "Failed to update request status.");
    }
  };

  const statusMap = {
    1: { text: "Requested", bg: "bg-amber-50 text-amber-700" },
    2: { text: "Approved", bg: "bg-blue-50 text-blue-700" },
    3: { text: "Rejected", bg: "bg-red-50 text-red-700" },
    4: { text: "Ordered", bg: "bg-indigo-50 text-indigo-700" },
    5: { text: "Fulfilled", bg: "bg-green-50 text-green-700" },
  };

  const getAvailableStatusOptions = (currentStatus) => {
    if (currentStatus === 1) {
      return [
        { value: 1, label: "Requested" },
        { value: 2, label: "Approved" },
        { value: 3, label: "Rejected" },
      ];
    }
    if (currentStatus === 2) {
      return [
        { value: 2, label: "Approved" },
        { value: 4, label: "Ordered" },
        { value: 3, label: "Rejected" },
      ];
    }
    if (currentStatus === 4) {
      return [
        { value: 4, label: "Ordered" },
        { value: 5, label: "Fulfilled" },
        { value: 3, label: "Rejected" },
      ];
    }
    return [
      { value: 3, label: "Rejected" },
      { value: 5, label: "Fulfilled" },
    ];
  };

  return (
    <StaffLayout pageTitle="Part Sourcing Requests" subtitle="Track parts requested by mechanics and assign external vendors">
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">{error}</div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
            All sourcing clear! No active part requests at this time.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                  <tr>
                    <th className="py-3 px-5">Requested Part</th>
                    <th className="py-3 px-5">Quantity</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Requested By</th>
                    <th className="py-3 px-5">Vendor Assigned</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((req) => {
                    const statusInfo = statusMap[req.status] || { text: "Unknown", bg: "bg-slate-50 text-slate-650" };
                    return (
                      <tr key={req.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-5">
                          <p className="font-semibold text-slate-900">{req.partName}</p>
                          {req.partNumber && <p className="text-[10px] text-slate-400 font-mono">No: {req.partNumber}</p>}
                        </td>
                        <td className="py-4 px-5 font-mono text-slate-700 font-bold">{req.quantity} units</td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusInfo.bg}`}
                          >
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-500">{req.customerName || "Customer"}</td>
                        <td className="py-4 px-5 text-xs text-slate-650 font-semibold">{req.vendorName || "Not Assigned"}</td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => openStatusUpdate(req)}
                            disabled={req.status === 3 || req.status === 5}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition shadow-xs"
                          >
                            <FileText size={12} /> Manage
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

      {/* STATUS UPDATE MODAL */}
      {showStatusModal && selectedReq && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 w-full max-w-md shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-sky-600" /> Sourcing Status Update
            </h3>

            {modalError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">{modalError}</div>
            )}
            {modalSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs">{modalSuccess}</div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                <p><span className="font-semibold text-slate-700">Part:</span> {selectedReq.partName}</p>
                <p><span className="font-semibold text-slate-700">Quantity:</span> {selectedReq.quantity} units</p>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Request Status *</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: parseInt(e.target.value) })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {getAvailableStatusOptions(selectedReq.status).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vendor Selector (Shown only when status transitions to Approved or Ordered) */}
              {(statusForm.status === 2 || statusForm.status === 4) && (
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Vendor</label>
                  <select
                    value={statusForm.vendorId}
                    onChange={(e) => setStatusForm({ ...statusForm, vendorId: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">-- No Vendor Assigned --</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.contactPerson || "External Vendor"})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Internal Notes</label>
                <textarea
                  placeholder="Notes for order details, tracking or reasons for rejection..."
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
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}
