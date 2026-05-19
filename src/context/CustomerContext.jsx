/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CustomerContext = createContext(null);

function loadData(key, fallback = []) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function CustomerProvider({ children }) {
  const [profile, setProfile] = useState(() => loadData("gs_profile", null));
  const [notifications, setNotifications] = useState(() =>
    loadData("gs_notifications"),
  );
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (profile) saveData("gs_profile", profile);
  }, [profile]);
  useEffect(() => {
    saveData("gs_notifications", notifications);
  }, [notifications]);

  const updateProfile = useCallback((data) => {
    setProfile(data);
  }, []);

  const updateTotalSpent = useCallback((amount) => {
    setTotalSpent(amount);
  }, []);

  function markRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    profile,
    updateProfile,
    totalSpent,
    updateTotalSpent,
    notifications,
    markRead,
    markAllRead,
    unreadCount,
    loading: false,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used inside CustomerProvider");
  return ctx;
}

export default CustomerContext;
