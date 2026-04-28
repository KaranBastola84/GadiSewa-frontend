import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext, USER_ROLES } from "../context/AuthContext";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === USER_ROLES.CUSTOMER) {
    return <Navigate to="/customer/dashboard" replace />;
  }

  if (user?.role === USER_ROLES.STAFF) {
    return <Navigate to="/staff-dashboard" replace />;
  }

  if (user?.role === USER_ROLES.ADMIN) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default Dashboard;
