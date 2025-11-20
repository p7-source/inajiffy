import React from 'react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { GoalSelection } from './GoalSelection';
import { ActivityLevel } from './ActivityLevel';
import { DietaryPreference } from './DietaryPreference';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const OnboardingPage: React.FC = () => {
  const {
    step,
    isLoading,
    handleGoalSelect,
    handleActivitySelect,
    handlePreferenceSelect,
  } = useOnboarding();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Setting up your profile..." />
      </div>
    );
  }
  
  switch (step) {
    case 1:
      return <GoalSelection onSelect={handleGoalSelect} />;
    case 2:
      return <ActivityLevel onSelect={handleActivitySelect} />;
    case 3:
      return <DietaryPreference onSelect={handlePreferenceSelect} />;
    default:
      return <GoalSelection onSelect={handleGoalSelect} />;
  }
};

