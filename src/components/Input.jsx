import React from "react";

/**
 * Reusable Input Component
 * Clean, modern style with support for light/dark themes
 */
const Input = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  icon: Icon,
  togglePassword,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider ml-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
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
          className={`w-full bg-white border ${
            error ? "border-red-500" : "border-slate-200"
          } rounded-md py-3 ${Icon ? "pl-10" : "px-4"} ${
            togglePassword ? "pr-10" : "pr-4"
          } text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-slate-900 transition-all text-sm`}
        />
        {togglePassword && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors text-xs font-medium"
          >
            {type === "password" ? "SHOW" : "HIDE"}
          </button>
        )}
      </div>
      {error && (
        <span className="text-[11px] text-red-500 mt-0.5 ml-1 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
