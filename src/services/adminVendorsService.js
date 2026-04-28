import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/admin/vendors";

export const adminVendorsService = {
  getVendors: async () => {
    try {
      const response = await apiConfig.get(basePath);
      return unwrapApiResponse(response, "Failed to fetch vendors");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch vendors");
    }
  },

  getVendorById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch vendor details");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch vendor details");
    }
  },

  createVendor: async (vendorData) => {
    try {
      const response = await apiConfig.post(basePath, vendorData);
      return unwrapApiResponse(response, "Failed to create vendor");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create vendor");
    }
  },

  updateVendor: async (id, vendorData) => {
    try {
      const response = await apiConfig.put(`${basePath}/${id}`, vendorData);
      return unwrapApiResponse(response, "Failed to update vendor");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update vendor");
    }
  },

  deleteVendor: async (id) => {
    try {
      const response = await apiConfig.delete(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to delete vendor");
    } catch (error) {
      throw normalizeApiError(error, "Failed to delete vendor");
    }
  },
};

export default adminVendorsService;
