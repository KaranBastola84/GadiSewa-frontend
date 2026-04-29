import React from 'react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Sales Today', value: 'Rs. 45,200', change: '+12%', icon: '💰' },
    { label: 'Customers Registered', value: '124', change: '+5%', icon: '👤' },
    { label: 'Part Sales', value: '48', change: '+18%', icon: '⚙️' },
    { label: 'Credit Overdue', value: '8 Users', change: '-2%', icon: '⚠️' }
  ];

  const recentTransactions = [
    { id: 'INV-001', customer: 'Ramesh Koirala', part: 'Brake Pad', amount: 'Rs. 2,500', status: 'Paid' },
    { id: 'INV-002', customer: 'Sita Sharma', part: 'Engine Oil', amount: 'Rs. 4,200', status: 'Credit' },
    { id: 'INV-003', customer: 'Hari Thapa', part: 'Air Filter', amount: 'Rs. 1,200', status: 'Paid' },
    { id: 'INV-004', customer: 'Gita Poudel', part: 'Battery', amount: 'Rs. 8,500', status: 'Paid' }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Staff Dashboard</h1>
        <p className="text-slate-400 font-medium">Welcome back! Here's an overview of today's activities.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tighter italic">Recent Transactions</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline tracking-widest uppercase">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{tx.id}</td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-900">{tx.customer}</p>
                      <p className="text-[10px] text-slate-400">{tx.part}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-900">{tx.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        tx.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tighter italic mb-2">Quick Actions</h2>
          <button className="w-full bg-[#1a1a1a] hover:bg-black text-white p-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-between">
            New Part Sale
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          </button>
          <button className="w-full border border-slate-200 hover:border-slate-400 text-slate-900 p-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-between">
            Register Customer
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </button>
          <button className="w-full border border-slate-200 hover:border-slate-400 text-slate-900 p-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-between">
            Vehicle Record
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
