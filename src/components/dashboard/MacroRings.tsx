import React from 'react';

interface MacroRingProps {
  current: number;
  target: number;
  label: string;
  color: string;
}

const MacroRing: React.FC<MacroRingProps> = ({ current, target, label, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="transform -rotate-90 w-24 h-24">
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="48"
            cy="48"
            r="45"
            stroke={color}
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color }}>
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        <div className="text-xs text-gray-500">
          {Math.round(current)}g / {Math.round(target)}g
        </div>
      </div>
    </div>
  );
};

interface MacroRingsProps {
  protein: { current: number; target: number; percentage: number };
  carbs: { current: number; target: number; percentage: number };
  fat: { current: number; target: number; percentage: number };
}

export const MacroRings: React.FC<MacroRingsProps> = ({ protein, carbs, fat }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <MacroRing
        current={protein.current}
        target={protein.target}
        label="Protein"
        color="#3b82f6"
      />
      <MacroRing
        current={carbs.current}
        target={carbs.target}
        label="Carbs"
        color="#f97316"
      />
      <MacroRing
        current={fat.current}
        target={fat.target}
        label="Fat"
        color="#22c55e"
      />
    </div>
  );
};

