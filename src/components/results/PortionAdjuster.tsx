import React, { useState } from 'react';

interface PortionAdjusterProps {
  portionMultiplier: number;
  onAdjust: (multiplier: number) => void;
}

export const PortionAdjuster: React.FC<PortionAdjusterProps> = ({
  portionMultiplier,
  onAdjust,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const multipliers = [0.5, 1.0, 1.5, 2.0];
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-green-600 font-medium hover:underline"
      >
        Adjust Portion
      </button>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Portion Size</span>
        <button
          onClick={() => setIsOpen(false)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Done
        </button>
      </div>
      
      <div className="flex gap-2">
        {multipliers.map((mult) => (
          <button
            key={mult}
            onClick={() => {
              onAdjust(mult);
              setIsOpen(false);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              portionMultiplier === mult
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {mult}x
          </button>
        ))}
      </div>
    </div>
  );
};

