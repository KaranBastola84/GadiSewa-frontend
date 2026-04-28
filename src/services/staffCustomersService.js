import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

const basePath = "/staff/customers";

export const staffCustomersService = {
  createCustomer: async (customerData) => {
    try {
      const response = await apiConfig.post(basePath, customerData);
      return unwrapApiResponse(response, "Failed to create customer");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create customer");
    }
  },

  searchCustomers: async (params = {}) => {
    try {
      const response = await apiConfig.get(`${basePath}/search`, { params });
      return unwrapApiResponse(response, "Failed to search customers");
    } catch (error) {
      throw normalizeApiError(error, "Failed to search customers");
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await apiConfig.get(`${basePath}/${id}`);
      return unwrapApiResponse(response, "Failed to fetch customer");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch customer");
    }
  },

  getCustomerByVehicle: async (registrationNumber) => {
    try {
      const response = await apiConfig.get(
        `${basePath}/by-vehicle/${registrationNumber}`,
      );
      return unwrapApiResponse(response, "Failed to fetch customer by vehicle");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch customer by vehicle");
    }
  },

  getCustomerByPhone: async (phoneNumber) => {
    try {
      const response = await apiConfig.get(
        `${basePath}/by-phone/${phoneNumber}`,
      );
      return unwrapApiResponse(response, "Failed to fetch customer by phone");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch customer by phone");
    }
  },
};

export default staffCustomersService;
