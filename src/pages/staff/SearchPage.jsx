import React, { useState } from "react";
import StaffLayout from "../../components/StaffLayout";
import { Search, MapPin, Phone, Car, MoreVertical, Edit2, History } from "lucide-react";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const customers = [
    { id: "CUST-001", name: "Rajesh Hamal", phone: "9800000001", address: "Kathmandu, Nepal", vehicle: "Toyota Prado", added: "2024-02-15" },
    { id: "CUST-002", name: "Bhuwan KC", phone: "9800000002", address: "Pokhara, Nepal", vehicle: "Honda City", added: "2024-02-18" },
    { id: "CUST-003", name: "Dayahang Rai", phone: "9800000003", address: "Dharan, Nepal", vehicle: "Suzuki Swift", added: "2024-03-01" },
  ];

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm) || 
    c.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StaffLayout pageTitle="Quick Search" subtitle="Find existing customers by name, phone number, or vehicle.">
      <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-xs mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, phone, or vehicle (e.g., 'Rajesh', '98...', 'Toyota')"
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-colors whitespace-nowrap shadow-lg shadow-emerald-500/20">
          Search
        </button>
      </div>

      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Results ({filteredCustomers.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Customer Info</th>
                <th className="px-6 py-4 font-semibold">Contact & Address</th>
                <th className="px-6 py-4 font-semibold">Primary Vehicle</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{c.name}</span>
                        <span className="text-xs text-slate-500">{c.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {c.phone}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {c.address}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
                        <Car className="w-3.5 h-3.5" />
                        {c.vehicle}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a href={`/staff/history?id=${c.id}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View History">
                          <History className="w-4 h-4" />
                        </a>
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Profile">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="More Options">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StaffLayout>
  );
}
