import React from 'react';

/**
 * Reusable Button Component
 * Minimalist dark style as per reference
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
  const baseStyles = "relative flex items-center justify-center px-6 py-3.5 rounded-md font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest";
  
  const variants = {
    primary: "bg-[#1a1a1a] hover:bg-black text-white shadow-sm",
    secondary: "bg-white hover:bg-slate-50 text-slate-900 border border-slate-200",
    outline: "bg-transparent border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white",
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
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>PROCESSING...</span>
        </div>
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
};

export default Button;
