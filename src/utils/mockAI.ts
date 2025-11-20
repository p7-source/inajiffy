import { MealAnalysis } from '../types/meal.types';

const MOCK_MEALS = [
  { name: "Grilled Chicken Salad", cal: 450, p: 38, c: 22, f: 18 },
  { name: "Salmon with Rice", cal: 620, p: 42, c: 55, f: 22 },
  { name: "Protein Shake", cal: 320, p: 35, c: 28, f: 8 },
  { name: "Oatmeal with Berries", cal: 380, p: 12, c: 62, f: 10 },
  { name: "Turkey Sandwich", cal: 490, p: 32, c: 48, f: 16 },
  { name: "Greek Yogurt Bowl", cal: 280, p: 20, c: 35, f: 6 },
  { name: "Beef Stir Fry", cal: 550, p: 45, c: 40, f: 24 },
  { name: "Avocado Toast", cal: 320, p: 10, c: 38, f: 16 },
  { name: "Pasta with Meatballs", cal: 680, p: 38, c: 75, f: 22 },
  { name: "Caesar Salad", cal: 420, p: 18, c: 25, f: 28 },
];

export async function analyzeMeal(imageBlob: Blob): Promise<MealAnalysis> {
  // Simulate API delay (2-3 seconds)
  const delay = 2000 + Math.random() * 1000;
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Return randomized realistic data
  const meal = MOCK_MEALS[Math.floor(Math.random() * MOCK_MEALS.length)];
  
  return {
    mealName: meal.name,
    confidence: 0.75 + Math.random() * 0.2, // 75-95% confidence
    macros: {
      calories: meal.cal,
      protein: meal.p,
      carbs: meal.c,
      fat: meal.f,
    },
    detectedItems: meal.name.split(' '),
    portionSize: 1.0,
  };
}

