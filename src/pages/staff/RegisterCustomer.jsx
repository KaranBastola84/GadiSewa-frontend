import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Toast from '../../components/Toast';
import { registerCustomer } from '../../services/staffService';

const VEHICLE_TYPES = ['Car', 'Motorbike', 'Truck', 'Scooter', 'Van'];

const RegisterCustomer = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = customer info, 2 = vehicle info
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [customerForm, setCustomerForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', address: '', password: '',
  });
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: '', make: '', model: '', year: '', color: '', vehicleType: 'Car', mileage: '0',
  });
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateCustomer = () => {
    const e = {};
    if (!customerForm.firstName.trim()) e.firstName = 'First name is required';
    if (!customerForm.lastName.trim()) e.lastName = 'Last name is required';
    if (!customerForm.phoneNumber.trim()) e.phoneNumber = 'Phone is required';
    if (!customerForm.email.trim()) e.email = 'Email is required';
    if (!customerForm.password || customerForm.password.length < 8) e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateVehicle = () => {
    const e = {};
    if (!vehicleForm.registrationNumber.trim()) e.registrationNumber = 'Registration number is required';
    if (!vehicleForm.make.trim()) e.make = 'Make is required';
    if (!vehicleForm.model.trim()) e.model = 'Model is required';
    const yearNum = parseInt(vehicleForm.year, 10);
    if (vehicleForm.year && (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100)) {
      e.year = 'Year must be between 1900 and 2100';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCustomerContinue = (e) => {
    e.preventDefault();
    if (!validateCustomer()) return;
    setStep(2);
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!validateVehicle()) return;
    setIsLoading(true);
    try {
      const year = vehicleForm.year ? parseInt(vehicleForm.year, 10) : 2020;
      const mileage = vehicleForm.mileage ? parseInt(vehicleForm.mileage, 10) : 0;
      
      const payload = {
        ...customerForm,
        vehicles: [
          {
            registrationNumber: vehicleForm.registrationNumber.trim().toUpperCase(),
            make: vehicleForm.make.trim(),
            model: vehicleForm.model.trim(),
            year: year,
            mileage: mileage,
            color: vehicleForm.color.trim() || 'Default'
          }
        ]
      };

      const res = await registerCustomer(payload);
      // Backend returns ApiResponse<CustomerRegistrationResponseDto>
      // Let's get customerId from res.data or res
      const customerId = res?.data?.customerId || res?.customerId || res?.data?.id || res?.id;
      showToast('Customer & vehicle registered successfully!');
      setTimeout(() => {
        if (customerId) {
          navigate(`/staff/customers/${customerId}`);
        } else {
          navigate('/staff/customers/search');
        }
      }, 1500);
    } catch (err) {
      showToast(err?.response?.data?.message || err?.message || 'Failed to register customer & vehicle', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">Register Customer</h1>
        <p className="text-slate-400 font-medium">Step {step} of 2 — {step === 1 ? 'Personal Information' : 'Vehicle Details'}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        {[1, 2].map(s => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-black transition-all ${
              s < step ? 'bg-green-500 text-white' : s === step ? 'bg-[#1a1a1a] text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {s < step ? '✓' : s}
            </div>
            {s < 2 && <div className={`flex-1 h-0.5 transition-all ${s < step ? 'bg-green-500' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 ? (
        <form onSubmit={handleCustomerContinue} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 space-y-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="First Name" name="firstName" value={customerForm.firstName} onChange={handleCustomerChange} error={errors.firstName} placeholder="e.g. Ramesh" required />
            <Input label="Last Name" name="lastName" value={customerForm.lastName} onChange={handleCustomerChange} error={errors.lastName} placeholder="e.g. Koirala" required />
            <Input label="Phone Number" name="phoneNumber" value={customerForm.phoneNumber} onChange={handleCustomerChange} error={errors.phoneNumber} placeholder="98XXXXXXXX" required />
            <Input label="Email Address" name="email" type="email" value={customerForm.email} onChange={handleCustomerChange} error={errors.email} placeholder="customer@email.com" required />
            <div className="md:col-span-2">
              <Input label="Address" name="address" value={customerForm.address} onChange={handleCustomerChange} error={errors.address} placeholder="Kathmandu, Nepal" />
            </div>
            <div className="md:col-span-2">
              <Input label="Password" name="password" type="password" value={customerForm.password} onChange={handleCustomerChange} error={errors.password} placeholder="Minimum 8 characters" required />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#1a1a1a] hover:bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
            >
              Continue to Vehicle →
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVehicleSubmit} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 space-y-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Vehicle Details (Required)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Registration Number" name="registrationNumber" value={vehicleForm.registrationNumber} onChange={handleVehicleChange} error={errors.registrationNumber} placeholder="BA 2 PA 5544" required />
            <Input label="Make / Brand" name="make" value={vehicleForm.make} onChange={handleVehicleChange} error={errors.make} placeholder="e.g. Toyota" required />
            <Input label="Model" name="model" value={vehicleForm.model} onChange={handleVehicleChange} error={errors.model} placeholder="e.g. Hilux" required />
            <Input label="Year" name="year" type="number" value={vehicleForm.year} onChange={handleVehicleChange} error={errors.year} placeholder="e.g. 2022" />
            <Input label="Mileage" name="mileage" type="number" value={vehicleForm.mileage} onChange={handleVehicleChange} placeholder="e.g. 15000" />
            <Input label="Color" name="color" value={vehicleForm.color} onChange={handleVehicleChange} placeholder="e.g. White" />
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1">Vehicle Type</label>
              <select
                name="vehicleType"
                value={vehicleForm.vehicleType}
                onChange={handleVehicleChange}
                className="w-full bg-white border border-slate-200 rounded-md py-3 px-4 text-slate-900 focus:outline-none focus:border-slate-900 text-sm transition-all"
              >
                {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
              ← Back to Personal Info
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#1a1a1a] hover:bg-black text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
            >
              {isLoading ? (
                <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> Registering...</>
              ) : 'Complete Registration ✓'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterCustomer;
