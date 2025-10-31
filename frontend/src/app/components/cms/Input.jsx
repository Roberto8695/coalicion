'use client';

import { useState } from 'react';

export const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const baseClasses = 'w-full px-3 py-2 border rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent';
  const errorClasses = error 
    ? 'border-red-400 focus:ring-red-400 bg-red-50 text-red-900' 
    : 'border-gray-600 bg-gray-700 text-white placeholder-gray-400';
  const disabledClasses = disabled 
    ? 'bg-gray-600 cursor-not-allowed opacity-50' 
    : 'hover:border-gray-500';

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${baseClasses} ${errorClasses} ${disabledClasses} resize-none`}
            rows={4}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="text-gray-400">
                {placeholder}
              </option>
            )}
            {props.options?.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-700 text-white">
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`${baseClasses} ${errorClasses} ${disabledClasses}`}
            {...props}
          />
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-400 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};