import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/reviews";

export const reviewsService = {
  getReviews: async () => {
    try {
      const response = await apiConfig.get(basePath);
      return unwrapApiResponse(response, "Failed to fetch reviews");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch reviews");
    }
  },

  getReviewById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch review");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch review");
    }
  },

  createReview: async (reviewData) => {
    try {
      const response = await apiConfig.post(basePath, reviewData);
      return unwrapApiResponse(response, "Failed to create review");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create review");
    }
  },

  updateReview: async (id, reviewData) => {
    try {
      const response = await apiConfig.put(`${basePath}/${id}`, reviewData);
      return unwrapApiResponse(response, "Failed to update review");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update review");
    }
  },

  deleteReview: async (id) => {
    try {
      const response = await apiConfig.delete(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to delete review");
    } catch (error) {
      throw normalizeApiError(error, "Failed to delete review");
    }
  },
};

export default reviewsService;
