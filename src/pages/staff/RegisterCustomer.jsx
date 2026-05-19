import React from "react";
import StaffLayout from "../../components/StaffLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UserPlus, Save, Car, MapPin, Phone, Mail, User } from "lucide-react";

const schema = yup.object({
  fullName: yup.string().required("Full name is required").min(3, "Name must be at least 3 characters"),
  phone: yup.string().required("Phone number is required").matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  email: yup.string().email("Must be a valid email").optional(),
  address: yup.string().required("Address is required"),
  vehicleMake: yup.string().required("Vehicle make (e.g. Toyota) is required"),
  vehicleModel: yup.string().required("Vehicle model (e.g. Prado) is required"),
  licensePlate: yup.string().required("License Plate number is required"),
}).required();

export default function RegisterCustomer() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = (data) => {
    // We would normally POST to API here
    console.log("Customer Data Submitted:", data);
    alert("Customer Registered Successfully!");
    reset();
  };

  return (
    <StaffLayout pageTitle="Register Customer" subtitle="Onboard a new customer and their primary vehicle into the system.">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">New Customer Registration</h2>
              <p className="text-sm text-slate-500">Please fill out all mandatory fields carefully.</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
            {/* Personal Details Section */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      {...register("fullName")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.fullName ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200'} rounded-xl focus:outline-hidden focus:ring-4 transition-all text-sm`}
                      placeholder="e.g. Rajesh Hamal"
                    />
                  </div>
                  {errors.fullName && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      {...register("phone")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.phone ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200'} rounded-xl focus:outline-hidden focus:ring-4 transition-all text-sm`}
                      placeholder="e.g. 9840000000"
                    />
                  </div>
                  {errors.phone && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      {...register("email")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.email ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200'} rounded-xl focus:outline-hidden focus:ring-4 transition-all text-sm`}
                      placeholder="e.g. rajesh@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Home Address *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      {...register("address")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.address ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200'} rounded-xl focus:outline-hidden focus:ring-4 transition-all text-sm`}
                      placeholder="e.g. Baneshwor, Kathmandu"
                    />
                  </div>
                  {errors.address && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.address.message}</p>}
                </div>
              </div>
            </div>

            {/* Vehicle Details Section */}
            <div className="space-y-6 pt-2 border-t border-dashed border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide">Primary Vehicle Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Make *</label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      {...register("vehicleMake")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.vehicleMake ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200'} rounded-xl focus:outline-hidden focus:ring-4 transition-all text-sm`}
                      placeholder="e.g. Toyota"
                    />
                  </div>
                  {errors.vehicleMake && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.vehicleMake.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Model *</label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 opacity-50" />
                    <input 
                      {...register("vehicleModel")}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border ${errors.vehicleModel ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200'} rounded-xl focus:outline-hidden focus:ring-4 transition-all text-sm`}
                      placeholder="e.g. Land Cruiser"
                    />
                  </div>
                  {errors.vehicleModel && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.vehicleModel.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">License Plate *</label>
                  <input 
                    {...register("licensePlate")}
                    className={`w-full px-4 py-2.5 bg-white border ${errors.licensePlate ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200'} rounded-xl focus:outline-hidden focus:ring-4 transition-all text-sm uppercase`}
                    placeholder="e.g. BA 1 CHA 1234"
                  />
                  {errors.licensePlate && <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.licensePlate.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                Register Customer
              </button>
            </div>
          </form>
        </div>
      </div>
    </StaffLayout>
  );
}
