import React, { useState } from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';

const CustomerManagement = () => {
  const [view, setView] = useState('list'); // 'list' or 'register'
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    vehicleType: 'Car',
    vehicleNumber: '',
    model: '',
    year: ''
  });

  const dummyCustomers = [
    { id: 'CUST-101', name: 'Ramesh Koirala', phone: '9841234567', vehicle: 'BA 2 PA 5544', lastService: '2026-04-10' },
    { id: 'CUST-102', name: 'Sita Sharma', phone: '9801234567', vehicle: 'BA 1 PA 1234', lastService: '2026-03-25' },
    { id: 'CUST-103', name: 'Hari Thapa', phone: '9811234567', vehicle: 'BA 3 PA 9988', lastService: '2026-04-20' },
    { id: 'CUST-104', name: 'Gita Poudel', phone: '9851234567', vehicle: 'BA 4 PA 4433', lastService: '2026-04-15' },
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    alert('Customer Registered (Simulation)');
    setView('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Customer Management</h1>
          <p className="text-slate-400 font-medium">Register and search customers or vehicle details.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView('list')}
            className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
              view === 'list' ? 'bg-[#1a1a1a] text-white' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            Search & List
          </button>
          <button 
            onClick={() => setView('register')}
            className={`px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
              view === 'register' ? 'bg-[#1a1a1a] text-white' : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            Register New
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50">
            <div className="relative max-w-md">
              <input 
                type="text" 
                placeholder="Search by name, phone, or vehicle #..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle Number</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Service</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dummyCustomers.filter(c => 
                  c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  c.phone.includes(searchQuery) || 
                  c.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{customer.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{customer.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{customer.vehicle}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{customer.lastService}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest mr-4">Details</button>
                      <button className="text-xs font-bold text-slate-900 hover:text-black uppercase tracking-widest">Service</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 max-w-4xl">
          <form onSubmit={handleRegister} className="space-y-8">
            <section>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Full Name" placeholder="Enter customer name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                <Input label="Phone Number" placeholder="98XXXXXXXX" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                <Input label="Email Address" type="email" placeholder="customer@email.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <Input label="Address" placeholder="Customer address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </section>

            <section>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-6">Vehicle Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Type</label>
                  <select 
                    className="w-full bg-white border border-slate-200 rounded-md py-3 px-4 text-slate-900 focus:outline-none focus:border-slate-900 transition-all text-sm"
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({...formData, vehicleType: e.target.value})}
                  >
                    <option>Car</option>
                    <option>Motorbike</option>
                    <option>Truck</option>
                    <option>Scooter</option>
                  </select>
                </div>
                <Input label="Vehicle Number" placeholder="BA X PA XXXX" value={formData.vehicleNumber} onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})} required />
                <Input label="Model" placeholder="e.g. Hilux" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} />
                <Input label="Year" placeholder="2024" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} />
              </div>
            </section>

            <div className="flex justify-end gap-4 pt-6">
              <button 
                type="button" 
                onClick={() => setView('list')}
                className="px-8 py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all"
              >
                Cancel
              </button>
              <div className="w-64">
                <Button type="submit">Complete Registration</Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
