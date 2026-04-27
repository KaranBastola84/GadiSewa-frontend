import React from 'react';

/**
 * Reusable Input Component
 * @param {Object} props - label, type, name, value, onChange, error, placeholder, icon: IconComponent, togglePassword
 */
const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  error, 
  placeholder, 
  icon: Icon, 
  togglePassword,
  required = false 
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-400 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full bg-slate-900/50 border ${
            error ? 'border-red-500' : 'border-slate-700'
          } rounded-lg py-2.5 ${Icon ? 'pl-10' : 'px-4'} ${
            togglePassword ? 'pr-10' : 'pr-4'
          } text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
        />
        {togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {type === 'password' ? 'Show' : 'Hide'}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default Input;
