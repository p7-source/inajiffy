import React from 'react';
import { OnboardingProgress } from './OnboardingProgress';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

export const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <OnboardingProgress currentStep={currentStep} totalSteps={totalSteps} />
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
};

