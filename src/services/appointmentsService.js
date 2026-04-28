import apiConfig from "../config/apiConfig";
import { normalizeApiError, unwrapApiResponse } from "./apiHelpers";

export const appointmentsService = {
  createAppointment: async (appointmentData) => {
    try {
      const response = await apiConfig.post("/Appointments", appointmentData);
      return unwrapApiResponse(response, "Failed to create appointment");
    } catch (error) {
      throw normalizeApiError(error, "Failed to create appointment");
    }
  },

  getAppointments: async () => {
    try {
      const response = await apiConfig.get("/Appointments");
      return unwrapApiResponse(response, "Failed to fetch appointments");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch appointments");
    }
  },

  getStaffAppointments: async () => {
    try {
      const response = await apiConfig.get("/Appointments/staff");
      return unwrapApiResponse(response, "Failed to fetch staff appointments");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch staff appointments");
    }
  },

  getStaffAppointmentById: async (id) => {
    try {
      const response = await apiConfig.get(`/Appointments/staff/${id}`);
      return unwrapApiResponse(response, "Failed to fetch appointment details");
    } catch (error) {
      throw normalizeApiError(error, "Failed to fetch appointment details");
    }
  },

  updateStaffAppointmentStatus: async (id, statusData) => {
    try {
      const response = await apiConfig.put(
        `/Appointments/staff/${id}/status`,
        statusData,
      );
      return unwrapApiResponse(response, "Failed to update appointment status");
    } catch (error) {
      throw normalizeApiError(error, "Failed to update appointment status");
    }
  },
};

export default appointmentsService;
