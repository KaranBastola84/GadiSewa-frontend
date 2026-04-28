import apiConfig from '../config/apiConfig';

/**
 * Service for authentication related API calls
 */
export const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Axios promise
   */
  registerUser: async (userData) => {
    try {
      const response = await apiConfig.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  /**
   * Login an existing user
   * @param {Object} credentials - User login credentials
   * @returns {Promise} - Axios promise
   */
  loginUser: async (credentials) => {
    try {
      const response = await apiConfig.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  }
};

export default authService;
