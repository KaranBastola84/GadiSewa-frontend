import React, { useState, useEffect } from 'react';
import Toast from '../../components/Toast';
import { getPartRequests, updatePartRequestStatus, getParts } from '../../services/staffService';

const PartRequests = () => {
  const [requests, setRequests] = useState([]);
  const [parts, setParts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [toast, setToast] = useState(null);

  // Status enum maps
  const statusLabels = {
    0: 'Requested',
    1: 'Approved',
    2: 'Rejected',
    3: 'Ordered',
    4: 'Fulfilled'
  };

  const statusColors = {
    0: 'bg-yellow-50 text-yellow-600 border border-yellow-100',
    1: 'bg-green-50 text-green-600 border border-green-100',
    2: 'bg-red-50 text-red-600 border border-red-100',
    3: 'bg-blue-50 text-blue-600 border border-blue-100',
    4: 'bg-purple-50 text-purple-600 border border-purple-100'
  };

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await getPartRequests();
      setRequests(res?.result || res?.data || res || []);

      const partsRes = await getParts();
      setParts(partsRes?.result || partsRes?.data || partsRes || []);
    } catch (err) {
      showToast('Error loading live part requests, using offline demo mode.', 'info');
      // Offline fallback
      setRequests([
        {
          id: '1',
          requestNumber: 'PR-20260519-A3F2',
          partName: 'Brembo Brake Pads',
          quantityRequested: 4,
          status: 0,
          neededBy: '2026-05-25T00:00:00Z',
          requestedByName: 'Santosh Giri (Staff)',
          notes: 'Urgent requirement for Hyundai Tucson'
        },
        {
          id: '2',
          requestNumber: 'PR-20260518-8F4C',
          partName: 'Mobil1 Synthetic Oil 5W-30',
          quantityRequested: 12,
          status: 1,
          neededBy: '2026-05-28T00:00:00Z',
          requestedByName: 'Karan Bastola (Customer)',
          notes: 'Standard stock top up'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id, currentStatus) => {
    // Next transitions according to backend:
    // Requested -> Approved or Rejected
    // Approved -> Ordered or Rejected
    // Ordered -> Fulfilled or Rejected
    let nextStatus;
    if (currentStatus === 0) nextStatus = 1; // Approve
    else if (currentStatus === 1) nextStatus = 3; // Order
    else if (currentStatus === 3) nextStatus = 4; // Fulfill
    else return;

    try {
      await updatePartRequestStatus(id, nextStatus);
      showToast('Status updated successfully!');
      loadData();
    } catch (err) {
      // Offline fallback toggle for high interactivity
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status: nextStatus } : req));
      showToast('Offline mode: Updated request status locally.');
    }
  };

  const handleReject = async (id) => {
    try {
      await updatePartRequestStatus(id, 2); // Rejected
      showToast('Part request rejected.');
      loadData();
    } catch (err) {
      setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 2 } : req));
      showToast('Offline mode: Rejected request locally.');
    }
  };

  const filteredRequests = requests.filter(r => {
    if (statusFilter === '') return true;
    return r.status.toString() === statusFilter;
  });

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Part Requests</h1>
          <p className="text-slate-400 font-medium">Sourcing and inventory tracking requests.</p>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="0">Requested</option>
            <option value="1">Approved</option>
            <option value="2">Rejected</option>
            <option value="3">Ordered</option>
            <option value="4">Fulfilled</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Request Details</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Part</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Qty</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Needed By</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-12 text-center text-xs text-slate-400 font-medium">
                      No part requests found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-6">
                        <p className="text-xs font-black text-slate-900 tracking-tighter uppercase">{req.requestNumber}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">By: {req.requestedByName || 'System User'}</p>
                        {req.notes && <p className="text-[10px] text-slate-400 italic mt-1">"{req.notes}"</p>}
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{req.part?.name || req.partName || 'Unknown Part'}</span>
                      </td>
                      <td className="p-6 text-xs font-black text-slate-900">{req.quantityRequested}</td>
                      <td className="p-6 text-xs font-medium text-slate-500">
                        {req.neededBy ? new Date(req.neededBy).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${statusColors[req.status] || 'bg-slate-100 text-slate-600'}`}>
                          {statusLabels[req.status] || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-6 text-right space-x-2">
                        {req.status === 0 && (
                          <>
                            <button
                              onClick={() => handleStatusChange(req.id, req.status)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {req.status === 1 && (
                          <button
                            onClick={() => handleStatusChange(req.id, req.status)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Mark as Ordered
                          </button>
                        )}
                        {req.status === 3 && (
                          <button
                            onClick={() => handleStatusChange(req.id, req.status)}
                            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
                          >
                            Mark as Fulfilled
                          </button>
                        )}
                        {req.status > 3 || req.status === 2 ? (
                          <span className="text-[10px] text-slate-300 font-bold uppercase">Completed</span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartRequests;
