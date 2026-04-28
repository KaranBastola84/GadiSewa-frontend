import { useState } from "react";
import CustomerLayout from "../../components/CustomerLayout";
import { useCustomer } from "../../context/CustomerContext";

const serviceOptions = [
  "Oil Change", "Brake Pad Replacement", "Engine Tune-Up",
  "Wheel Alignment", "AC Service", "Full Vehicle Service",
  "Battery Replacement", "General Parts Purchase",
];

export default function ReviewsPage() {
  const { reviews, submitReview } = useCustomer();
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ serviceType: "", rating: 0, comment: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const errs = {};
    if (!form.serviceType) errs.serviceType = "Required";
    if (!form.rating) errs.rating = "Give a rating";
    if (!form.comment.trim()) errs.comment = "Write something";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitReview(form);
      setForm({ serviceType: "", rating: 0, comment: "" });
      setShowForm(false);
      setMsg("Review submitted! Thanks for the feedback.");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setErrors({ submit: err.message });
    }
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <CustomerLayout pageTitle="Reviews">
      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{msg}</div>
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
                <span className="w-4 text-slate-500">{star}★</span>
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
          <form onSubmit={handleSubmit}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Service *</label>
                <select name="serviceType" value={form.serviceType} onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${errors.serviceType ? "border-red-400" : "border-slate-200"}`}>
                  <option value="">Select</option>
                  {serviceOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
                {errors.serviceType && <p className="text-xs text-red-500 mt-1">{errors.serviceType}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Rating *</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}
                      className="text-2xl hover:scale-110 transition">
                      {s <= form.rating ? "⭐" : "☆"}
                    </button>
                  ))}
                </div>
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-600 mb-1">Comment *</label>
              <textarea name="comment" value={form.comment} onChange={handleChange} rows={3}
                placeholder="Your experience..."
                className={`w-full px-3 py-2 border rounded-lg text-sm resize-none ${errors.comment ? "border-red-400" : "border-slate-200"}`} />
              {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment}</p>}
            </div>
            <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
              <button type="submit" className="px-5 py-2 bg-sky-600 text-white rounded-lg text-sm font-semibold">Submit</button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
          <p className="text-slate-400">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="font-bold text-slate-800">{r.serviceType}</h4>
                  <p className="text-xs text-slate-400">{r.date}</p>
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
