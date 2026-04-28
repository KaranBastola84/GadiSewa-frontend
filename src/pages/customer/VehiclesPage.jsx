import { useState } from "react";
import CustomerLayout from "../../components/CustomerLayout";
import { useCustomer } from "../../context/CustomerContext";

const emptyVehicle = {
  make: "", model: "", year: "", plateNumber: "",
  vin: "", color: "", fuelType: "Petrol", mileage: "",
};

export default function VehiclesPage() {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useCustomer();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyVehicle });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  }

  function validate() {
    const errs = {};
    if (!form.make.trim()) errs.make = "Required";
    if (!form.model.trim()) errs.model = "Required";
    if (!form.year) errs.year = "Required";
    if (!form.plateNumber.trim()) errs.plateNumber = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        ...form,
        year: parseInt(form.year),
        mileage: parseInt(form.mileage) || 0,
      };

      if (editId) {
        await updateVehicle(editId, payload);
        setMsg("Vehicle updated!");
      } else {
        await addVehicle(payload);
        setMsg("Vehicle added!");
      }

      resetForm();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  }

  function startEdit(v) {
    setForm({
      make: v.make, model: v.model, year: String(v.year),
      plateNumber: v.plateNumber, vin: v.vin || "",
      color: v.color || "", fuelType: v.fuelType || "Petrol",
      mileage: String(v.mileage || ""),
    });
    setEditId(v.id);
    setShowForm(true);
    setErrors({});
  }

  async function handleDelete(id) {
    try {
      await deleteVehicle(id);
      setDeleteConfirm(null);
      setMsg("Vehicle removed!");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(err.message);
    }
  }

  function resetForm() {
    setForm({ ...emptyVehicle });
    setShowForm(false);
    setEditId(null);
    setErrors({});
  }

  return (
    <CustomerLayout pageTitle="My Vehicles">
      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">Manage your registered vehicles</p>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ ...emptyVehicle }); }}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition">
            + Add Vehicle
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <h3 className="font-bold text-slate-800 mb-4">{editId ? "Edit Vehicle" : "Add Vehicle"}</h3>
          {errors.submit && <p className="text-sm text-red-600 mb-3">{errors.submit}</p>}
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input label="Make" name="make" value={form.make} onChange={handleChange} error={errors.make} placeholder="e.g. Toyota" required />
              <Input label="Model" name="model" value={form.model} onChange={handleChange} error={errors.model} placeholder="e.g. Hilux" required />
              <Input label="Year" name="year" value={form.year} onChange={handleChange} error={errors.year} placeholder="e.g. 2021" type="number" required />
              <Input label="Plate Number" name="plateNumber" value={form.plateNumber} onChange={handleChange} error={errors.plateNumber} placeholder="e.g. BA 1 JA 2045" required />
              <Input label="VIN" name="vin" value={form.vin} onChange={handleChange} placeholder="Optional" />
              <Input label="Color" name="color" value={form.color} onChange={handleChange} placeholder="e.g. White" />
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Fuel Type</label>
                <select name="fuelType" value={form.fuelType} onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
                </select>
              </div>
              <Input label="Mileage (km)" name="mileage" value={form.mileage} onChange={handleChange} placeholder="e.g. 45000" type="number" />
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
              <button type="submit" className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition">
                {editId ? "Update" : "Add Vehicle"}
              </button>
              <button type="button" onClick={resetForm} className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">No vehicles registered yet. Add your first vehicle above.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow transition group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-800">{v.make} {v.model}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => startEdit(v)} className="p-1 text-slate-400 hover:text-sky-600" title="Edit">✏️</button>
                  <button onClick={() => setDeleteConfirm(v.id)} className="p-1 text-slate-400 hover:text-red-600" title="Delete">🗑️</button>
                </div>
              </div>
              <p className="text-sm text-slate-500 mb-2">{v.year} • {v.color || "N/A"}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Plate</span>
                  <span className="font-medium text-slate-700">{v.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fuel</span>
                  <span className="text-slate-600">{v.fuelType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mileage</span>
                  <span className="text-slate-600">{v.mileage?.toLocaleString() || 0} km</span>
                </div>
              </div>

              {deleteConfirm === v.id && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-700 mb-2">Remove this vehicle?</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(v.id)} className="px-3 py-1 bg-red-600 text-white text-xs rounded font-semibold">Yes</button>
                    <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-white border border-slate-200 text-xs rounded font-semibold">No</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}

function Input({ label, name, value, onChange, error, placeholder, type = "text", required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 transition ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
