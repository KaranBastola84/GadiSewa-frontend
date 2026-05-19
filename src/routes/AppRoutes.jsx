import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";
import PartsPage from "../pages/admin/PartsPage";
import VendorsPage from "../pages/admin/VendorsPage";
import UsersPage from "../pages/admin/UsersPage";
import PurchaseInvoicesPage from "../pages/admin/PurchaseInvoicesPage";
import FinancialReportsPage from "../pages/admin/FinancialReportsPage";
import InventoryReportsPage from "../pages/admin/InventoryReportsPage";
import CustomerDashboard from "../pages/customer/Dashboard";
import ProfilePage from "../pages/customer/ProfilePage";
import VehiclesPage from "../pages/customer/VehiclesPage";
import AppointmentsPage from "../pages/customer/AppointmentsPage";
import HistoryPage from "../pages/customer/HistoryPage";
import RequestsPage from "../pages/customer/RequestsPage";
import ReviewsPage from "../pages/customer/ReviewsPage";
import NotificationsPage from "../pages/customer/NotificationsPage";
import InvoiceDetailPage from "../pages/customer/InvoiceDetailPage";
import ProtectedRoute from "../components/ProtectedRoute";
import { USER_ROLES } from "../context/AuthContext";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

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
        path="/admin/purchase-invoices"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <PurchaseInvoicesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports/financial"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <FinancialReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports/inventory"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
            <InventoryReportsPage />
          </ProtectedRoute>
        }
      />

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
        path="/customer/invoice/:id"
        element={
          <ProtectedRoute requiredRoles={[USER_ROLES.CUSTOMER]}>
            <InvoiceDetailPage />
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
