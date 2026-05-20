import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Toast from '../../components/Toast';
import { getCustomerFullProfile, getCustomerHistory, updateCustomer } from '../../services/staffService';

const Section = ({ title, children }) => (
  <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
      <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CustomerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const showToast = (message, type = 'success') => setToast({ message, type });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getCustomerFullProfile(id);
      const data = res?.data ?? res;
      setProfile(data);
      setEditForm({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phoneNumber: data.phoneNumber || data.phone || '',
        address: data.address || '',
      });
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to load profile', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const loadHistory = useCallback(async () => {
    try {
      const res = await getCustomerHistory(id);
      setHistory(res?.data ?? res);
    } catch (_) { /* history optional */ }
  }, [id]);

  useEffect(() => { loadProfile(); loadHistory(); }, [loadProfile, loadHistory]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateCustomer(id, editForm);
      showToast('Customer updated successfully');
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      showToast(err?.response?.data?.message || 'Update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest">Customer not found</div>
  );

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || profile.fullName || 'Customer';
  const vehicles = profile.vehicles ?? [];
  const recentInvoices = profile.recentInvoices ?? profile.invoices ?? [];
  const recentAppointments = profile.recentAppointments ?? profile.appointments ?? [];

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">{fullName}</h1>
            <p className="text-slate-400 font-medium">{profile.email || '—'} · {profile.phoneNumber || profile.phone || '—'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/staff/invoices/create?customerId=${id}&customerName=${encodeURIComponent(fullName)}`}
            className="border border-slate-200 hover:border-slate-900 text-slate-900 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
          >
            New Invoice
          </Link>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#1a1a1a] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Edit Customer
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => setIsEditing(false)} className="border border-slate-200 text-slate-500 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Cancel</button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-60"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {['overview', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-white shadow text-slate-900' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal info */}
            <Section title="Personal Information">
              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="First Name" name="firstName" value={editForm.firstName} onChange={e => setEditForm(p => ({ ...p, firstName: e.target.value }))} />
                  <Input label="Last Name" name="lastName" value={editForm.lastName} onChange={e => setEditForm(p => ({ ...p, lastName: e.target.value }))} />
                  <Input label="Phone" name="phoneNumber" value={editForm.phoneNumber} onChange={e => setEditForm(p => ({ ...p, phoneNumber: e.target.value }))} />
                  <Input label="Address" name="address" value={editForm.address} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-4">
                  {[
                    { label: 'Full Name', value: fullName },
                    { label: 'Email', value: profile.email || '—' },
                    { label: 'Phone', value: profile.phoneNumber || profile.phone || '—' },
                    { label: 'Address', value: profile.address || '—' },
                    { label: 'Joined', value: profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—' },
                    { label: 'Total Spent', value: profile.totalSpent ? `Rs. ${Number(profile.totalSpent).toLocaleString()}` : '—' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Vehicles */}
            <Section title={`Vehicles (${vehicles.length})`}>
              {vehicles.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">No vehicles on record</div>
              ) : (
                <div className="space-y-3">
                  {vehicles.map((v, i) => (
                    <div key={v.id ?? i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">{v.registrationNumber || v.plateNumber}</p>
                        <p className="text-xs text-slate-400">{[v.year, v.make, v.model, v.color].filter(Boolean).join(' · ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Recent Invoices */}
            <Section title="Recent Invoices">
              {recentInvoices.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">No invoices yet</div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr>
                      {['Invoice', 'Date', 'Total', 'Status'].map(h => (
                        <th key={h} className="pb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentInvoices.slice(0, 5).map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 text-xs font-bold text-blue-600">
                          <Link to={`/staff/invoices/${inv.id}`}>{inv.invoiceNumber || inv.id}</Link>
                        </td>
                        <td className="py-3 text-xs text-slate-500">{inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="py-3 text-xs font-bold text-slate-900">Rs. {Number(inv.totalAmount ?? inv.total ?? 0).toLocaleString()}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                            inv.paymentStatus === 'Paid' || inv.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {inv.paymentStatus || inv.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Appointments */}
            <Section title="Recent Appointments">
              {recentAppointments.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">No appointments</div>
              ) : (
                <div className="space-y-3">
                  {recentAppointments.slice(0, 4).map((appt, i) => (
                    <div key={appt.id ?? i} className="p-3 bg-slate-50 rounded-xl">
                      <p className="text-xs font-bold text-slate-900">{appt.serviceType || appt.type || 'Appointment'}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{appt.scheduledAt ? new Date(appt.scheduledAt).toLocaleDateString() : '—'}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                        appt.status === 'Completed' ? 'bg-green-50 text-green-600' :
                        appt.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                      }`}>{appt.status || 'Scheduled'}</span>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>
        </div>
      ) : (
        /* History tab */
        <Section title="Full Service History">
          {!history ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {(Array.isArray(history) ? history : history?.data ?? []).map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.description || item.type || 'Service'}</p>
                    <p className="text-xs text-slate-400">{item.date ? new Date(item.date).toLocaleDateString() : '—'}</p>
                  </div>
                </div>
              ))}
              {(Array.isArray(history) ? history : history?.data ?? []).length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">No history records found</div>
              )}
            </div>
          )}
        </Section>
      )}
    </div>
  );
};

export default CustomerProfile;
