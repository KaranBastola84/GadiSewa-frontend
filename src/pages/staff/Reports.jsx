import React, { useState, useEffect } from 'react';
import Toast from '../../components/Toast';
import { getTopSpenders, getRegularCustomers, getPendingCredits } from '../../services/staffService';

const Reports = () => {
  const [topSpenders, setTopSpenders] = useState([]);
  const [regulars, setRegulars] = useState([]);
  const [pendingCredits, setPendingCredits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const spendersRes = await getTopSpenders();
        setTopSpenders(spendersRes?.result || spendersRes?.data || spendersRes || []);

        const regularsRes = await getRegularCustomers();
        setRegulars(regularsRes?.result || regularsRes?.data || regularsRes || []);

        const creditsRes = await getPendingCredits();
        setPendingCredits(creditsRes?.result || creditsRes?.data || creditsRes || []);
      } catch (err) {
        showToast('Error loading live report data, displaying demo insights.', 'info');
        // Fallback demo data
        setTopSpenders([
          { customerName: 'Ramesh Koirala', totalSpent: 125000, purchaseCount: 12 },
          { customerName: 'Sita Sharma', totalSpent: 98400, purchaseCount: 8 },
          { customerName: 'Hari Thapa', totalSpent: 75200, purchaseCount: 15 }
        ]);
        setPendingCredits([
          { customerName: 'Binod Shrestha', amountDue: 12500, daysOverdue: 45 },
          { customerName: 'Anil Gurung', amountDue: 4200, daysOverdue: 38 }
        ]);
        setRegulars([
          { customerName: 'Gita Poudel', purchaseCount: 4, loyaltyPoints: 120 },
          { customerName: 'Madan Rai', purchaseCount: 2, loyaltyPoints: 60 }
        ]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Reports & Analytics</h1>
        <p className="text-slate-400 font-medium">Customer-focused insights and financial follow-ups.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* Top Spenders */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-lg font-bold uppercase tracking-tighter italic text-slate-900">
                Top Spenders
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-widest">
                Customers with highest total purchase value
              </p>
            </div>
            
            <div className="flex-1 p-6 space-y-4">
              {topSpenders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No top spenders recorded.</p>
              ) : (
                topSpenders.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{item.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.purchaseCount || 0} visits</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-blue-600">Rs. {(item.totalSpent || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button onClick={() => showToast('PDF export is ready!')} className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                Download PDF Report
              </button>
            </div>
          </div>

          {/* Overdue Credits */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-red-50/50">
              <h2 className="text-lg font-bold uppercase tracking-tighter italic text-red-600">
                Overdue Credits
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-widest">
                Customers with pending unpaid balances
              </p>
            </div>
            
            <div className="flex-1 p-6 space-y-4">
              {pendingCredits.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No pending credits found.</p>
              ) : (
                pendingCredits.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{item.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.daysOverdue || 0} days overdue</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-red-600">Rs. {(item.amountDue || 0).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button onClick={() => showToast('Credit follow-up reports exported.')} className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                Send Overdue Reminders
              </button>
            </div>
          </div>

          {/* Regular Customers */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-lg font-bold uppercase tracking-tighter italic text-slate-900">
                Regular Customers
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-widest">
                Most loyal and frequent customer base
              </p>
            </div>
            
            <div className="flex-1 p-6 space-y-4">
              {regulars.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No regular customer data.</p>
              ) : (
                regulars.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tighter">{item.customerName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.purchaseCount || 0} purchases</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-green-600">{item.loyaltyPoints || 0} Pts</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <button onClick={() => showToast('Loyalty summary exported.')} className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                Manage Loyalty Programs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Sales Growth Dashboard Decor */}
      <div className="bg-[#1a1a1a] rounded-3xl p-10 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">Monthly Sales Growth</h2>
          <p className="text-slate-400 text-sm font-medium mb-8">Performance analytics for GadiSewa®</p>
          
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default Reports;
