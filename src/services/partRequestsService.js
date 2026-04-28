import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/part-requests";

export const partRequestsService = {
  getRequests: async () => {
    try {
      const response = await apiConfig.get(basePath);
      return unwrapApiResponse(response, "Failed to fetch part requests");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch part requests");
    }
  },

  getRequestById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch part request");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch part request");
    }
  },

  createRequest: async (requestData) => {
    try {
      const response = await apiConfig.post(basePath, requestData);
      return unwrapApiResponse(response, "Failed to create part request");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create part request");
    }
  },

  updateRequest: async (id, requestData) => {
    try {
      const response = await apiConfig.put(`${basePath}/${id}`, requestData);
      return unwrapApiResponse(response, "Failed to update part request");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update part request");
    }
  },

  deleteRequest: async (id) => {
    try {
      const response = await apiConfig.delete(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to delete part request");
    } catch (error) {
      throw normalizeApiError(error, "Failed to delete part request");
    }
  },

  updateRequestStatus: async (id, statusData) => {
    try {
      const response = await apiConfig.put(
        `${basePath}/${id}/status`,
        statusData,
      );
      return unwrapApiResponse(response, "Failed to update request status");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update request status");
    }
  },
};

export default partRequestsService;
