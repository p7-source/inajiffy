export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  userId: string;
  timestamp: Date;
  mealName: string;
  imageUrl?: string;
  macros: Macros;
  portionMultiplier: number;
}

export interface DailyTotal {
  date: string; // YYYY-MM-DD
  userId: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

export interface MealAnalysis {
  mealName: string;
  confidence: number; // 0.0 to 1.0
  macros: Macros;
  detectedItems: string[];
  portionSize: number; // Default: 1.0
}

