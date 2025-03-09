import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  ...props
}) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`
          appearance-none
          w-full
          px-4
          py-2
          bg-white
          border
          border-gray-300
          rounded-md
          shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-blue-500
          ${className}
        `}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
    </div>
  );
};

export default Select;