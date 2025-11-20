import React, { useState } from 'react';
import { ActivityLevel } from '../../types/user.types';
import { OnboardingLayout } from './OnboardingLayout';

interface ActivityLevelProps {
  onSelect: (level: ActivityLevel) => void;
}

const activities: { value: ActivityLevel; emoji: string; label: string; description: string }[] = [
  { 
    value: 'sedentary', 
    emoji: '🪑', 
    label: 'Sedentary',
    description: 'Little to no exercise'
  },
  { 
    value: 'light', 
    emoji: '🚶', 
    label: 'Lightly Active',
    description: 'Exercise 1-3 days/week'
  },
  { 
    value: 'moderate', 
    emoji: '🏃', 
    label: 'Moderately Active',
    description: 'Exercise 3-5 days/week'
  },
  { 
    value: 'very_active', 
    emoji: '💪', 
    label: 'Very Active',
    description: 'Exercise 6-7 days/week'
  },
];

export const ActivityLevel: React.FC<ActivityLevelProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<ActivityLevel | null>(null);
  
  const handleSelect = (level: ActivityLevel) => {
    setSelected(level);
    setTimeout(() => {
      onSelect(level);
    }, 300);
  };
  
  return (
    <OnboardingLayout currentStep={2} totalSteps={3}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          How active are you?
        </h2>
        
        {activities.map((activity) => (
          <button
            key={activity.value}
            onClick={() => handleSelect(activity.value)}
            className={`w-full h-32 bg-white rounded-xl shadow-md p-6 flex items-center gap-4 transition-all ${
              selected === activity.value
                ? 'ring-4 ring-green-500 scale-105'
                : 'hover:shadow-lg active:scale-95'
            }`}
          >
            <span className="text-4xl">{activity.emoji}</span>
            <div className="flex-1 text-left">
              <div className="text-xl font-semibold text-gray-900">
                {activity.label}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {activity.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
};

