import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

export const inventoryReportsService = {
  getInventory: async () => {
    try {
      const response = await apiConfig.get("/reports/inventory");
      return unwrapApiResponse(response, "Failed to fetch inventory report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch inventory report");
    }
  },

  getLowStock: async (threshold) => {
    try {
      const response = await apiConfig.get("/reports/parts/low-stock", {
        params: threshold ? { threshold } : {},
      });
      return unwrapApiResponse(response, "Failed to fetch low stock report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch low stock report");
    }
  },
};

export default inventoryReportsService;
