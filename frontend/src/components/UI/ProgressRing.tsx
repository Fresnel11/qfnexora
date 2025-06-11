import React from 'react';

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  isOverBudget?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  isOverBudget = false,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const center = size / 2;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        className="text-gray-300 dark:text-gray-600"
        strokeWidth={strokeWidth}
        stroke="currentColor"
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
      />
      
      {/* Progress circle with gradient */}
      <circle
        className={isOverBudget ? "text-tertiary" : "text-transparent"}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        stroke={isOverBudget ? "currentColor" : "url(#progressGradient)"}
        fill="transparent"
        r={radius}
        cx={center}
        cy={center}
      />
      
      {/* Define gradient */}
      <defs>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#7b2dff" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default ProgressRing;