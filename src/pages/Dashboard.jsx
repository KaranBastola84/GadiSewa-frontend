import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext, USER_ROLES } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Redirect based on user role
    if (user?.role === USER_ROLES.CUSTOMER) {
      navigate("/customer/dashboard");
    } else if (user?.role === USER_ROLES.STAFF) {
      navigate("/staff-dashboard");
    } else if (user?.role === USER_ROLES.ADMIN) {
      navigate("/admin-dashboard");
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default Dashboard;
