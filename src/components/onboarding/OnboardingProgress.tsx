import React from 'react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="text-center mb-6">
      <p className="text-sm font-medium text-gray-600 mb-2">
        Step {currentStep} of {totalSteps}
      </p>
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index + 1 <= currentStep
                ? 'bg-green-600 w-8'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

