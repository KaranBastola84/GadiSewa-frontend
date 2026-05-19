import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AUTH_BG_IMAGE } from "../../constants";
import authService from "../../services/authService";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get("token") || "";

  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [tokenValue, setTokenValue] = useState(tokenFromQuery);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const autoVerifyRef = useRef(false);

  const runVerify = async (tokenToVerify) => {
    if (!tokenToVerify) {
      setStatus("error");
      setMessage("Verification token is required");
      return;
    }

    setStatus("loading");
    setMessage("");
    setVerifyLoading(true);
    try {
      const response = await authService.verifyEmail(tokenToVerify);
      if (response?.isSuccess) {
        setStatus("success");
        setMessage("Email verified successfully. You can now log in.");
      } else {
        setStatus("error");
        setMessage(response?.errorMessage?.[0] || "Verification failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err?.errorMessage?.[0] || err?.message || "Verification failed",
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  useEffect(() => {
    if (!tokenFromQuery || autoVerifyRef.current) return;
    autoVerifyRef.current = true;
    runVerify(tokenFromQuery);
  }, [tokenFromQuery]);

  const handleVerify = async (e) => {
    e.preventDefault();
    runVerify(tokenValue.trim());
  };

  const handleResend = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setStatus("error");
      setMessage("Email is required to resend verification");
      return;
    }

    setResendLoading(true);
    try {
      const response = await authService.resendVerification(email);
      if (response?.isSuccess) {
        setStatus("success");
        setMessage("Verification email resent. Please check your inbox.");
      } else {
        setStatus("error");
        setMessage(response?.errorMessage?.[0] || "Resend failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err?.errorMessage?.[0] || err?.message || "Resend failed");
    } finally {
      setResendLoading(false);
    }
  };

  const bannerClass =
    status === "success"
      ? "bg-green-50 border-green-100 text-green-600"
      : status === "error"
        ? "bg-red-50 border-red-100 text-red-500"
        : "bg-slate-50 border-slate-100 text-slate-500";

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

      <div className="relative z-10 w-full max-w-160 bg-white rounded-4xl overflow-hidden shadow-2xl">
        <div className="p-8 md:p-10">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
              GADISEWA<span className="text-primary-600">®</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Verify your email to activate your account.
            </p>
          </div>

          {message && (
            <div
              className={`w-full p-3 mb-5 border rounded-lg text-xs text-center ${bannerClass}`}
            >
              {message}
            </div>
          )}

          {!tokenFromQuery && (
            <div className="w-full p-3 mb-5 border border-amber-100 bg-amber-50 rounded-lg text-amber-600 text-xs text-center">
              Verification token is missing from the link. Paste it below or use
              the link from your email.
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-4">
            <h2 className="text-sm font-bold text-slate-700 mb-2">
              Verify with token
            </h2>
            <form onSubmit={handleVerify} className="space-y-3">
              <input
                type="text"
                value={tokenValue}
                onChange={(e) => setTokenValue(e.target.value)}
                placeholder="Paste verification token"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
              />
              <button
                type="submit"
                disabled={verifyLoading}
                className="w-full bg-[#1c1c1c] hover:bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60"
              >
                {verifyLoading ? "Verifying..." : "Verify email"}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-slate-700 mb-2">
              Resend verification email
            </h2>
            <form onSubmit={handleResend} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
              />
              <button
                type="submit"
                disabled={resendLoading}
                className="w-full bg-[#1c1c1c] hover:bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60"
              >
                {resendLoading ? "Sending..." : "Resend email"}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center text-[12px] font-medium text-slate-400">
            Ready to sign in?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-bold underline underline-offset-2"
            >
              Go to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
