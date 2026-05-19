import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/Dashboard';

// Staff Layout & Pages
import StaffLayout from '../components/layout/StaffLayout';
import StaffDashboard from '../pages/staff/Dashboard';
import RegisterCustomer from '../pages/staff/RegisterCustomer';
import CustomerSearch from '../pages/staff/CustomerSearch';
import CustomerProfile from '../pages/staff/CustomerProfile';
import InvoiceList from '../pages/staff/InvoiceList';
import CreateInvoice from '../pages/staff/CreateInvoice';
import InvoiceDetail from '../pages/staff/InvoiceDetail';
import Appointments from '../pages/staff/Appointments';
import StaffReports from '../pages/staff/Reports';
import PartRequests from '../pages/staff/PartRequests';
import CreditPayments from '../pages/staff/CreditPayments';

// Admin Layout & Pages
import AdminLayout from '../components/layout/AdminLayout';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import { Vendors, Parts, Purchases, Reports as AdminReports } from '../pages/admin/AdminPages';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="parts" element={<Parts />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      {/* Staff */}
      <Route path="/staff" element={<StaffLayout />}>
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />

        {/* Customers */}
        <Route path="customers/register" element={<RegisterCustomer />} />
        <Route path="customers/search" element={<CustomerSearch />} />
        <Route path="customers/:id" element={<CustomerProfile />} />

        {/* Invoices */}
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/create" element={<CreateInvoice />} />
        <Route path="invoices/:id" element={<InvoiceDetail />} />

        {/* Appointments */}
        <Route path="appointments" element={<Appointments />} />

        {/* Reports */}
        <Route path="reports" element={<StaffReports />} />

        {/* S19-S20: Part Requests */}
        <Route path="part-requests" element={<PartRequests />} />

        {/* S21-S22: Credit Payments */}
        <Route path="credit-payments" element={<CreditPayments />} />
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
