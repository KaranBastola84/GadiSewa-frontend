import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "", agree: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Required";
    if (!formData.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.phone.trim()) errs.phone = "Required";
    if (!formData.password) errs.password = "Required";
    else if (formData.password.length < 6) errs.password = "Min 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords don't match";
    if (!formData.agree) errs.agree = "You must agree";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // save profile to localStorage
      const profile = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: "",
        city: "",
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("gs_profile", JSON.stringify(profile));
      localStorage.setItem("isLoggedIn", "true");
      navigate("/customer/dashboard");
    } catch {
      setErrors({ submit: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm ${
      errors[field] ? "border-red-500/50" : "border-white/10"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          <div className="hidden lg:flex flex-col justify-center p-10 bg-gradient-to-br from-cyan-600/20 to-blue-700/20 border-r border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 mb-6">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Join GadiSewa</h2>
            <p className="mt-4 text-slate-300">
              Register to manage vehicles, book service appointments, and track purchases.
            </p>
            <div className="mt-8 space-y-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Quick Setup</p>
                <p className="text-xl font-bold text-white mt-1">30 seconds</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Security</p>
                <p className="text-xl font-bold text-white mt-1">End-to-end encrypted</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-white">Create Account</h1>
              <p className="text-sm text-slate-400 mt-1">Fill in your details to get started</p>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{errors.submit}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                  placeholder="Your name" className={inputClass("fullName")} />
                {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="you@example.com" className={inputClass("email")} />
                  {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="+977 98XXXXXXXX" className={inputClass("phone")} />
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    placeholder="Min 6 characters" className={inputClass("password")} />
                  {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    placeholder="Re-enter" className={inputClass("confirmPassword")} />
                  {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <label className={`flex items-start gap-2 text-sm ${errors.agree ? "text-red-400" : "text-slate-400"}`}>
                <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded bg-white/10 border-white/20 text-cyan-500" />
                <span>I agree to the <a href="#" className="text-cyan-400">terms</a></span>
              </label>

              <button type="submit" disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition shadow-lg shadow-cyan-500/25 text-sm">
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-400 mt-5">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}