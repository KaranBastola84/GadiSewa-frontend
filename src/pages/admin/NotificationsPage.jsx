import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import apiConfig from "../../config/apiConfig";
import { Loader2, Bell, AlertCircle, CheckCircle, Mailbox, Calendar, Tag, ChevronRight, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Detail Modal State
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // GET /api/admin/notifications 
      const response = await apiConfig.get("/admin/notifications");
      setNotifications(response.data?.result?.items || response.data?.result || response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load notifications.");
      toast.error("Failed to load notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openDetail = async (id) => {
    try {
      setIsDetailLoading(true);
      // Fallback optimistic load in case API doesn't return immediately
      setSelectedNotification(notifications.find(n => n.id === id) || { id });
      
      // GET /api/admin/notifications/{id}
      const response = await apiConfig.get(`/admin/notifications/${id}`);
      setSelectedNotification(response.data?.result || response.data);
    } catch (err) {
      toast.error("Failed to fetch notification details.");
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedNotification(null);
  };

  const getStatusColor = (type) => {
    switch ((type || "").toLowerCase()) {
      case "alert": return "text-orange-600 bg-orange-50";
      case "success": return "text-emerald-600 bg-emerald-50";
      case "error": return "text-rose-600 bg-rose-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  return (
    <AdminLayout pageTitle="System Notifications" subtitle="Monitor all automated platform and system logs.">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-bold text-slate-900">Notification Logs</h2>
          </div>
          <button onClick={fetchNotifications} className="text-sm text-blue-600 font-semibold hover:text-blue-700 hover:underline">
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
            <p className="font-medium">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="p-12 flex flex-col items-center justify-center text-rose-500">
            <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-bold">{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-slate-400">
            <Mailbox className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-medium">No notifications recorded.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map(note => (
              <div 
                key={note.id} 
                onClick={() => openDetail(note.id)}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getStatusColor(note.notificationType || note.type)} mt-1`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{note.subject || note.type || "System Alert"}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{note.message}</p>
                    <div className="flex items-center gap-4 mt-2">
                       <span className="text-xs text-slate-400 font-medium tracking-wide flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(note.createdAt).toLocaleString()}
                       </span>
                       {/* The prompt mentioned isRead status, defaulting to IsSuccess if unavailable */}
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${note.isRead === false || note.isSuccess === false ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {note.isRead === false ? 'Unread' : 'Processed'}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="pl-4">
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeDetail}></div>
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                Notification Details
              </h3>
              <button onClick={closeDetail} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {isDetailLoading && !selectedNotification.message ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Type & Status</label>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getStatusColor(selectedNotification.notificationType || selectedNotification.type)}`}>
                        {selectedNotification.notificationType || selectedNotification.type || "General"}
                      </span>
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${selectedNotification.isSuccess === false ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                        {selectedNotification.isSuccess === false ? 'Failed' : 'Success'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Subject</label>
                    <p className="text-sm font-semibold text-slate-900 border-l-2 border-blue-500 pl-3 py-0.5">
                      {selectedNotification.subject || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Message</label>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 leading-relaxed">
                      {selectedNotification.message}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Recipient</label>
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        {selectedNotification.recipient || "Global"}
                      </p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Created At</label>
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {selectedNotification.createdAt ? new Date(selectedNotification.createdAt).toLocaleString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={closeDetail}
                className="px-5 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-xs hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
