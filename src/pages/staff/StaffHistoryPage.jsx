import React from "react";
import StaffLayout from "../../components/StaffLayout";
import { History, Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function StaffHistoryPage() {
  const historyData = [
    { type: "Service", description: "Full Engine Tune-up & Oil Change", status: "Completed", date: "May 10, 2026", mechanic: "Ram", total: "रु 15,000", vehicle: "BA 1 CHA 1234 (Toyota Prado)" },
    { type: "Parts Sale", description: "Ceramic Brake Pads Setup", status: "Completed", date: "May 19, 2026", mechanic: "N/A", total: "रु 10,791", vehicle: "BA 1 CHA 1234 (Toyota Prado)" },
    { type: "Appointment", description: "Suspension Checkup", status: "Pending", date: "May 25, 2026", mechanic: "Hari", total: "रु 0 (Est.)", vehicle: "BA 1 CHA 1234 (Toyota Prado)" },
  ];

  return (
    <StaffLayout pageTitle="Customer History" subtitle="Viewing interaction history for: Rajesh Hamal">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Filter / Customer Header */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-black text-xl">
              RH
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">Rajesh Hamal</h2>
              <p className="text-sm text-slate-500 font-medium">CUST-001 • Baneshwor, Kathmandu</p>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button className="px-4 py-2 bg-white text-emerald-700 font-bold rounded-md shadow-xs text-sm">All History</button>
            <button className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-md text-sm transition-colors">Purchases</button>
            <button className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium rounded-md text-sm transition-colors">Services</button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs p-6 md:p-8">
          <h3 className="font-bold text-slate-900 mb-8 pb-4 border-b border-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" /> Activity Timeline
          </h3>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.2rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-slate-100 before:to-transparent">
            {historyData.map((item, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 shadow-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 z-10 transition-colors group-hover:bg-emerald-50">
                  {item.status === "Completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-[3rem] md:ml-0 p-5 rounded-2xl border border-slate-100 bg-white shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{item.type}</span>
                    <span className="text-xs font-medium text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{item.description}</h4>
                  <p className="text-xs text-slate-500 mb-3">{item.vehicle}</p>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {item.status}
                    </span>
                    <span className="text-sm font-black text-slate-700">{item.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
