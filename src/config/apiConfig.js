import axios from "axios";

const API_BASE_URL = "http://localhost:5030/api";

const apiConfig = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to headers
apiConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("gadisewa_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for token refresh
apiConfig.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle network errors (server unreachable, timeout, no internet)
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED';
      error.networkError = true;
      error.message = isTimeout
        ? 'Request timed out. The server may be busy — please try again.'
        : 'Unable to connect to the server. Please check your internet connection.';
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("gadisewa_refresh_token");
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/Auth/refresh-token`,
            {
              refreshToken,
            },
          );

          if (response.data?.result?.token) {
            const newToken = response.data.result.token;
            localStorage.setItem("gadisewa_token", newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiConfig(originalRequest);
          }
        }
      } catch (refreshError) {
        // Clear auth data and redirect to login
        localStorage.removeItem("gadisewa_token");
        localStorage.removeItem("gadisewa_refresh_token");
        localStorage.removeItem("gadisewa_user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default apiConfig;