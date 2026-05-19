import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';

// Staff Pages
import StaffLayout from '../components/layout/StaffLayout';
import StaffDashboard from '../pages/staff/Dashboard';
import CustomerManagement from '../pages/staff/CustomerManagement';
import SalesPOS from '../pages/staff/SalesPOS';
import StaffReports from '../pages/staff/Reports';

// Admin Pages
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import { Vendors, Parts, Purchases, Reports as AdminReports } from '../pages/admin/AdminPages';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="parts" element={<Parts />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="pos" element={<SalesPOS />} />
        <Route path="reports" element={<StaffReports />} />
      </Route>

      {/* Default/Redirect Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
