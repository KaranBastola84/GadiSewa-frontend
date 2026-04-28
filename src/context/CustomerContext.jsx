/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

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
  const [vehicles, setVehicles] = useState(() => loadData("gs_vehicles"));
  const [appointments, setAppointments] = useState(() =>
    loadData("gs_appointments"),
  );
  const [history] = useState(() => loadData("gs_history"));
  const [requests, setRequests] = useState(() => loadData("gs_requests"));
  const [reviews, setReviews] = useState(() => loadData("gs_reviews"));
  const [notifications, setNotifications] = useState(() =>
    loadData("gs_notifications"),
  );

  useEffect(() => {
    if (profile) saveData("gs_profile", profile);
  }, [profile]);
  useEffect(() => {
    saveData("gs_vehicles", vehicles);
  }, [vehicles]);
  useEffect(() => {
    saveData("gs_appointments", appointments);
  }, [appointments]);
  useEffect(() => {
    saveData("gs_requests", requests);
  }, [requests]);
  useEffect(() => {
    saveData("gs_reviews", reviews);
  }, [reviews]);
  useEffect(() => {
    saveData("gs_notifications", notifications);
  }, [notifications]);

  function updateProfile(data) {
    setProfile(data);
  }

  function addVehicle(data) {
    const newVehicle = { ...data, id: Date.now() };
    setVehicles((prev) => [...prev, newVehicle]);
  }

  function updateVehicle(id, data) {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...data } : v)),
    );
  }

  function deleteVehicle(id) {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  }

  function bookAppointment(data) {
    const newAppt = { ...data, id: Date.now(), status: "Pending" };
    setAppointments((prev) => [...prev, newAppt]);
  }

  function cancelAppointment(id) {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a)),
    );
  }

  function submitRequest(data) {
    const newReq = {
      ...data,
      id: Date.now(),
      status: "Pending",
      requestedDate: new Date().toISOString().split("T")[0],
    };
    setRequests((prev) => [...prev, newReq]);
  }

  function submitReview(data) {
    const newReview = {
      ...data,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      response: "",
    };
    setReviews((prev) => [...prev, newReview]);
  }

  function markRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const totalSpent = history.reduce((sum, h) => sum + (h.amount || 0), 0);

  const value = {
    profile,
    updateProfile,
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    appointments,
    bookAppointment,
    cancelAppointment,
    history,
    requests,
    submitRequest,
    reviews,
    submitReview,
    notifications,
    markRead,
    markAllRead,
    unreadCount,
    totalSpent,
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
