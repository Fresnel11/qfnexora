import React from 'react';

const Input = ({ 
  type = 'text', 
  placeholder = '', 
  className = '', 
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${className}`}
      {...props}
    />
  );
};

export default Input;