import React, { useState, useEffect } from 'react';
import Toast from '../../components/Toast';
import { getAppointments, updateAppointmentStatus } from '../../services/staffService';

const STATUSES = ['Scheduled', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'NoShow'];

const statusStyle = (s) => {
  switch (s) {
    case 'Completed': return 'bg-green-100 text-green-700';
    case 'Cancelled': return 'bg-red-100 text-red-700';
    case 'InProgress': return 'bg-blue-100 text-blue-700';
    case 'Confirmed': return 'bg-purple-100 text-purple-700';
    case 'NoShow': return 'bg-slate-100 text-slate-500';
    default: return 'bg-yellow-50 text-yellow-700';
  }
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    (async () => {
      try {
        const res = await getAppointments();
        setAppointments(Array.isArray(res) ? res : (res?.data ?? []));
      } catch (err) {
        showToast(err?.response?.data?.message || 'Failed to load appointments', 'error');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleStatusChange = async (apptId, newStatus) => {
    setUpdating(apptId);
    const prev = appointments;
    // Optimistic update
    setAppointments(list =>
      list.map(a => a.id === apptId ? { ...a, status: newStatus } : a)
    );
    try {
      await updateAppointmentStatus(apptId, newStatus);
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to update status', 'error');
      setAppointments(prev);
    } finally {
      setUpdating(null);
    }
  };

  const allStatuses = ['All', ...STATUSES];
  const filtered = filterStatus === 'All' ? appointments : appointments.filter(a => a.status === filterStatus);

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Appointments</h1>
        <p className="text-slate-400 font-medium">View and manage service appointments</p>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Filter bar */}
        <div className="p-5 border-b border-slate-50 overflow-x-auto">
          <div className="flex gap-1 w-max">
            {allStatuses.map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  filterStatus === s ? 'bg-[#1a1a1a] text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  {['#', 'Customer', 'Vehicle', 'Service', 'Scheduled', 'Status', 'Update'].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                      No appointments found
                    </td>
                  </tr>
                ) : filtered.map((appt) => {
                  const customerName = appt.customerName ||
                    (appt.customer ? `${appt.customer.firstName ?? ''} ${appt.customer.lastName ?? ''}`.trim() : '—');
                  const vehicle = appt.vehicleRegistration || appt.vehicle?.registrationNumber || '—';
                  const isUpdating = updating === appt.id;

                  return (
                    <tr key={appt.id} className={`hover:bg-slate-50/50 transition-colors ${isUpdating ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 text-xs font-bold text-slate-400">
                        {appt.appointmentNumber || appt.id?.toString().slice(0, 8)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-900">{customerName}</p>
                        {appt.customer?.phoneNumber && (
                          <p className="text-[10px] text-slate-400">{appt.customer.phoneNumber}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">{vehicle}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {appt.serviceType || appt.type || '—'}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {appt.scheduledAt
                          ? new Date(appt.scheduledAt).toLocaleString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${statusStyle(appt.status)}`}>
                          {appt.status || 'Scheduled'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={appt.status || 'Scheduled'}
                          onChange={e => handleStatusChange(appt.id, e.target.value)}
                          disabled={isUpdating}
                          className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
