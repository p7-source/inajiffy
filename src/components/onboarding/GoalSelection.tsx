import React, { useState } from 'react';
import { Goal } from '../../types/user.types';
import { OnboardingLayout } from './OnboardingLayout';

interface GoalSelectionProps {
  onSelect: (goal: Goal) => void;
}

const goals: { value: Goal; emoji: string; label: string }[] = [
  { value: 'lose', emoji: '🎯', label: 'Lose Weight' },
  { value: 'maintain', emoji: '⚖️', label: 'Maintain Weight' },
  { value: 'gain', emoji: '💪', label: 'Gain Weight' },
];

export const GoalSelection: React.FC<GoalSelectionProps> = ({ onSelect }) => {
  const [selected, setSelected] = useState<Goal | null>(null);
  
  const handleSelect = (goal: Goal) => {
    setSelected(goal);
    setTimeout(() => {
      onSelect(goal);
    }, 300);
  };
  
  return (
    <OnboardingLayout currentStep={1} totalSteps={3}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          What's your goal?
        </h2>
        
        {goals.map((goal) => (
          <button
            key={goal.value}
            onClick={() => handleSelect(goal.value)}
            className={`w-full h-32 bg-white rounded-xl shadow-md p-6 flex items-center gap-4 transition-all ${
              selected === goal.value
                ? 'ring-4 ring-green-500 scale-105'
                : 'hover:shadow-lg active:scale-95'
            }`}
          >
            <span className="text-4xl">{goal.emoji}</span>
            <span className="text-xl font-semibold text-gray-900 flex-1 text-left">
              {goal.label}
            </span>
          </button>
        ))}
      </div>
    </OnboardingLayout>
  );
};

