import React from 'react';

interface ProgressBarProps {
  progress: number;
  isOverBudget?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  isOverBudget = false 
}) => {
  return (
    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${
          isOverBudget 
            ? 'bg-tertiary' 
            : 'bg-gradient-to-r from-primary to-secondary'
        }`}
        style={{ width: `${Math.min(100, progress)}%` }}
      />
    </div>
  );
};

export default ProgressBar;