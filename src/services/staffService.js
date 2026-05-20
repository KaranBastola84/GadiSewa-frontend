import apiConfig from '../config/apiConfig';

// Attach token to every request
apiConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Customers ─────────────────────────────────────────────
export const registerCustomer = async (data) => {
  const res = await apiConfig.post('/staff/customers', data);
  return res.data;
};

export const addVehicleToCustomer = async (customerId, data) => {
  const res = await apiConfig.post(`/Customers/${customerId}/vehicles`, data);
  return res.data;
};

export const searchCustomers = async (q) => {
  const res = await apiConfig.get('/staff/customers/search', { params: { q } });
  return res.data;
};

export const searchByVehicle = async (reg) => {
  const res = await apiConfig.get(`/staff/customers/by-vehicle/${encodeURIComponent(reg)}`);
  return res.data;
};

export const searchByPhone = async (phone) => {
  const res = await apiConfig.get(`/staff/customers/by-phone/${encodeURIComponent(phone)}`);
  return res.data;
};

export const getCustomerFullProfile = async (id) => {
  const res = await apiConfig.get(`/staff/customers/${id}/full-profile`);
  return res.data;
};

export const getCustomerHistory = async (id) => {
  const res = await apiConfig.get(`/staff/customers/${id}/history`);
  return res.data;
};

export const updateCustomer = async (id, data) => {
  const res = await apiConfig.put(`/Customers/${id}`, data);
  return res.data;
};

// ── Sales Invoices ────────────────────────────────────────
export const getSalesInvoices = async () => {
  const res = await apiConfig.get('/sales-invoices');
  return res.data;
};

export const createSalesInvoice = async (data) => {
  const res = await apiConfig.post('/sales-invoices', data);
  return res.data;
};

export const getSalesInvoiceById = async (id) => {
  const res = await apiConfig.get(`/sales-invoices/${id}`);
  return res.data;
};

export const sendInvoiceEmail = async (id) => {
  const res = await apiConfig.post(`/sales-invoices/${id}/send-email`);
  return res.data;
};

// ── Appointments ──────────────────────────────────────────
export const getAppointments = async () => {
  const res = await apiConfig.get('/Appointments');
  return res.data;
};

export const updateAppointmentStatus = async (id, status) => {
  const res = await apiConfig.put(`/Appointments/staff/${id}/status`, { status });
  return res.data;
};

// ── Reports ───────────────────────────────────────────────
export const getTopSpenders = async () => {
  const res = await apiConfig.get('/reports/customers/top-spenders');
  return res.data;
};

export const getRegularCustomers = async () => {
  const res = await apiConfig.get('/reports/customers/regulars');
  return res.data;
};

export const getPendingCredits = async () => {
  const res = await apiConfig.get('/reports/customers/pending-credits');
  return res.data;
};

// ── Part Requests ─────────────────────────────────────────
export const getPartRequests = async () => {
  const res = await apiConfig.get('/part-requests');
  return res.data;
};

export const updatePartRequestStatus = async (id, status) => {
  const res = await apiConfig.put(`/part-requests/${id}/status`, { status });
  return res.data;
};

// ── Credit Payments ───────────────────────────────────────
export const getCreditPayments = async () => {
  const res = await apiConfig.get('/credit-payments');
  return res.data;
};

export const recordCreditPayment = async (data) => {
  const res = await apiConfig.post('/credit-payments', data);
  return res.data;
};

// ── Parts (for invoice creation) ─────────────────────────
export const getParts = async () => {
  const res = await apiConfig.get('/admin/parts');
  return res.data;
};
