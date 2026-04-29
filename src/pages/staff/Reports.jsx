import React from 'react';

const Reports = () => {
  const reports = [
    {
      title: 'Top Spenders',
      description: 'Customers with highest total purchase value.',
      data: [
        { name: 'Ramesh Koirala', value: 'Rs. 1,25,000', count: '12 visits' },
        { name: 'Sita Sharma', value: 'Rs. 98,400', count: '8 visits' },
        { name: 'Hari Thapa', value: 'Rs. 75,200', count: '15 visits' },
      ]
    },
    {
      title: 'Overdue Credits',
      description: 'Customers with unpaid balances overdue by 1+ month.',
      data: [
        { name: 'Binod Shrestha', value: 'Rs. 12,500', count: '45 days overdue' },
        { name: 'Anil Gurung', value: 'Rs. 4,200', count: '38 days overdue' },
      ],
      alert: true
    },
    {
      title: 'Regular Customers',
      description: 'Most frequent visitors this month.',
      data: [
        { name: 'Gita Poudel', value: 'Weekly', count: '4 visits' },
        { name: 'Madan Rai', value: 'Bi-weekly', count: '2 visits' },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Reports & Analytics</h1>
        <p className="text-slate-400 font-medium">Customer-focused insights and financial follow-ups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {reports.map((report, index) => (
          <div key={index} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className={`p-6 border-b border-slate-50 ${report.alert ? 'bg-red-50/50' : ''}`}>
              <h2 className={`text-lg font-bold uppercase tracking-tighter italic ${report.alert ? 'text-red-600' : 'text-slate-900'}`}>
                {report.title}
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-widest">{report.description}</p>
            </div>
            
            <div className="flex-1 p-6 space-y-4">
              {report.data.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.count}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-black ${report.alert ? 'text-red-600' : 'text-blue-600'}`}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                Download PDF Report
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Summary Chart Placeholder */}
      <div className="bg-[#1a1a1a] rounded-3xl p-10 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Monthly Sales Growth</h2>
          <p className="text-slate-400 text-sm font-medium mb-8">Performance analytics for April 2026</p>
          
          <div className="flex items-end gap-3 h-40">
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-600 rounded-t-lg transition-all hover:bg-blue-400 group relative" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2">
            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
              <span key={d} className="text-[10px] font-black text-slate-500">{d}</span>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default Reports;
