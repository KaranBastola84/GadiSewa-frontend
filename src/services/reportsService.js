import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/reports/customers";

export const reportsService = {
  getTopSpenders: async (limit = 10) => {
    try {
      const response = await apiConfig.get(`${basePath}/top-spenders`, {
        params: { limit },
      });
      return unwrapApiResponse(response, "Failed to fetch top spenders report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch top spenders report");
    }
  },

  getRegularCustomers: async (minPurchases = 5) => {
    try {
      const response = await apiConfig.get(`${basePath}/regulars`, {
        params: { minPurchases },
      });
      return unwrapApiResponse(response, "Failed to fetch regular customers report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch regular customers report");
    }
  },

  getPendingCredits: async () => {
    try {
      const response = await apiConfig.get(`${basePath}/pending-credits`);
      return unwrapApiResponse(response, "Failed to fetch pending credits report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch pending credits report");
    }
  },
};

export default reportsService;
