import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/admin/parts";

export const adminPartsService = {
  getParts: async () => {
    try {
      const response = await apiConfig.get(basePath);
      return unwrapApiResponse(response, "Failed to fetch parts");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch parts");
    }
  },

  getPartById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch part details");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch part details");
    }
  },

  createPart: async (partData) => {
    try {
      const response = await apiConfig.post(basePath, partData);
      return unwrapApiResponse(response, "Failed to create part");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create part");
    }
  },

  updatePart: async (id, partData) => {
    try {
      const response = await apiConfig.put(`${basePath}/${id}`, partData);
      return unwrapApiResponse(response, "Failed to update part");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update part");
    }
  },

  deletePart: async (id) => {
    try {
      const response = await apiConfig.delete(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to delete part");
    } catch (error) {
      throw normalizeApiError(error, "Failed to delete part");
    }
  },
};

export default adminPartsService;
