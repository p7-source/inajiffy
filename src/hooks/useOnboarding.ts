import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import { Goal, ActivityLevel, DietaryPreference } from '../types/user.types';

export function useOnboarding() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(null);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { completeOnboarding } = useUserStore();
  const navigate = useNavigate();
  
  const handleGoalSelect = (selectedGoal: Goal) => {
    setGoal(selectedGoal);
    setStep(2);
  };
  
  const handleActivitySelect = (selectedActivity: ActivityLevel) => {
    setActivityLevel(selectedActivity);
    setStep(3);
  };
  
  const handlePreferenceSelect = async (selectedPreference: DietaryPreference) => {
    setDietaryPreference(selectedPreference);
    
    if (goal && activityLevel) {
      try {
        setIsLoading(true);
        await completeOnboarding({
          goal,
          activityLevel,
          dietaryPreference: selectedPreference,
        });
        navigate('/camera');
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        alert('Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return {
    step,
    goal,
    activityLevel,
    dietaryPreference,
    isLoading,
    handleGoalSelect,
    handleActivitySelect,
    handlePreferenceSelect,
  };
}

