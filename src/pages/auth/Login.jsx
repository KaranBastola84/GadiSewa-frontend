import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH_BG_IMAGE } from "../../constants";
import authService from "../../services/authService";
import { useAuthContext, USER_ROLES } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthContext();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setErrors({});

      try {
        const credentials = {
          email: formData.email,
          password: formData.password,
        };

        const response = await authService.loginUser(credentials);

        if (response?.isSuccess && response?.result) {
          const authData = response.result;
          login(authData);

          // Redirect based on role
          if (authData.role === USER_ROLES.ADMIN) {
            navigate("/admin-dashboard");
          } else if (authData.role === USER_ROLES.STAFF) {
            navigate("/staff-dashboard");
          } else if (authData.role === USER_ROLES.CUSTOMER) {
            navigate("/customer/dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          setErrors({
            general: response?.errorMessage?.[0] || "Login failed",
          });
        }
      } catch (err) {
        console.error("Login Error:", err);
        setErrors({
          general:
            err?.errorMessage?.[0] ||
            err?.message ||
            "Invalid email or password",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 lg:p-12">
      {/* Global Background (Blurred image behind the card) */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backgroundImage: `url("${AUTH_BG_IMAGE}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.4)",
          transform: "scale(1.1)",
        }}
      ></div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-250 flex flex-col md:flex-row bg-white rounded-4xl overflow-hidden shadow-2xl">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
              GADISEWA<span className="text-primary-600">®</span>
            </h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Build Together
            </h2>
            <p className="text-slate-400 text-sm">Please enter your details</p>
          </div>

          {errors.general && (
            <div className="w-full max-w-85 p-3 mb-4 bg-red-50 border border-red-100 rounded-lg text-red-500 text-xs text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full max-w-85 space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email address
              </label>
              <input
                name="email"
                type="email"
                autoComplete="off"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 ml-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-slate-300 transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 ml-1">
                  {errors.password}
                </p>
              )}
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
                className="text-[11px] text-slate-400 font-medium cursor-pointer"
              >
                I Agree To The{" "}
                <span className="font-bold underline">
                  Terms & Privacy Policy
                </span>
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1c1c1c] hover:bg-black text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95"
              >
                {isLoading ? "Processing..." : "Join the Ride"}
              </button>
            </div>
          </form>

          <p className="text-[12px] font-medium text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-slate-900 font-bold underline underline-offset-2"
            >
              Sign Up Here
            </Link>
          </p>
        </div>

        {/* Right Side - Image & Overlay */}
        <div className="flex md:block w-1/2 relative p-12 flex-col justify-end overflow-hidden group">
          <img
            src={AUTH_BG_IMAGE}
            alt="Automotive Culture"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent"></div>

          <div className="relative z-10 text-white max-w-100">
            <h3 className="text-5xl font-black italic mb-6 leading-[1.1] drop-shadow-2xl uppercase tracking-tighter">
              More Than Wheels.
              <br />
              It's Culture.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
