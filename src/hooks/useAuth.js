import { useAuthContext } from '../context/AuthContext';

/**
 * Custom hook for authentication logic
 * This acts as a wrapper around the AuthContext for cleaner usage in components
 */
export const useAuth = () => {
  const { user, login, logout, isAuthenticated, loading } = useAuthContext();

  return {
    user,
    login,
    logout,
    isAuthenticated,
    loading,
    // Add additional helper methods here (e.g., check permissions)
    isAdmin: user?.role === 'Admin',
    isStaff: user?.role === 'Staff',
  };
};

export default useAuth;
