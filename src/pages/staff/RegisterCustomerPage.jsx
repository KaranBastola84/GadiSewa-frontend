import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffLayout from "../../components/StaffLayout";
import staffCustomersService from "../../services/staffCustomersService";
import customerService from "../../services/customerService";
import { User, Car, CheckCircle, ArrowRight, Plus, ArrowLeft } from "lucide-react";

export default function RegisterCustomerPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Customer Info, 2: Vehicle Info, 3: Success Screen
  const [registeredCustomerId, setRegisteredCustomerId] = useState("");
  const [registeredCustomerName, setRegisteredCustomerName] = useState("");

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    address: "",
  });

  const [vehicle, setVehicle] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    mileage: "0",
    color: "",
  });

  // Secondary vehicle form state (shown in step 3 if they want to add more)
  const [showSecondaryForm, setShowSecondaryForm] = useState(false);
  const [secondaryVehicle, setSecondaryVehicle] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    mileage: "0",
    color: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handleCustomerChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleVehicleChange(e) {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleSecondaryChange(e) {
    setSecondaryVehicle({ ...secondaryVehicle, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  }

  function validateCustomer() {
    const errs = {};
    if (!customer.firstName.trim()) errs.firstName = "First name is required";
    if (!customer.lastName.trim()) errs.lastName = "Last name is required";
    if (!customer.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(customer.email)) errs.email = "Invalid email format";
    if (!customer.password) errs.password = "Password is required";
    else if (customer.password.length < 8) errs.password = "Must be at least 8 characters";
    if (!customer.phoneNumber.trim()) errs.phoneNumber = "Phone number is required";
    if (!customer.address.trim()) errs.address = "Address is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function validateVehicle(vData) {
    const errs = {};
    if (!vData.registrationNumber.trim()) errs.registrationNumber = "Plate number is required";
    if (!vData.make.trim()) errs.make = "Make is required (e.g. Toyota)";
    if (!vData.model.trim()) errs.model = "Model is required (e.g. Hilux)";
    if (!vData.year || isNaN(vData.year)) errs.year = "Valid year is required";
    if (!vData.color.trim()) errs.color = "Color is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleRegister(e) {
    e.preventDefault();
    if (!validateVehicle(vehicle)) return;

    try {
      setSubmitError("");
      const payload = {
        ...customer,
        vehicles: [
          {
            registrationNumber: vehicle.registrationNumber.trim().toUpperCase(),
            make: vehicle.make.trim(),
            model: vehicle.model.trim(),
            year: parseInt(vehicle.year),
            mileage: parseInt(vehicle.mileage) || 0,
            color: vehicle.color.trim(),
          },
        ],
      };

      const res = await staffCustomersService.createCustomer(payload);
      const newCust = res?.result || res;
      if (newCust?.customerId) {
        setRegisteredCustomerId(newCust.customerId);
        setRegisteredCustomerName(`${customer.firstName} ${customer.lastName}`);
        setStep(3);
      } else {
        throw new Error("Missing customerId in response");
      }
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Failed to register customer. Email or plate number might already exist.");
    }
  }

  async function handleAddSecondaryVehicle(e) {
    e.preventDefault();
    if (!validateVehicle(secondaryVehicle)) return;

    try {
      setSubmitError("");
      setSuccessMsg("");
      await customerService.addVehicle(registeredCustomerId, {
        registrationNumber: secondaryVehicle.registrationNumber.trim().toUpperCase(),
        make: secondaryVehicle.make.trim(),
        model: secondaryVehicle.model.trim(),
        year: parseInt(secondaryVehicle.year),
        mileage: parseInt(secondaryVehicle.mileage) || 0,
        color: secondaryVehicle.color.trim(),
      });
      setSuccessMsg("Additional vehicle added successfully!");
      setSecondaryVehicle({
        registrationNumber: "",
        make: "",
        model: "",
        year: new Date().getFullYear().toString(),
        mileage: "0",
        color: "",
      });
      setShowSecondaryForm(false);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Failed to add secondary vehicle.");
    }
  }

  return (
    <StaffLayout pageTitle="Register Customer" subtitle="Add a new client and verify their vehicle details">
      <div className="max-w-2xl mx-auto">
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              1
            </span>
            <span className="text-sm font-semibold text-slate-800 hidden sm:inline">Profile Details</span>
          </div>
          <div className="flex-1 h-[2px] bg-slate-100 mx-4" />
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              2
            </span>
            <span className="text-sm font-semibold text-slate-800 hidden sm:inline">First Vehicle</span>
          </div>
          <div className="flex-1 h-[2px] bg-slate-100 mx-4" />
          <div className="flex items-center gap-2">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 3 ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              3
            </span>
            <span className="text-sm font-semibold text-slate-800 hidden sm:inline">Verification</span>
          </div>
        </div>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">{submitError}</div>
        )}

        {/* STEP 1: CUSTOMER DETAILS */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Customer Account</h3>
                <p className="text-xs text-slate-400">Fill in details to provision a customer login</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (validateCustomer()) setStep(2);
              }}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={customer.firstName}
                    onChange={handleCustomerChange}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                      errors.firstName ? "border-red-400" : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={customer.lastName}
                    onChange={handleCustomerChange}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                      errors.lastName ? "border-red-400" : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={customer.email}
                  onChange={handleCustomerChange}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                    errors.email ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Default Password *</label>
                <input
                  type="password"
                  name="password"
                  value={customer.password}
                  onChange={handleCustomerChange}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                    errors.password ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="Min 8 characters"
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number *</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={customer.phoneNumber}
                  onChange={handleCustomerChange}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                    errors.phoneNumber ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="e.g. 98XXXXXXXX"
                />
                {errors.phoneNumber && <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Billing Address *</label>
                <input
                  type="text"
                  name="address"
                  value={customer.address}
                  onChange={handleCustomerChange}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                    errors.address ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="e.g. Tinkune, Kathmandu"
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition shadow-xs"
                >
                  Continue to Vehicle <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: FIRST VEHICLE DETAILS */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                <Car size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">First Vehicle Info</h3>
                <p className="text-xs text-slate-400">At least one vehicle must be registered initially</p>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Registration Number (Plate) *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={vehicle.registrationNumber}
                  onChange={handleVehicleChange}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm uppercase ${
                    errors.registrationNumber ? "border-red-400" : "border-slate-200"
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="e.g. BA-2-PA-8822"
                />
                {errors.registrationNumber && <p className="text-xs text-red-500 mt-1">{errors.registrationNumber}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Make / Brand *</label>
                  <input
                    type="text"
                    name="make"
                    value={vehicle.make}
                    onChange={handleVehicleChange}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                      errors.make ? "border-red-400" : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                    placeholder="e.g. Suzuki, Hyundai"
                  />
                  {errors.make && <p className="text-xs text-red-500 mt-1">{errors.make}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Model Name *</label>
                  <input
                    type="text"
                    name="model"
                    value={vehicle.model}
                    onChange={handleVehicleChange}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                      errors.model ? "border-red-400" : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                    placeholder="e.g. Swift, Creta"
                  />
                  {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Manufacture Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={vehicle.year}
                    onChange={handleVehicleChange}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                      errors.year ? "border-red-400" : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  />
                  {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Current Mileage</label>
                  <input
                    type="number"
                    name="mileage"
                    value={vehicle.mileage}
                    onChange={handleVehicleChange}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Body Color *</label>
                  <input
                    type="text"
                    name="color"
                    value={vehicle.color}
                    onChange={handleVehicleChange}
                    className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                      errors.color ? "border-red-400" : "border-slate-200"
                    } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                    placeholder="e.g. Silver, Black"
                  />
                  {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold inline-flex items-center gap-1.5 cursor-pointer transition"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition shadow-xs"
                >
                  Register Customer <CheckCircle size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: REGISTRATION SUCCESS & OPTIONS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-xs">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={36} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Success!</h2>
              <p className="text-slate-500 mt-2">
                Customer <span className="font-bold text-slate-800">{registeredCustomerName}</span> and their vehicle have been registered in the system.
              </p>

              {successMsg && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm">
                  {successMsg}
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate(`/staff/customers/${registeredCustomerId}/full-profile`)}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                >
                  View Customer Profile <ArrowRight size={16} />
                </button>
                {!showSecondaryForm && (
                  <button
                    onClick={() => {
                      setShowSecondaryForm(true);
                      setSuccessMsg("");
                    }}
                    className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition shadow-xs"
                  >
                    <Plus size={16} /> Add Second Vehicle
                  </button>
                )}
                <button
                  onClick={() => {
                    setCustomer({
                      firstName: "",
                      lastName: "",
                      email: "",
                      password: "",
                      phoneNumber: "",
                      address: "",
                    });
                    setVehicle({
                      registrationNumber: "",
                      make: "",
                      model: "",
                      year: new Date().getFullYear().toString(),
                      mileage: "0",
                      color: "",
                    });
                    setSuccessMsg("");
                    setStep(1);
                  }}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm font-semibold inline-flex items-center justify-center cursor-pointer transition"
                >
                  Register Another Client
                </button>
              </div>
            </div>

            {/* SECONDARY VEHICLE FORM */}
            {showSecondaryForm && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <h3 className="font-bold text-slate-800 text-lg mb-4 inline-flex items-center gap-2">
                  <Car size={20} className="text-sky-600" /> Add Additional Vehicle
                </h3>
                <form onSubmit={handleAddSecondaryVehicle} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Registration Number (Plate) *
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={secondaryVehicle.registrationNumber}
                      onChange={handleSecondaryChange}
                      className={`w-full px-3 py-2.5 border rounded-xl text-sm uppercase ${
                        errors.registrationNumber ? "border-red-400" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      placeholder="e.g. BA-3-PA-9900"
                    />
                    {errors.registrationNumber && <p className="text-xs text-red-500 mt-1">{errors.registrationNumber}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Make / Brand *</label>
                      <input
                        type="text"
                        name="make"
                        value={secondaryVehicle.make}
                        onChange={handleSecondaryChange}
                        className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                          errors.make ? "border-red-400" : "border-slate-200"
                        } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      />
                      {errors.make && <p className="text-xs text-red-500 mt-1">{errors.make}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Model Name *</label>
                      <input
                        type="text"
                        name="model"
                        value={secondaryVehicle.model}
                        onChange={handleSecondaryChange}
                        className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                          errors.model ? "border-red-400" : "border-slate-200"
                        } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      />
                      {errors.model && <p className="text-xs text-red-500 mt-1">{errors.model}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Manufacture Year *</label>
                      <input
                        type="number"
                        name="year"
                        value={secondaryVehicle.year}
                        onChange={handleSecondaryChange}
                        className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                          errors.year ? "border-red-400" : "border-slate-200"
                        } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      />
                      {errors.year && <p className="text-xs text-red-500 mt-1">{errors.year}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Current Mileage</label>
                      <input
                        type="number"
                        name="mileage"
                        value={secondaryVehicle.mileage}
                        onChange={handleSecondaryChange}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Body Color *</label>
                      <input
                        type="text"
                        name="color"
                        value={secondaryVehicle.color}
                        onChange={handleSecondaryChange}
                        className={`w-full px-3 py-2.5 border rounded-xl text-sm ${
                          errors.color ? "border-red-400" : "border-slate-200"
                        } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                      />
                      {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSecondaryForm(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold cursor-pointer transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-semibold cursor-pointer transition shadow-xs"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffLayout>
  );
}
