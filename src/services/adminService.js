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
  getPurchaseInvoices: (vendorId, status) => {
    let url = '/admin/purchase-invoices';
    const params = [];
    if (vendorId) params.push(`vendorId=${vendorId}`);
    if (status) params.push(`status=${status}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return apiRequest(url);
  },
  createPurchaseInvoice: (invoiceData) => apiRequest('/admin/purchase-invoices', { method: 'POST', body: JSON.stringify(invoiceData) }),
  updatePurchaseInvoice: (id, invoiceData) => apiRequest(`/admin/purchase-invoices/${id}`, { method: 'PUT', body: JSON.stringify(invoiceData) }),
  receiveStock: (id, receiveData) => apiRequest(`/admin/purchase-invoices/${id}/receive-stock`, { method: 'POST', body: JSON.stringify(receiveData) }),
  deletePurchaseInvoice: (id) => apiRequest(`/admin/purchase-invoices/${id}`, { method: 'DELETE' }),
  
  // Financial Reports
  getDailyReport: (startDate, endDate) => {
    let url = '/admin/financial-reports/daily';
    const params = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return apiRequest(url);
  },
  getMonthlyReport: (startDate, endDate) => {
    let url = '/admin/financial-reports/monthly';
    const params = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return apiRequest(url);
  },
  getYearlyReport: (startDate, endDate) => {
    let url = '/admin/financial-reports/yearly';
    const params = [];
    if (startDate) params.push(`startDate=${startDate}`);
    if (endDate) params.push(`endDate=${endDate}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return apiRequest(url);
  },
};

export default adminService;
