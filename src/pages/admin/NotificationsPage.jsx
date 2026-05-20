import { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import adminNotificationsService from "../../services/adminNotificationsService";
import { Search, Bell, Mail, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info, X } from "lucide-react";

export default function AdminNotificationsPage() {
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [type, setType] = useState("");
  const [channel, setChannel] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSuccess, setIsSuccess] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Details Modal
  const [selectedLog, setSelectedLog] = useState(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        pageNumber: page,
        pageSize: 15,
      };

      if (type) params.type = type;
      if (channel) params.channel = channel;
      if (recipient) params.recipient = recipient;
      if (isSuccess !== "") params.isSuccess = isSuccess === "true";
      if (fromDate) params.from = new Date(fromDate).toISOString();
      if (toDate) params.to = new Date(toDate).toISOString();

      const res = await adminNotificationsService.getNotifications(params);
      const data = res?.result || res || {};

      setItems(data.items || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to retrieve notification logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [page]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadLogs();
  };

  const resetFilters = () => {
    setType("");
    setChannel("");
    setRecipient("");
    setIsSuccess("");
    setFromDate("");
    setToDate("");
    setPage(1);
    // Timeout to let state update
    setTimeout(() => loadLogs(), 50);
  };

  return (
    <AdminLayout pageTitle="Notification Logs" subtitle="Inspect system-generated emails, alerts, and transactional messages">
      <div className="space-y-6">
        {/* Filter Accordion/Form */}
        <form onSubmit={handleFilterSubmit} className="bg-white border border-slate-200 p-5 rounded-3xl shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter Notification History</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Recipient</label>
              <input
                type="text"
                placeholder="Email or phone number..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Notification Type</label>
              <input
                type="text"
                placeholder="e.g. SaleCreated, LowStock..."
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">All Channels</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Status</label>
              <select
                value={isSuccess}
                onChange={(e) => setIsSuccess(e.target.value)}
                className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="">All Statuses</option>
                <option value="true">Success</option>
                <option value="false">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sent From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Sent To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer transition"
            >
              Apply Filter
            </button>
          </div>
        </form>

        {/* Logs Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-slate-950" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">{error}</div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
            No system notifications match the specified criteria.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider font-bold text-slate-500">
                    <tr>
                      <th className="py-3 px-5">Sent At</th>
                      <th className="py-3 px-5">Recipient</th>
                      <th className="py-3 px-5">Type / Channel</th>
                      <th className="py-3 px-5">Subject / Title</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-4 px-5 text-xs text-slate-500">
                          {new Date(log.sentAt).toLocaleString()}
                        </td>
                        <td className="py-4 px-5 font-semibold text-slate-900 text-xs truncate max-w-[150px]">
                          {log.recipient}
                        </td>
                        <td className="py-4 px-5">
                          <p className="font-bold text-slate-800 text-xs">{log.notificationType}</p>
                          <p className="text-[10px] text-slate-400">{log.channel}</p>
                        </td>
                        <td className="py-4 px-5 text-xs text-slate-650 font-semibold truncate max-w-[200px]">
                          {log.title || log.subject || "No Subject"}
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                              log.isSuccess
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {log.isSuccess ? (
                              <>
                                <CheckCircle2 size={10} /> Delivered
                              </>
                            ) : (
                              <>
                                <XCircle size={10} /> Failed
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1 cursor-pointer transition shadow-xs"
                          >
                            <Info size={12} /> Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-slate-500">
                  Showing page <span className="font-bold text-slate-800">{page}</span> of{" "}
                  <span className="font-bold text-slate-800">{totalPages}</span> ({totalCount} total logs)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 border border-slate-200 rounded-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="p-2 border border-slate-200 rounded-xl disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* INSPECT DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 w-full max-w-lg shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setSelectedLog(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
              <Mail size={18} className="text-sky-600" /> Inspect Notification
            </h3>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Recipient</p>
                  <p className="font-bold text-slate-800 break-all">{selectedLog.recipient}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Delivery Channel</p>
                  <p className="font-bold text-slate-850">{selectedLog.channel}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Event Type</p>
                  <p className="font-semibold text-slate-700">{selectedLog.notificationType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Sent Time</p>
                  <p className="font-semibold text-slate-700">{new Date(selectedLog.sentAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedLog.errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  <p className="font-bold">Error Output:</p>
                  <p className="font-mono mt-1 text-[11px]">{selectedLog.errorMessage}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Subject</p>
                <p className="p-2 bg-slate-50 rounded-lg font-bold text-slate-900">{selectedLog.title || selectedLog.subject || "No Subject"}</p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Message Content</p>
                <div className="p-3 bg-slate-50 rounded-xl max-h-64 overflow-y-auto font-mono text-[11px] text-slate-700 whitespace-pre-wrap border border-slate-100">
                  {selectedLog.body || selectedLog.message || "No content body logged."}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-800 transition shadow-xs"
              >
                Close Inspect
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
