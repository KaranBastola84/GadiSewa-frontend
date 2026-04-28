import { useState } from "react";
import CustomerLayout from "../../components/CustomerLayout";
import { useCustomer } from "../../context/CustomerContext";

export default function ProfilePage() {
  const { profile, updateProfile, totalSpent } = useCustomer();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => (profile ? { ...profile } : {}));
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSave(e) {
    e.preventDefault();
    setError("");
    try {
      updateProfile(form);
      setEditing(false);
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch {
      setError("Failed to update profile");
    }
  }

  function handleCancel() {
    setForm({ ...profile });
    setEditing(false);
    setError("");
  }

  const loyaltyActive = totalSpent >= 5000;

  return (
    <CustomerLayout pageTitle="My Profile">
      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {msg}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-linear-to-r from-sky-600 to-indigo-700 rounded-2xl p-6 sm:p-8 mb-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold shadow-lg">
              {profile?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold">
                {profile?.fullName || "Customer"}
              </h2>
              <p className="text-sky-100 mt-1">{profile?.email || ""}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                <span className="px-3 py-0.5 bg-white/15 rounded-full text-xs font-medium">
                  Customer
                </span>
                <span className="px-3 py-0.5 bg-emerald-400/20 rounded-full text-xs font-medium text-emerald-200">
                  Active
                </span>
                {loyaltyActive && (
                  <span className="px-3 py-0.5 bg-amber-400/20 rounded-full text-xs font-medium text-amber-200">
                    ⭐ Loyalty
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-slate-800">
                  Personal Information
                </h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-sky-50 text-sky-600 rounded-lg text-sm font-semibold hover:bg-sky-100 transition"
                  >
                    Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSave}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    editing={editing}
                  />
                  <Field
                    label="Email Address"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    editing={editing}
                    type="email"
                  />
                  <Field
                    label="Phone Number"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    editing={editing}
                  />
                  <Field
                    label="Address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    editing={editing}
                  />
                  <Field
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    editing={editing}
                  />
                </div>

                {editing && (
                  <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-slate-800">
                Rs. {totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-slate-400 mt-1">Total Spent</p>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-slate-800">
                {loyaltyActive ? "10%" : "0%"}
              </p>
              <p className="text-sm text-slate-400 mt-1">Loyalty Discount</p>
              {!loyaltyActive && (
                <p className="text-xs text-slate-400 mt-2">
                  Spend Rs. {(5000 - totalSpent).toLocaleString()} more to
                  unlock 10% loyalty discount
                </p>
              )}
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
              <p className="text-3xl font-bold text-emerald-600">Active</p>
              <p className="text-sm text-slate-400 mt-1">Account Status</p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

function Field({ label, name, value, onChange, editing, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1">
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition text-sm text-slate-800"
        />
      ) : (
        <p className="px-3 py-2.5 bg-slate-50 rounded-lg text-slate-700 text-sm">
          {value || "—"}
        </p>
      )}
    </div>
  );
}
