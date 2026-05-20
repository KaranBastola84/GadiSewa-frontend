import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/admin/notifications";

export const adminNotificationsService = {
  getNotifications: async (params = {}) => {
    try {
      const response = await apiConfig.get(basePath, { params });
      return unwrapApiResponse(response, "Failed to fetch admin notifications");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch admin notifications");
    }
  },

  getNotificationById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch notification details");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch notification details");
    }
  },
};

export default adminNotificationsService;
