import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CustomerProvider } from './context/CustomerContext'
import Register from './pages/shared/register'
import Login from './pages/shared/login'
import CustomerDashboard from './pages/customer/Dashboard'
import ProfilePage from './pages/customer/ProfilePage'
import VehiclesPage from './pages/customer/VehiclesPage'
import AppointmentsPage from './pages/customer/AppointmentsPage'
import HistoryPage from './pages/customer/HistoryPage'
import RequestsPage from './pages/customer/RequestsPage'
import ReviewsPage from './pages/customer/ReviewsPage'
import NotificationsPage from './pages/customer/NotificationsPage'

function App() {
  return (
    <Router>
      <CustomerProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Customer Routes */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/profile" element={<ProfilePage />} />
          <Route path="/customer/vehicles" element={<VehiclesPage />} />
          <Route path="/customer/appointments" element={<AppointmentsPage />} />
          <Route path="/customer/history" element={<HistoryPage />} />
          <Route path="/customer/requests" element={<RequestsPage />} />
          <Route path="/customer/reviews" element={<ReviewsPage />} />
          <Route path="/customer/notifications" element={<NotificationsPage />} />
          
          {/* Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </CustomerProvider>
    </Router>
  )
}

export default App;
