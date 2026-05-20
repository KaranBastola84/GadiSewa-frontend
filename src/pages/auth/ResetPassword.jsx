import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AUTH_BG_IMAGE } from "../../constants";
import authService from "../../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Missing reset token. Please request a new link.");
      return;
    }

    if (!form.newPassword) {
      setError("New password is required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.resetPassword(token, form.newPassword);
      if (response?.isSuccess) {
        setSuccess("Password reset successful. You can now log in.");
        setForm({ newPassword: "", confirmPassword: "" });
      } else {
        setError(response?.errorMessage?.[0] || "Password reset failed");
      }
    } catch (err) {
      setError(
        err?.errorMessage?.[0] || err?.message || "Password reset failed",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 lg:p-12">
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backgroundImage: `url("${AUTH_BG_IMAGE}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.4)",
          transform: "scale(1.1)",
        }}
      />

      <div className="relative z-10 w-full max-w-140 bg-white rounded-4xl overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
              GADISEWA<span className="text-primary-600">®</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Set a new password for your account.
            </p>
          </div>

          {error && (
            <div className="w-full p-3 mb-4 bg-red-50 border border-red-100 rounded-lg text-red-500 text-xs text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="w-full p-3 mb-4 bg-green-50 border border-green-100 rounded-lg text-green-600 text-xs text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                New password
              </label>
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Confirm password
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1c1c1c] hover:bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60"
            >
              {isLoading ? "Updating..." : "Reset password"}
            </button>
          </form>

          <div className="mt-6 text-center text-[12px] font-medium text-slate-400">
            Go back to{" "}
            <Link
              to="/login"
              className="text-slate-900 font-bold underline underline-offset-2"
            >
              login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
