import { useState } from "react";
import CustomerLayout from "../../components/CustomerLayout";
import { useCustomer } from "../../context/CustomerContext";

const serviceTypes = [
  "Oil Change", "Brake Inspection", "Brake Pad Replacement", "Tire Rotation",
  "Wheel Alignment", "Engine Tune-Up", "Battery Replacement", "AC Service",
  "Full Vehicle Service", "Transmission Service", "Other",
];

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

export default function AppointmentsPage() {
  const { vehicles, appointments, bookAppointment, cancelAppointment } = useCustomer();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ vehicleId: "", serviceType: "", date: "", time: "", notes: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  }

  function validate() {
    const errs = {};
    if (!form.vehicleId) errs.vehicleId = "Select a vehicle";
    if (!form.serviceType) errs.serviceType = "Select a service";
    if (!form.date) errs.date = "Pick a date";
    if (!form.time) errs.time = "Pick a time";
    if (form.date && new Date(form.date) < new Date(new Date().toDateString())) {
      errs.date = "Cannot be in the past";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const vehicle = vehicles.find((v) => v.id === parseInt(form.vehicleId));
      const vehicleName = vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})` : "";

      await bookAppointment({
        vehicleId: parseInt(form.vehicleId),
        vehicleName,
        serviceType: form.serviceType,
        date: form.date,
        time: form.time,
        notes: form.notes,
      });

      setMsg("Appointment booked!");
      setForm({ vehicleId: "", serviceType: "", date: "", time: "", notes: "" });
      setShowForm(false);
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  }

  async function handleCancel(id) {
    try {
      await cancelAppointment(id);
      setMsg("Appointment cancelled.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  }

  // apply filter
  const today = new Date(new Date().toDateString());
  const filtered = appointments
    .filter((a) => {
      if (filter === "upcoming") return a.status !== "Cancelled" && new Date(a.date) >= today;
      if (filter === "past") return new Date(a.date) < today;
      if (filter === "cancelled") return a.status === "Cancelled";
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <CustomerLayout pageTitle="Appointments">
      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{msg}</div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">Book and manage service appointments</p>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition">
            + Book Appointment
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <h3 className="font-bold text-slate-800 mb-4">Book Appointment</h3>
          {errors.submit && <p className="text-sm text-red-600 mb-3">{errors.submit}</p>}
          {vehicles.length === 0 ? (
            <p className="text-sm text-slate-500 py-4">
              Please <a href="/customer/vehicles" className="text-sky-600 font-semibold">add a vehicle</a> first.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Vehicle *</label>
                  <select name="vehicleId" value={form.vehicleId} onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${errors.vehicleId ? "border-red-400" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-sky-500`}>
                    <option value="">Select vehicle</option>
                    {vehicles.map((v) => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.plateNumber})</option>)}
                  </select>
                  {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Service Type *</label>
                  <select name="serviceType" value={form.serviceType} onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${errors.serviceType ? "border-red-400" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-sky-500`}>
                    <option value="">Select service</option>
                    {serviceTypes.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  {errors.serviceType && <p className="text-xs text-red-500 mt-1">{errors.serviceType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Date *</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.date ? "border-red-400" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-sky-500`} />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Time *</label>
                  <select name="time" value={form.time} onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${errors.time ? "border-red-400" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-sky-500`}>
                    <option value="">Select time</option>
                    {timeSlots.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-600 mb-1">Notes</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={2}
                    placeholder="Describe the issue..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
              </div>
              <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition">Book</button>
                <button type="button" onClick={() => { setShowForm(false); setErrors({}); }}
                  className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["all", "upcoming", "past", "cancelled"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${
              filter === f ? "bg-sky-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">No appointments found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="text-center w-14 flex-shrink-0">
                <p className="text-xs text-sky-600 font-semibold">{new Date(apt.date).toLocaleDateString("en", { month: "short" })}</p>
                <p className="text-xl font-bold text-sky-700">{new Date(apt.date).getDate()}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800">{apt.serviceType}</p>
                <p className="text-sm text-slate-400">{apt.vehicleName} • {apt.time}</p>
                {apt.notes && <p className="text-xs text-slate-400 mt-1">{apt.notes}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  apt.status === "Confirmed" ? "bg-green-50 text-green-700" :
                  apt.status === "Cancelled" ? "bg-red-50 text-red-700" :
                  "bg-amber-50 text-amber-700"
                }`}>{apt.status}</span>
                {apt.status !== "Cancelled" && apt.status !== "Completed" && new Date(apt.date) >= today && (
                  <button onClick={() => handleCancel(apt.id)}
                    className="px-3 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100 transition">Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}
