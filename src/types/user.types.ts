export type Goal = 'lose' | 'maintain' | 'gain';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active';
export type DietaryPreference = 'none' | 'vegetarian' | 'vegan' | 'keto' | 'halal';

export interface DailyTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  userId: string;
  email: string;
  onboardingComplete: boolean;
  goal: Goal;
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  dailyTargets: DailyTargets;
  createdAt: Date;
}

