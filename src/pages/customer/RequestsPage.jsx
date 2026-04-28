import { useState } from "react";
import CustomerLayout from "../../components/CustomerLayout";
import { useCustomer } from "../../context/CustomerContext";

export default function RequestsPage() {
  const { requests, submitRequest, vehicles } = useCustomer();
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ partName: "", brand: "", vehicleModel: "", urgency: "Medium", notes: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const errs = {};
    if (!form.partName.trim()) errs.partName = "Required";
    if (!form.vehicleModel.trim()) errs.vehicleModel = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitRequest(form);
      setForm({ partName: "", brand: "", vehicleModel: "", urgency: "Medium", notes: "" });
      setShowForm(false);
      setMsg("Request submitted!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  }

  function statusBadge(status) {
    const map = {
      Processing: "bg-blue-50 text-blue-700",
      Pending: "bg-amber-50 text-amber-700",
      Available: "bg-green-50 text-green-700",
      Cancelled: "bg-red-50 text-red-700",
    };
    return map[status] || "bg-slate-50 text-slate-700";
  }

  return (
    <CustomerLayout pageTitle="Part Requests">
      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{msg}</div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">Request parts that are currently unavailable</p>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition">
            + New Request
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <h3 className="font-bold text-slate-800 mb-4">Request a Part</h3>
          {errors.submit && <p className="text-sm text-red-600 mb-3">{errors.submit}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Part Name *</label>
                <input type="text" name="partName" value={form.partName} onChange={handleChange}
                  placeholder="e.g. Turbocharger"
                  className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.partName ? "border-red-400" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-sky-500`} />
                {errors.partName && <p className="text-xs text-red-500 mt-1">{errors.partName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Brand</label>
                <input type="text" name="brand" value={form.brand} onChange={handleChange}
                  placeholder="e.g. Garrett, OEM"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle *</label>
                {vehicles.length > 0 ? (
                  <select name="vehicleModel" value={form.vehicleModel} onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${errors.vehicleModel ? "border-red-400" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-sky-500`}>
                    <option value="">Select vehicle</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={`${v.make} ${v.model} ${v.year}`}>
                        {v.make} {v.model} {v.year}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input type="text" name="vehicleModel" value={form.vehicleModel} onChange={handleChange}
                    placeholder="e.g. Toyota Hilux 2021"
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.vehicleModel ? "border-red-400" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-sky-500`} />
                )}
                {errors.vehicleModel && <p className="text-xs text-red-500 mt-1">{errors.vehicleModel}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Urgency</label>
                <select name="urgency" value={form.urgency} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                  placeholder="Any specifics..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
              <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition">Submit</button>
              <button type="button" onClick={() => { setShowForm(false); setErrors({}); }}
                className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">No part requests yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-slate-800">{req.partName}</h4>
                <div className="flex gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    req.urgency === "Urgent" ? "bg-red-50 text-red-600" :
                    req.urgency === "High" ? "bg-orange-50 text-orange-600" :
                    "bg-slate-50 text-slate-500"
                  }`}>{req.urgency}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusBadge(req.status)}`}>{req.status}</span>
                </div>
              </div>
              <p className="text-sm text-slate-500">{req.vehicleModel} {req.brand && `• ${req.brand}`}</p>
              {req.notes && <p className="text-sm text-slate-400 mt-1">{req.notes}</p>}
              <p className="text-xs text-slate-400 mt-2">Requested: {req.requestedDate}</p>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}
