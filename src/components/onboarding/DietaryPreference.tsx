import React, { useState } from 'react';
import { DietaryPreference } from '../../types/user.types';
import { OnboardingLayout } from './OnboardingLayout';

interface DietaryPreferenceProps {
  onSelect: (preference: DietaryPreference) => void;
}

const preferences: { value: DietaryPreference; emoji: string; label: string }[] = [
  { value: 'none', emoji: '🍽️', label: 'No Restrictions' },
  { value: 'vegetarian', emoji: '🥗', label: 'Vegetarian' },
  { value: 'vegan', emoji: '🌱', label: 'Vegan' },
  { value: 'keto', emoji: '🥑', label: 'Keto' },
  { value: 'halal', emoji: '☪️', label: 'Halal' },
];

export const DietaryPreference: React.FC<DietaryPreferenceProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<DietaryPreference | null>(null);
  
  const handleSelect = (preference: DietaryPreference) => {
    setSelected(preference);
    setTimeout(() => {
      onSelect(preference);
    }, 300);
  };
  
  return (
    <OnboardingLayout currentStep={3} totalSteps={3}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Any dietary preferences?
        </h2>
        
        {preferences.map((pref) => (
          <button
            key={pref.value}
            onClick={() => handleSelect(pref.value)}
            className={`w-full h-32 bg-white rounded-xl shadow-md p-6 flex items-center gap-4 transition-all ${
              selected === pref.value
                ? 'ring-4 ring-green-500 scale-105'
                : 'hover:shadow-lg active:scale-95'
            }`}
          >
            <span className="text-4xl">{pref.emoji}</span>
            <span className="text-xl font-semibold text-gray-900 flex-1 text-left">
              {pref.label}
            </span>
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
};

