import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", rememberMe: false });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const errs = {};
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Invalid email";
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Min 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // store login state
      const profile = JSON.parse(localStorage.getItem("gs_profile") || "null");
      if (!profile) {
        setErrors({ submit: "No account found. Please register first." });
        setLoading(false);
        return;
      }
      if (profile.email !== formData.email) {
        setErrors({ submit: "Email not found. Please check or register." });
        setLoading(false);
        return;
      }
      localStorage.setItem("isLoggedIn", "true");
      navigate("/customer/dashboard");
    } catch {
      setErrors({ submit: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 mb-4">
              <span className="text-white font-bold text-2xl">G</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400 mt-1 text-sm">Sign in to GadiSewa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm ${
                  errors.email ? "border-red-500/50" : "border-white/10"
                }`} />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition text-sm ${
                  errors.password ? "border-red-500/50" : "border-white/10"
                }`} />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-cyan-500" />
                <span className="text-sm text-slate-400">Remember me</span>
              </label>
            </div>

            {errors.submit && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{errors.submit}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl transition shadow-lg shadow-cyan-500/25 text-sm">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
