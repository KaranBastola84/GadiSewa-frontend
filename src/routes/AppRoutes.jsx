import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import PartsPage from "../pages/admin/PartsPage";
import VendorsPage from "../pages/admin/VendorsPage";
import UsersPage from "../pages/admin/UsersPage";
import AdminNotificationsPage from "../pages/admin/NotificationsPage";
import StaffDashboard from "../pages/staff/Dashboard";
import SearchPage from "../pages/staff/SearchPage";
import RegisterCustomer from "../pages/staff/RegisterCustomer";
import SalesPage from "../pages/staff/SalesPage";
import InvoicePage from "../pages/staff/InvoicePage";
import StaffHistoryPage from "../pages/staff/StaffHistoryPage";
import PartRequestsPage from "../pages/staff/PartRequestsPage";
import CreditPaymentsPage from "../pages/staff/CreditPaymentsPage";
import ReportsPage from "../pages/staff/ReportsPage";
import CustomerDashboard from "../pages/customer/Dashboard";
import ProfilePage from "../pages/customer/ProfilePage";
import VehiclesPage from "../pages/customer/VehiclesPage";
import AppointmentsPage from "../pages/customer/AppointmentsPage";
import HistoryPage from "../pages/customer/HistoryPage";
import RequestsPage from "../pages/customer/RequestsPage";
import ReviewsPage from "../pages/customer/ReviewsPage";
import NotificationsPage from "../pages/customer/NotificationsPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { USER_ROLES } from "../context/AuthContext";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard - Smart redirect based on role */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes - Protected */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/parts"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <PartsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/vendors"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <VendorsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <AdminNotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Staff Routes - Protected */}
      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/search"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/customers"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <RegisterCustomer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/sales"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <SalesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/invoice"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <InvoicePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/history"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <StaffHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/part-requests"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <PartRequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/credit-payments"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <CreditPaymentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/reports"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.STAFF]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes - Protected */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/profile"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/vehicles"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <VehiclesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/appointments"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <AppointmentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/history"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/requests"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <RequestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/reviews"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <ReviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/notifications"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized Page */}
      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 to-slate-800">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">403</h1>
              <p className="text-slate-300 mb-6">Unauthorized Access</p>
              <a
                href="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go to Login
              </a>
            </div>
          </div>
        }
      />

      {/* Root Route - Redirect to dashboard or login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Catch All - Redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
