import { Goal, ActivityLevel, DailyTargets } from '../types/user.types';

// Activity multipliers
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
};

// Simplified BMR calculation (using average baseline)
// In production, you'd calculate based on actual weight, height, age, gender
const BASELINE_BMR = 1500; // Approximate BMR for average person

export function calculateDailyTargets(
  goal: Goal,
  activityLevel: ActivityLevel,
  dietaryPreference: string
): DailyTargets {
  // Calculate TDEE (Total Daily Energy Expenditure)
  const activityMultiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  let tdee = BASELINE_BMR * activityMultiplier;

  // Adjust TDEE based on goal
  switch (goal) {
    case 'lose':
      tdee -= 500; // 500 calorie deficit
      break;
    case 'maintain':
      // No adjustment
      break;
    case 'gain':
      tdee += 300; // 300 calorie surplus
      break;
  }

  // Ensure minimum calories
  tdee = Math.max(tdee, 1200);

  // Calculate macros (30% protein, 40% carbs, 30% fat)
  const proteinCalories = tdee * 0.3;
  const carbsCalories = tdee * 0.4;
  const fatCalories = tdee * 0.3;

  // Convert calories to grams
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  const protein = Math.round(proteinCalories / 4);
  const carbs = Math.round(carbsCalories / 4);
  const fat = Math.round(fatCalories / 9);

  return {
    calories: Math.round(tdee),
    protein,
    carbs,
    fat,
  };
}

