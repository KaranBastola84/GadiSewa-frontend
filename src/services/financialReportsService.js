import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/admin/financial-reports";

export const financialReportsService = {
  getDaily: async (startDate, endDate) => {
    try {
      const response = await apiConfig.get(`${basePath}/daily`, {
        params: {
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
        },
      });
      return unwrapApiResponse(response, "Failed to fetch daily report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch daily report");
    }
  },

  getMonthly: async (startDate, endDate) => {
    try {
      const response = await apiConfig.get(`${basePath}/monthly`, {
        params: {
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
        },
      });
      return unwrapApiResponse(response, "Failed to fetch monthly report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch monthly report");
    }
  },

  getYearly: async (startDate, endDate) => {
    try {
      const response = await apiConfig.get(`${basePath}/yearly`, {
        params: {
          ...(startDate ? { startDate } : {}),
          ...(endDate ? { endDate } : {}),
        },
      });
      return unwrapApiResponse(response, "Failed to fetch yearly report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch yearly report");
    }
  },

  getCustomRange: async (from, to, type) => {
    try {
      const response = await apiConfig.get("/reports/financial", {
        params: {
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
          ...(type ? { type } : {}),
        },
      });
      return unwrapApiResponse(response, "Failed to fetch custom report");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch custom report");
    }
  },
};

export default financialReportsService;
