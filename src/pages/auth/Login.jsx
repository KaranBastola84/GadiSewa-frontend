import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Wrench } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      // Logic for authentication will be handled by the user
      console.log('Login logic here', formData);
      setTimeout(() => setIsLoading(false), 2000); // Simulate API call
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600/10 text-primary-500 mb-4 ring-1 ring-primary-500/20 shadow-inner">
            <Wrench size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">GadiSewa</h1>
          <p className="text-slate-400 mt-2">Inventory & Parts Management System</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Login to your account</h2>
            <p className="text-sm text-slate-400 mt-1">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email address"
              name="email"
              type="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              required
            />

            <div className="space-y-1">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={Lock}
                togglePassword={() => setShowPassword(!showPassword)}
                required
              />
              <div className="flex justify-end">
                <button type="button" className="text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors underline underline-offset-4 decoration-primary-500/30">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} GadiSewa. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Login;
