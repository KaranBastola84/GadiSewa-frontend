import { useState } from "react";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit logic here
    console.log("Register data:", formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200 sm:mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-600 to-indigo-600 opacity-95" />
            <div className="relative z-10 flex h-full flex-col justify-center p-12 text-white">
              <h2 className="text-4xl font-semibold tracking-tight">Join Gadi Sewa</h2>
              <p className="mt-6 max-w-xl text-lg leading-8">
                Register to manage rides, track bookings, and get priority support on all your travel needs.
              </p>
              <div className="mt-10 grid gap-4">
                <div className="rounded-3xl bg-white/10 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Fast registration</p>
                  <p className="mt-3 text-2xl font-semibold">30 seconds</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-200">Secure</p>
                  <p className="mt-3 text-2xl font-semibold">End-to-end encrypted</p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-10 sm:px-10">
            <div className="mx-auto max-w-xl">
              <div className="mb-8 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">Create account</p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Register for Gadi Sewa</h1>
                <p className="mt-3 text-sm text-slate-600">
                  Fill in your details to get started with rides, chauffeur services, and travel support.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                    Full name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      placeholder="+977 98XXXXXXXX"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
                      Confirm password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-slate-600">
                    I agree to the
                    <a href="#" className="ml-1 font-medium text-sky-600 hover:text-sky-700">
                      terms and conditions
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  Create account
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?
                <a href="/login" className="ml-1 font-semibold text-sky-600 hover:text-sky-700">
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}