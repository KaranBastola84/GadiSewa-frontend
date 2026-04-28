import React, { useState } from "react";

const Dashboard = () => {
  const [userName] = useState(() => localStorage.getItem("userName") || "");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl text-center">
        <h1 className="text-4xl font-black italic tracking-tighter mb-4 uppercase">
          GADISEWA<span className="text-primary-600">®</span>
        </h1>

        <div className="py-8">
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Welcome to{" "}
            <span className="text-blue-400">{userName || "User"}</span>{" "}
            Dashboard
          </h2>
          <p className="text-slate-400 text-sm">
            You are successfully logged in to the GadiSewa platform.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
