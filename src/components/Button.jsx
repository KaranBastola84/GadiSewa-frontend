import React from 'react';

/**
 * Reusable Button Component
 * @param {Object} props - children, onClick, type, variant, isLoading, disabled, fullWidth
 */
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  isLoading = false, 
  disabled = false,
  fullWidth = true 
}) => {
  const baseStyles = "relative flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-900/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
    outline: "bg-transparent border-2 border-primary-600 text-primary-400 hover:bg-primary-600/10",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-100"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
      
      {/* Glossy overlay effect on hover */}
      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
    </button>
  );
};

export default Button;
