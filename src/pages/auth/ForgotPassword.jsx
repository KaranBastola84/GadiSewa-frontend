import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AUTH_BG_IMAGE } from "../../constants";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      if (response?.isSuccess) {
        setSuccess("Check your email for the reset link.");
      } else {
        setError(response?.errorMessage?.[0] || "Request failed");
      }
    } catch (err) {
      setError(err?.errorMessage?.[0] || err?.message || "Request failed");
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
              Enter your email to receive a password reset link.
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
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1c1c1c] hover:bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          <div className="mt-6 text-center text-[12px] font-medium text-slate-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-bold underline underline-offset-2"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
