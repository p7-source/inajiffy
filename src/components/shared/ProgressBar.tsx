import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showNumbers?: boolean;
  color?: 'blue' | 'orange' | 'green' | 'gray';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  showNumbers = true,
  color = 'gray',
}) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    gray: 'bg-gray-500',
  };
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showNumbers && (
            <span className="text-sm font-semibold text-gray-900">
              {Math.round(current)} / {Math.round(target)}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showNumbers && !label && (
        <div className="text-right mt-1 text-xs text-gray-600">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

