import { useState, useEffect } from "react";
import CustomerLayout from "../../components/CustomerLayout";
import { Star } from "lucide-react";
import reviewsService from "../../services/reviewsService";
import appointmentsService from "../../services/appointmentsService";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ appointmentId: "", rating: 0, comment: "" });
  const [errors, setErrors] = useState({});

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsService.getReviews();
      setReviews(Array.isArray(data) ? data : data?.result || data?.reviews || []);
    } catch (err) {
      console.error(err);
      setErrors({ fetch: err.message || "Failed to load reviews" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedAppointments = async () => {
    try {
      const data = await appointmentsService.getAppointments();
      const rawList = Array.isArray(data) ? data : data?.result || data?.appointments || [];
      // Completed status is 4
      const completed = rawList.filter((a) => a.status === 4);
      setCompletedAppointments(completed);
    } catch (err) {
      console.error("Failed to load completed appointments:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchCompletedAppointments();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (!form.appointmentId) errs.appointmentId = "Select an appointment";
    if (!form.rating) errs.rating = "Give a rating";
    if (!form.comment.trim()) errs.comment = "Write something";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      await reviewsService.createReview({
        appointmentId: form.appointmentId,
        rating: Number(form.rating),
        comment: form.comment.trim(),
      });
      setForm({ appointmentId: "", rating: 0, comment: "" });
      setShowForm(false);
      setMsg("Review submitted! Thanks for the feedback.");
      fetchReviews();
      fetchCompletedAppointments();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to submit review" });
    }
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <CustomerLayout pageTitle="Reviews">
      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{msg}</div>
      )}
      {errors.fetch && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{errors.fetch}</div>
      )}

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-slate-500">Share your experience</p>
        {!showForm && (
          <button onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-semibold transition">
            + Write Review
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5 flex items-center gap-6">
        <div>
          <p className="text-4xl font-bold text-slate-800">{avg}</p>
          <p className="text-sm text-slate-400">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-8 flex justify-end items-center gap-0.5 text-slate-500">{star}<Star size={12} className="fill-slate-500" /></span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-4 text-slate-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <h3 className="font-bold text-slate-800 mb-4">Write a Review</h3>
          {errors.submit && <p className="text-sm text-red-600 mb-3">{errors.submit}</p>}
          {completedAppointments.length === 0 ? (
            <p className="text-sm text-slate-500 py-2">
              You must have at least one completed appointment to write a review.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Appointment *</label>
                  <select
                    name="appointmentId"
                    value={form.appointmentId}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${
                      errors.appointmentId ? "border-red-400" : "border-slate-200"
                    }`}
                  >
                    <option value="">Select completed appointment</option>
                    {completedAppointments.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.vehicleName} - {new Date(a.scheduledAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  {errors.appointmentId && <p className="text-xs text-red-500 mt-1">{errors.appointmentId}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Rating *</label>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, rating: s })}
                        className="text-2xl hover:scale-110 transition cursor-pointer"
                      >
                        {s <= form.rating ? (
                          <Star size={24} className="text-yellow-400 fill-yellow-400" />
                        ) : (
                          <Star size={24} className="text-slate-300" />
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-600 mb-1">Comment *</label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Your experience..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm resize-none ${
                    errors.comment ? "border-red-400" : "border-slate-200"
                  }`}
                />
                {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment}</p>}
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                <button type="submit" className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold cursor-pointer">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-bold text-slate-800">
                    Appointment #{r.appointmentNumber} ({r.vehicleRegistrationNumber})
                  </h4>
                  <p className="text-xs text-slate-400">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  r.rating >= 4 ? "bg-green-50 text-green-700" : r.rating >= 3 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                }`}>{r.rating}/5</span>
              </div>
              <p className="text-sm text-slate-600">{r.comment}</p>
              {r.response && (
                <div className="mt-3 p-3 bg-sky-50 rounded-lg">
                  <p className="text-xs font-semibold text-sky-700">GadiSewa Response:</p>
                  <p className="text-sm text-sky-800">{r.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </CustomerLayout>
  );
}
