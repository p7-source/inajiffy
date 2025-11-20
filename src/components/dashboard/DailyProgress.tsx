import React from 'react';
import { ProgressBar } from '../shared/ProgressBar';

interface DailyProgressProps {
  calories: { current: number; target: number; percentage: number };
}

export const DailyProgress: React.FC<DailyProgressProps> = ({ calories }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-gray-900">
            {Math.round(calories.current)}
          </span>
          <span className="text-xl text-gray-500">
            / {Math.round(calories.target)} cal
          </span>
        </div>
        <ProgressBar
          current={calories.current}
          target={calories.target}
          color="green"
          showNumbers={false}
        />
        <div className="text-right text-sm text-gray-600 mt-1">
          {Math.round(calories.percentage)}% of daily goal
        </div>
      </div>
    </div>
  );
};

