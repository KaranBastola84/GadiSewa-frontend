/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import authService from "../services/authService";
import apiConfig from "../config/apiConfig";

const AuthContext = createContext();

export const USER_ROLES = {
  ADMIN: 1,
  STAFF: 2,
  CUSTOMER: 3,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("gadisewa_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() =>
    localStorage.getItem("gadisewa_token"),
  );
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("gadisewa_refresh_token"),
  );
  const [loading, setLoading] = useState(false);

  const login = useCallback((authData) => {
    const {
      userId,
      customerId,
      fullName,
      email,
      role,
      token: newToken,
      refreshToken: newRefresh,
    } = authData;
    const userData = {
      userId,
      customerId,
      fullName,
      email,
      role,
    };
    setUser(userData);
    setToken(newToken);
    setRefreshToken(newRefresh);
    localStorage.setItem("gadisewa_user", JSON.stringify(userData));
    localStorage.setItem("gadisewa_token", newToken);
    localStorage.setItem("gadisewa_refresh_token", newRefresh);
  }, []);

  const logout = useCallback(async () => {
    const activeRefreshToken =
      refreshToken || localStorage.getItem("gadisewa_refresh_token");

    try {
      if (activeRefreshToken) {
        await authService.logout(activeRefreshToken);
      }
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      localStorage.removeItem("gadisewa_user");
      localStorage.removeItem("gadisewa_token");
      localStorage.removeItem("gadisewa_refresh_token");
    }
  }, [refreshToken]);

  const isAuthenticated = !!token && !!user;

  const hasRole = useCallback(
    (requiredRoles) => {
      if (!isAuthenticated) return false;
      if (!Array.isArray(requiredRoles)) requiredRoles = [requiredRoles];
      return requiredRoles.includes(user.role);
    },
    [isAuthenticated, user],
  );

  const value = {
    user,
    token,
    refreshToken,
    login,
    logout,
    isAuthenticated,
    loading,
    setLoading,
    hasRole,
  };

  useEffect(() => {
    const resolveCustomerId = async () => {
      if (token && user && user.role === USER_ROLES.CUSTOMER && !user.customerId) {
        try {
          const response = await apiConfig.get("/Customers/me");
          const custId = response.data?.result?.customerId;
          if (custId) {
            const updatedUser = { ...user, customerId: custId };
            setUser(updatedUser);
            localStorage.setItem("gadisewa_user", JSON.stringify(updatedUser));
          }
        } catch (err) {
          console.error("Failed to resolve customerId:", err);
        }
      }
    };
    resolveCustomerId();
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
