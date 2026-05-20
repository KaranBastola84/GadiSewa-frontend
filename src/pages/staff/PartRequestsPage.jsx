import React, { useState, useEffect } from "react";
import StaffLayout from "../../components/StaffLayout";
import apiConfig from "../../config/apiConfig";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const STATUS_OPTIONS = [
  { value: 1, label: "Requested", color: "text-blue-600 bg-blue-50" },
  { value: 2, label: "Approved", color: "text-indigo-600 bg-indigo-50" },
  { value: 3, label: "Rejected", color: "text-red-600 bg-red-50" },
  { value: 4, label: "Ordered", color: "text-amber-600 bg-amber-50" },
  { value: 5, label: "Fulfilled", color: "text-emerald-600 bg-emerald-50" },
];

export default function PartRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiConfig.get("/part-requests");
      setRequests(response.data?.result || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch part requests.");
      toast.error("Failed to load part requests.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatusId) => {
    try {
      setUpdatingId(id);
      
      const payload = {
        status: parseInt(newStatusId, 10),
        notes: "Updated from Staff UI",
      };

      await apiConfig.put(`/part-requests/${id}/status`, payload);
      
      toast.success("Status updated successfully!");
      
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status: parseInt(newStatusId, 10) } : req
      ));
      
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusUI = (statusId) => {
    return STATUS_OPTIONS.find(s => s.value === statusId) || { label: "Unknown", color: "text-gray-600 bg-gray-50" };
  };

  return (
    <StaffLayout pageTitle="Part Requests" subtitle="Monitor and manage unavailability part requests from customers.">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">All Part Requests</h2>
          <button onClick={fetchRequests} className="text-sm text-emerald-600 font-semibold hover:text-emerald-700 hover:underline">
            Refresh Data
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
            <p className="font-medium">Loading requests...</p>
          </div>
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center text-rose-500">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold">{error}</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">No part requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Staff / Customer</th>
                  <th className="px-6 py-4 font-semibold">Part Required</th>
                  <th className="px-6 py-4 font-semibold text-center">Qty</th>
                  <th className="px-6 py-4 font-semibold">Requested Date</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map(req => {
                  const currentStatus = getStatusUI(req.status);
                  
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block">{req.requestedByStaffName || "Customer Gateway"}</span>
                        <span className="text-xs text-slate-400">{req.requestNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 block">{req.partName}</span>
                        <span className="text-xs text-slate-400">P/N: {req.partNumber}</span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {req.quantityRequested}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                         <div className="relative isolate">
                            {updatingId === req.id && (
                               <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded">
                                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                               </div>
                            )}
                            <select 
                              value={req.status}
                              onChange={(e) => handleStatusChange(req.id, e.target.value)}
                              disabled={updatingId === req.id}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer outline-hidden focus:ring-2 focus:ring-emerald-500/20 appearance-none pr-8 ${currentStatus.color}`}
                              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd' /%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.2em 1.2em' }}
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="text-slate-900 bg-white">
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                         </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
