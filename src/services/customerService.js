import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

export const customerService = {
  // Vehicles
  getVehicles: async (customerId) => {
    try {
      const response = await apiConfig.get(`/Customers/${customerId}/vehicles`);
      return unwrapApiResponse(response, "Failed to fetch vehicles");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch vehicles");
    }
  },

  addVehicle: async (customerId, vehicleData) => {
    try {
      const response = await apiConfig.post(
        `/Customers/${customerId}/vehicles`,
        vehicleData,
      );
      return unwrapApiResponse(response, "Failed to add vehicle");
    } catch (error) {
      throw normalizeApiError(error, "Failed to add vehicle");
    }
  },

  updateVehicle: async (customerId, vehicleId, vehicleData) => {
    try {
      const response = await apiConfig.put(
        `/Customers/${customerId}/vehicles/${vehicleId}`,
        vehicleData,
      );
      return unwrapApiResponse(response, "Failed to update vehicle");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update vehicle");
    }
  },

  deleteVehicle: async (customerId, vehicleId) => {
    try {
      const response = await apiConfig.delete(
        `/Customers/${customerId}/vehicles/${vehicleId}`,
      );
      return unwrapApiResponse(response, "Failed to delete vehicle");
    } catch (error) {
      throw normalizeApiError(error, "Failed to delete vehicle");
    }
  },

  // Service History
  getHistory: async () => {
    try {
      const response = await apiConfig.get("/customers/history");
      return unwrapApiResponse(response, "Failed to fetch service history");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch service history");
    }
  },

  // Credit History
  getCreditHistory: async (customerId) => {
    try {
      const response = await apiConfig.get(`/Customers/${customerId}/credit-history`);
      return unwrapApiResponse(response, "Failed to fetch credit history");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch credit history");
    }
  },

  // Sales Invoices
  getSalesInvoices: async () => {
    try {
      const response = await apiConfig.get(`/sales-invoices`);
      return unwrapApiResponse(response, "Failed to fetch sales invoices");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch sales invoices");
    }
  },

  getSalesInvoiceById: async (id) => {
    try {
      const response = await apiConfig.get(`/sales-invoices/${id}`);
      return unwrapApiResponse(response, "Failed to fetch sales invoice details");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch sales invoice details");
    }
  },
};

export default customerService;
