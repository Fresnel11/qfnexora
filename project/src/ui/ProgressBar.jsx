import React from 'react';

const ProgressBar = ({ value, max, className = '', color = 'emerald', ...props }) => {
  const percentage = (value / max) * 100;
  
  const colors = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 ${className}`} {...props}>
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${colors[color]}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;