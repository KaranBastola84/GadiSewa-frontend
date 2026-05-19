import React from "react";
import StaffLayout from "../../components/StaffLayout";
import { Printer, Download, Receipt, FileText, CheckCircle2 } from "lucide-react";

const invoices = [
  { id: "INV-2024-001", customer: "Rajesh Hamal", date: "May 19, 2026", amount: "रु 15,400", status: "Paid" },
  { id: "INV-2024-002", customer: "Bhuwan KC", date: "May 18, 2026", amount: "रु 8,200", status: "Paid" },
];

export default function InvoicePage() {
  return (
    <StaffLayout pageTitle="Invoices" subtitle="Manage, view, and print sales invoices.">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Invoice List */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-600" /> Recent Invoices
            </h3>
            <div className="space-y-3">
              {invoices.map((inv, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${idx === 0 ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 hover:border-slate-300'} cursor-pointer transition-colors`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-sm">{inv.id}</span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">{inv.status}</span>
                  </div>
                  <div className="text-sm font-medium text-emerald-600 mb-2">{inv.amount}</div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{inv.customer}</span>
                    <span>{inv.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
            {/* Header / Actions */}
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <FileText className="w-4 h-4" /> Preview: INV-2024-001
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-semibold transition-colors">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors">
                  <Printer className="w-4 h-4" /> Print
                </button>
              </div>
            </div>

            {/* A4 Document Area */}
            <div className="p-8 md:p-12 bg-white">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-3xl font-black uppercase text-slate-900 tracking-tight">GadiSewa</h1>
                  <p className="text-slate-500 text-sm mt-1">Kathmandu, Nepal</p>
                  <p className="text-slate-500 text-sm">support@gadisewa.com | +977-1-4000000</p>
                </div>
                <div className="text-right">
                  <h2 className="text-4xl text-slate-200 font-black tracking-tight mb-2 uppercase">Invoice</h2>
                  <p className="font-bold text-slate-900"># INV-2024-001</p>
                  <p className="text-sm text-slate-500 mt-1">Date: May 19, 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12 border-t border-b border-slate-100 py-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bill To</h3>
                  <p className="font-bold text-slate-900">Rajesh Hamal</p>
                  <p className="text-sm text-slate-600 mt-1">Baneshwor, Kathmandu</p>
                  <p className="text-sm text-slate-600">Phone: 9840000000</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Vehicle Details</h3>
                  <p className="font-bold text-slate-900">Toyota Prado (BA 1 CHA 1234)</p>
                  <p className="text-sm text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Verified Customer
                  </p>
                </div>
              </div>

              <table className="w-full text-left mb-12 border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-slate-900">
                    <th className="py-3 font-bold uppercase text-xs">Description</th>
                    <th className="py-3 font-bold uppercase text-xs text-center">Qty</th>
                    <th className="py-3 font-bold uppercase text-xs text-right">Unit Price</th>
                    <th className="py-3 font-bold uppercase text-xs text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr>
                    <td className="py-4 font-medium text-slate-800">Ceramic Brake Pads (Front)</td>
                    <td className="py-4 text-center">1</td>
                    <td className="py-4 text-right">रु 4,500</td>
                    <td className="py-4 text-right font-medium">रु 4,500</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-slate-800">Premium Engine Oil (Synthetic)</td>
                    <td className="py-4 text-center">2</td>
                    <td className="py-4 text-right">रु 2,100</td>
                    <td className="py-4 text-right font-medium">रु 4,200</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-slate-800">Oil Filter Replacement</td>
                    <td className="py-4 text-center">1</td>
                    <td className="py-4 text-right">रु 850</td>
                    <td className="py-4 text-right font-medium">रु 850</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="w-1/2 space-y-3">
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Subtotal</span>
                    <span>रु 9,550</span>
                  </div>
                  <div className="flex justify-between text-slate-500 text-sm">
                    <span>Tax (13%)</span>
                    <span>रु 1,241</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-emerald-600 text-xl">रु 10,791</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 text-center text-sm font-medium text-slate-400">
                Thank you for your business. Drive safely!
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
