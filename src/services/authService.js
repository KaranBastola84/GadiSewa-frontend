import apiConfig from "../config/apiConfig";

/**
 * Service for authentication related API calls
 */
export const authService = {
  registerUser: async (userData) => {
    try {
      const response = await apiConfig.post("/Auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await apiConfig.post("/Auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  verifyEmail: async (token) => {
    try {
      const response = await apiConfig.post("/Auth/verify-email", { token });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Email verification failed" };
    }
  },

  resendVerification: async (email) => {
    try {
      const response = await apiConfig.post("/Auth/resend-verification", {
        email,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Resend verification failed" };
    }
  },

  getProfile: async (token) => {
    try {
      const response = await apiConfig.get("/Auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch profile" };
    }
  },

  updateProfile: async (profileData, token) => {
    try {
      const response = await apiConfig.put("/Auth/profile", profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Profile update failed" };
    }
  },

  changePassword: async (passwordData, token) => {
    try {
      const response = await apiConfig.post(
        "/Auth/change-password",
        passwordData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Password change failed" };
    }
  },

  forgotPassword: async (email) => {
    try {
      const response = await apiConfig.post("/Auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Forgot password request failed" }
      );
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiConfig.post("/Auth/reset-password", {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Password reset failed" };
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await apiConfig.post("/Auth/refresh-token", {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Token refresh failed" };
    }
  },

  logout: async (refreshToken) => {
    try {
      const response = await apiConfig.post("/Auth/logout", { refreshToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Logout failed" };
    }
  },
};

export default authService;