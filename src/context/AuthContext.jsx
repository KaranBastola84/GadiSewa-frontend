/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";

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
      fullName,
      email,
      role,
      token: newToken,
      refreshToken: newRefresh,
    } = authData;
    const userData = {
      userId,
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

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("gadisewa_user");
    localStorage.removeItem("gadisewa_token");
    localStorage.removeItem("gadisewa_refresh_token");
  }, []);

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
