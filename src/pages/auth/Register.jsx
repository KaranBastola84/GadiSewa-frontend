import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Customer',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name required';
    if (!formData.email) newErrors.email = 'Email required';
    if (!formData.password) newErrors.password = 'Password required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mismatch';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 lg:p-12">
      {/* Global Background */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          backgroundImage: 'url("/assets/images/auth-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px) brightness(0.4)',
          transform: 'scale(1.1)'
        }}
      ></div>

      {/* Main Register Card */}
      <div className="relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row bg-white rounded-[32px] overflow-hidden shadow-2xl">
        
        {/* Left Side - Image (Flipped composition) */}
        <div className="hidden md:block w-1/2 relative p-12 flex flex-col justify-end overflow-hidden group">
          <img 
            src="/assets/images/auth-bg.png" 
            alt="Automotive Culture" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          
          <div className="relative z-10 text-white max-w-[340px]">
            <h3 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">Start Your Journey Today.</h3>
            <p className="text-slate-200 text-[13px] leading-relaxed font-semibold drop-shadow-md">
              Join the most comprehensive parts management system. Precision tools for precision builders.
            </p>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h2>
            <p className="text-slate-400 text-sm">Join the elite community</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-[380px] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input name="fullName" placeholder="John Doe" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-slate-300 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input name="email" type="email" placeholder="john@doe.com" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-slate-300 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone</label>
                <input name="phone" placeholder="9812345678" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-slate-300 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-slate-300 transition-all appearance-none cursor-pointer">
                  <option>Customer</option>
                  <option>Staff</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-slate-300 transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
                <input name="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:outline-none focus:border-slate-300 transition-all" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="w-4 h-4 rounded border-slate-200 text-slate-900 focus:ring-0 cursor-pointer" />
              <label htmlFor="agreeTerms" className="text-[10px] text-slate-400 font-medium">I Agree To The <span className="font-bold underline">Terms & Privacy Policy</span></label>
            </div>

            <div className="pt-3">
              <button type="submit" disabled={isLoading} className="w-full bg-[#1c1c1c] hover:bg-black text-white py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95">
                {isLoading ? 'Processing...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="text-[11px] font-medium text-slate-400">
            Already have an account? <Link to="/login" className="text-slate-900 font-bold underline underline-offset-2">Log In Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
