import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/Staff";

export const adminStaffService = {
  getStaff: async () => {
    try {
      const response = await apiConfig.get(basePath);
      return unwrapApiResponse(response, "Failed to fetch staff");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch staff");
    }
  },

  updateStaff: async (id, staffData) => {
    try {
      const response = await apiConfig.put(`${basePath}/${id}`, staffData);
      return unwrapApiResponse(response, "Failed to update staff");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update staff");
    }
  },

  deleteStaff: async (id) => {
    try {
      const response = await apiConfig.delete(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to deactivate staff");
    } catch (error) {
      throw normalizeApiError(error, "Failed to deactivate staff");
    }
  },
};

export default adminStaffService;
