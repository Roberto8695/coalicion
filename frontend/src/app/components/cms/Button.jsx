'use client';

export const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'default', 
  isLoading = false, 
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400 border border-red-600 hover:border-red-700';
      case 'outline':
        return 'border border-gray-600 bg-transparent text-gray-200 hover:bg-gray-700 hover:border-gray-500 focus:ring-blue-400';
      case 'secondary':
        return 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-400 border border-gray-600';
      case 'ghost':
        return 'text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-400';
      case 'link':
        return 'text-blue-400 underline-offset-4 hover:underline focus:ring-blue-400 hover:text-blue-300';
      default:
        return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400 border border-blue-600 hover:border-blue-700';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-8 px-3 text-sm';
      case 'lg':
        return 'h-12 px-8';
      case 'icon':
        return 'h-10 w-10';
      default:
        return 'h-10 px-4 py-2';
    }
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:pointer-events-none';

  return (
    <button
      type={type}
      className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};