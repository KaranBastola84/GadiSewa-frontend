import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/admin/purchase-invoices";

export const adminPurchaseInvoicesService = {
  getInvoices: async (params = {}) => {
    try {
      const response = await apiConfig.get(basePath, { params });
      return unwrapApiResponse(response, "Failed to fetch purchase invoices");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch purchase invoices");
    }
  },

  getInvoiceById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch invoice details");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch invoice details");
    }
  },

  createInvoice: async (invoiceData) => {
    try {
      const response = await apiConfig.post(basePath, invoiceData);
      return unwrapApiResponse(response, "Failed to create purchase invoice");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create purchase invoice");
    }
  },

  receiveStock: async (id, items = []) => {
    try {
      const response = await apiConfig.post(`${basePath}/${id}/receive-stock`, {
        items,
      });
      return unwrapApiResponse(response, "Failed to receive stock");
    } catch (error) {
      throw normalizeApiError(error, "Failed to receive stock");
    }
  },
};

export default adminPurchaseInvoicesService;
