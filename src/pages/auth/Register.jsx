import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name required";
    if (!formData.email) newErrors.email = "Email required";
    if (!formData.password) newErrors.password = "Password required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mismatch";
    if (!formData.agreeTerms) newErrors.agreeTerms = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setErrors({}); // Clear previous errors

      try {
        // Map phone to phoneNumber to match backend DTO
        const { fullName, phone, confirmPassword, agreeTerms, ...rest } =
          formData;

        // Split FullName into FirstName and LastName
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || " "; // Default to space if no last name provided

        // Map role to integer if backend expects Enum
        const roleMapping = {
          Admin: 0,
          Customer: 1,
          Staff: 2,
        };

        const submitData = {
          FirstName: firstName,
          LastName: lastName,
          Email: rest.email,
          Password: rest.password,
          PhoneNumber: phone,
          Role: roleMapping[formData.role] ?? 1, // Default to Customer (1)
        };

        const response = await authService.registerUser(submitData);

        // On success: Show success message and redirect
        alert("Registration successful! Please login.");
        window.location.href = "/login";
      } catch (err) {
        // On error: Show proper error message from backend
        console.error("Registration Error:", err);

        // Handle different error formats
        let errorMsg = "Registration failed. Please try again.";
        if (err.message) errorMsg = err.message;
        if (typeof err === "string") errorMsg = err;
        if (err.errors) errorMsg = Object.values(err.errors).flat().join(", ");

        setErrors({
          general: errorMsg,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 lg:p-12">
      {/* Global Background */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backgroundImage: 'url("/assets/images/auth-bg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.4)",
          transform: "scale(1.1)",
        }}
      ></div>

      {/* Main Register Card */}
      <div className="relative z-10 w-full max-w-250 flex flex-col md:flex-row bg-white rounded-4xl overflow-hidden shadow-2xl">
        {/* Left Side - Image (Flipped composition) */}
        <div className="md:block w-1/2 relative p-12 flex flex-col justify-end overflow-hidden group">
          <img
            src="/assets/images/auth-bg.png"
            alt="Automotive Culture"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent"></div>

          <div className="relative z-10 text-white max-w-85">
            <h3 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">
              Start Your Journey Today.
            </h3>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
              GADISEWA<span className="text-primary-600">®</span>
            </h1>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Create Account
            </h2>
            <p className="text-slate-400 text-sm">Join the elite community</p>
          </div>

          {errors.general && (
            <div className="w-full max-w-95 p-3 mb-4 bg-red-50 border border-red-100 rounded-lg text-red-500 text-xs text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-95 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-300 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@doe.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-300 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Phone
                </label>
                <input
                  name="phone"
                  placeholder="9812345678"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-300 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-300 transition-all cursor-pointer"
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-300 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Confirm
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-slate-300 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-200 text-slate-900 focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor="agreeTerms"
                className="text-[10px] text-slate-400 font-medium"
              >
                I Agree To The{" "}
                <span className="font-bold underline">
                  Terms & Privacy Policy
                </span>
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1c1c1c] hover:bg-black text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95"
              >
                {isLoading ? "Processing..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="text-[11px] font-medium text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-slate-900 font-bold underline underline-offset-2"
            >
              Log In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
