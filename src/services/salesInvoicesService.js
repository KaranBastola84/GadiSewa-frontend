import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/sales-invoices";

export const salesInvoicesService = {
  getInvoices: async () => {
    try {
      const response = await apiConfig.get(basePath);
      return unwrapApiResponse(response, "Failed to fetch sales invoices");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch sales invoices");
    }
  },

  getInvoiceById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch sales invoice details");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch sales invoice details");
    }
  },

  createInvoice: async (invoiceData) => {
    try {
      const response = await apiConfig.post(basePath, invoiceData);
      return unwrapApiResponse(response, "Failed to create sales invoice");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create sales invoice");
    }
  },

  sendInvoiceEmail: async (id) => {
    try {
      const response = await apiConfig.post(`${basePath}/${id}/send-email`);
      return unwrapApiResponse(response, "Failed to send invoice email");
    } catch (error) {
      throw normalizeApiError(error, "Failed to send invoice email");
    }
  },
};

export default salesInvoicesService;
