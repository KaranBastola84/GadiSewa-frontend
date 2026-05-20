import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/credit-payments";

export const creditPaymentsService = {
  getCreditPayments: async () => {
    try {
      const response = await apiConfig.get(basePath);
      return unwrapApiResponse(response, "Failed to fetch credit payments");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch credit payments");
    }
  },

  recordCreditPayment: async (paymentData) => {
    try {
      const response = await apiConfig.post(basePath, paymentData);
      return unwrapApiResponse(response, "Failed to record credit payment");
    } catch (error) {
      throw normalizeApiError(error, "Failed to record credit payment");
    }
  },
};

export default creditPaymentsService;
