import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/admin/users";

export const adminUsersService = {
  getUsers: async () => {
    try {
      const response = await apiConfig.get(basePath);
      return unwrapApiResponse(response, "Failed to fetch users");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch users");
    }
  },

  getUserById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch user details");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch user details");
    }
  },

  createStaffAccount: async (staffData) => {
    try {
      const response = await apiConfig.post(`${basePath}/staff`, staffData);
      return unwrapApiResponse(response, "Failed to create staff account");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create staff account");
    }
  },

  createAdminAccount: async (adminData) => {
    try {
      const response = await apiConfig.post(`${basePath}/admin`, adminData);
      return unwrapApiResponse(response, "Failed to create admin account");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create admin account");
    }
  },

  updateUserStatus: async (id, statusData) => {
    try {
      const response = await apiConfig.put(
        `${basePath}/${id}/status`,
        statusData,
      );
      return unwrapApiResponse(response, "Failed to update user status");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update user status");
    }
  },
};

export default adminUsersService;
