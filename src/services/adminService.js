import apiRequest from './api';

export const adminService = {
  // Users
  getUsers: () => apiRequest('/admin/users'),
  getUserById: (id) => apiRequest(`/admin/users/${id}`),
  createUser: (userData) => apiRequest('/admin/users', { method: 'POST', body: JSON.stringify(userData) }),
  updateUser: (id, userData) => apiRequest(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(userData) }),
  deleteUser: (id) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }),

  // Vendors
  getVendors: () => apiRequest('/admin/vendors'),
  createVendor: (vendorData) => apiRequest('/admin/vendors', { method: 'POST', body: JSON.stringify(vendorData) }),
  updateVendor: (id, vendorData) => apiRequest(`/admin/vendors/${id}`, { method: 'PUT', body: JSON.stringify(vendorData) }),
  deleteVendor: (id) => apiRequest(`/admin/vendors/${id}`, { method: 'DELETE' }),

  // Parts
  getParts: () => apiRequest('/admin/parts'),
  createPart: (partData) => apiRequest('/admin/parts', { method: 'POST', body: JSON.stringify(partData) }),
  updatePart: (id, partData) => apiRequest(`/admin/parts/${id}`, { method: 'PUT', body: JSON.stringify(partData) }),
  deletePart: (id) => apiRequest(`/admin/parts/${id}`, { method: 'DELETE' }),

  // Purchase Invoices
  getPurchaseInvoices: () => apiRequest('/admin/purchase-invoices'),
  
  // Financial Reports
  getDashboardStats: () => apiRequest('/admin/financial-reports/dashboard-stats'), // Hypothetical endpoint for dashboard
  getFinancialSummary: (startDate, endDate) => apiRequest(`/admin/financial-reports/summary?startDate=${startDate}&endDate=${endDate}`),
};

export default adminService;
