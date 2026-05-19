import React from "react";
import StaffLayout from "../../components/StaffLayout";
import { Users, ShoppingCart, DollarSign, PackageOpen, ArrowUpRight, ArrowDownRight } from "lucide-react";
// We will integrate recharts later once verified

const stats = [
  { label: "Today's Sales", value: "रु 15,400", change: "+12.5%", isPositive: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Parts Sold", value: "45", change: "+5.2%", isPositive: true, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "New Customers", value: "12", change: "+2", isPositive: true, icon: Users, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { label: "Low Stock Parts", value: "8", change: "-3", isPositive: false, icon: PackageOpen, color: "text-rose-500", bg: "bg-rose-500/10" }
];

const recentSales = [
  { id: "INV-2024-001", customer: "Rajesh Hamal", amount: "रु 4,500", status: "Completed", date: "Just now" },
  { id: "INV-2024-002", customer: "Bhuwan KC", amount: "रु 12,000", status: "Completed", date: "2 hours ago" },
  { id: "INV-2024-003", customer: "Dayahang Rai", amount: "रु 850", status: "Completed", date: "5 hours ago" },
  { id: "INV-2024-004", customer: "Saugat Malla", amount: "रु 2,100", status: "Pending", date: "1 day ago" },
];

export default function Dashboard() {
  return (
    <StaffLayout pageTitle="Dashboard" subtitle="Overview of your daily sales and customer operations.">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className={`inline-flex items-center gap-1 font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
                <span className="text-slate-400 ml-2">from yesterday</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Sales Overview</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-hidden">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-72 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 border-dashed">
            <p className="text-slate-400 text-sm font-medium">Chart visualization will appear here.</p>
          </div>
        </div>

        {/* Recent Activity / Sales */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-0 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Sales</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {recentSales.map((sale, i) => (
              <div key={i} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900">{sale.id}</span>
                  <span className="text-sm font-semibold text-emerald-600">{sale.amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{sale.customer}</span>
                  <span className="text-slate-400 text-xs">{sale.date}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <a href="/staff/sales" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">View all sales &rarr;</a>
          </div>
        </div>
      </div>
    </StaffLayout>
  );
}
