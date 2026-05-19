import { useState } from "react";
import { Link } from "react-router-dom";
import StaffLayout from "../../components/StaffLayout";
import staffCustomersService from "../../services/staffCustomersService";
import { Search, User, Car, Phone, Mail, ArrowRight, ShieldAlert } from "lucide-react";

export default function CustomerSearchPage() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("general"); // general, vehicle, phone
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);
      let res;

      if (searchType === "general") {
        res = await staffCustomersService.searchCustomers({ q: query.trim() });
      } else if (searchType === "vehicle") {
        res = await staffCustomersService.getCustomerByVehicle(query.trim());
      } else if (searchType === "phone") {
        res = await staffCustomersService.getCustomerByPhone(query.trim());
      }

      const rawResults = Array.isArray(res) ? res : res?.result || res?.customers || [];
      setResults(rawResults);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong during search.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StaffLayout pageTitle="Customer Search" subtitle="Search by name, contact info, or vehicle registration">
      <div className="space-y-6">
        {/* Search Panel Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Type Filters */}
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setSearchType("general");
                  setQuery("");
                  setHasSearched(false);
                  setResults([]);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition ${
                  searchType === "general"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <User size={14} /> General Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchType("vehicle");
                  setQuery("");
                  setHasSearched(false);
                  setResults([]);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition ${
                  searchType === "vehicle"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Car size={14} /> Vehicle Registration
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchType("phone");
                  setQuery("");
                  setHasSearched(false);
                  setResults([]);
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition ${
                  searchType === "phone"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Phone size={14} /> Phone Number
              </button>
            </div>

            {/* Input Bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    searchType === "general"
                      ? "Search by Name, Email, Phone, or Customer ID..."
                      : searchType === "vehicle"
                      ? "Enter Vehicle plate number (e.g. BA-2-PA-8822)..."
                      : "Enter exact Customer Phone number..."
                  }
                  className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-sm font-semibold transition cursor-pointer shadow-xs"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center gap-2">
            <ShieldAlert size={16} />
            {error}
          </div>
        )}

        {/* Search Results Board */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-900" />
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
            No customer accounts found matching your query. Verify the values and try again.
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.24em] text-slate-400 font-semibold mb-1">
              Results Found ({results.length})
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {results.map((c) => (
                <div
                  key={c.customerId || c.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition shadow-xs"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-extrabold text-slate-950 text-base">
                          {c.firstName} {c.lastName}
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {c.customerId || c.id}</p>
                      </div>
                      <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {c.loyaltyPoints || 0} pts
                      </span>
                    </div>

                    {/* Contacts */}
                    <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-slate-400" />
                        <span>{c.phoneNumber}</span>
                      </div>
                    </div>

                    {/* Vehicles Info */}
                    {c.vehicles && c.vehicles.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2">
                          Registered Vehicles
                        </p>
                        <div className="space-y-1.5">
                          {c.vehicles.map((v, idx) => (
                            <div key={v.vehicleId || idx} className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700">
                                {v.make} {v.model}
                              </span>
                              <span className="font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm">
                                {v.registrationNumber}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2 justify-end">
                    <Link
                      to={`/staff/customers/${c.customerId || c.id}/full-profile`}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition shadow-xs"
                    >
                      View Profile <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </StaffLayout>
  );
}
