import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Phone, ShieldCheck, Wrench } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Customer'
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      console.log('Registration logic here', formData);
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600/10 text-primary-500 mb-4 ring-1 ring-primary-500/20 shadow-inner">
            <Wrench size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-2">Join GadiSewa Inventory Management</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                icon={User}
                required
              />
              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                icon={Mail}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                icon={Phone}
                required
              />
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-slate-300">
                  Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ShieldCheck size={18} />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="Customer" className="bg-slate-900 text-slate-100">Customer</option>
                    <option value="Staff" className="bg-slate-900 text-slate-100">Staff</option>
                    <option value="Admin" className="bg-slate-900 text-slate-100">Admin</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
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
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                icon={Lock}
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" isLoading={isLoading}>
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors underline underline-offset-4 decoration-primary-500/30">
                Login here
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

export default Register;
