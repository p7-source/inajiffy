import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { Meal, DailyTotal } from '../types/meal.types';
import { getTodayDateString } from '../utils/dateHelpers';

interface MealState {
  todaysMeals: Meal[];
  todaysTotals: DailyTotal | null;
  isLoading: boolean;
  addMeal: (meal: Omit<Meal, 'id' | 'timestamp'>) => Promise<void>;
  deleteMeal: (mealId: string) => Promise<void>;
  fetchTodaysMeals: (userId: string, dailyTargets: any) => Promise<void>;
  getTodaysProgress: () => {
    calories: { current: number; target: number; percentage: number };
    protein: { current: number; target: number; percentage: number };
    carbs: { current: number; target: number; percentage: number };
    fat: { current: number; target: number; percentage: number };
  };
}

export const useMealStore = create<MealState>((set, get) => ({
  todaysMeals: [],
  todaysTotals: null,
  isLoading: false,
  
  addMeal: async (mealData) => {
    try {
      set({ isLoading: true });
      const timestamp = new Date();
      
      // Add meal to Firestore
      const mealRef = await addDoc(collection(db, 'meals'), {
        ...mealData,
        timestamp: serverTimestamp(),
      });
      
      const meal: Meal = {
        ...mealData,
        id: mealRef.id,
        timestamp,
      };
      
      // Update daily totals
      const dateString = getTodayDateString();
      const dailyTotalId = `${mealData.userId}_${dateString}`;
      const dailyTotalRef = doc(db, 'dailyTotals', dailyTotalId);
      const dailyTotalDoc = await getDoc(dailyTotalRef);
      
      const { todaysTotals } = get();
      const currentTotals = todaysTotals || {
        date: dateString,
        userId: mealData.userId,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: [],
        targetCalories: 0,
        targetProtein: 0,
        targetCarbs: 0,
        targetFat: 0,
      };
      
      const updatedTotals: DailyTotal = {
        ...currentTotals,
        totalCalories: currentTotals.totalCalories + meal.macros.calories,
        totalProtein: currentTotals.totalProtein + meal.macros.protein,
        totalCarbs: currentTotals.totalCarbs + meal.macros.carbs,
        totalFat: currentTotals.totalFat + meal.macros.fat,
        meals: [...currentTotals.meals, meal],
      };
      
      await setDoc(dailyTotalRef, {
        ...updatedTotals,
        lastUpdated: serverTimestamp(),
      }, { merge: true });
      
      set({ 
        todaysMeals: [...get().todaysMeals, meal],
        todaysTotals: updatedTotals,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add meal');
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteMeal: async (mealId: string) => {
    try {
      set({ isLoading: true });
      const { todaysMeals, todaysTotals } = get();
      const meal = todaysMeals.find(m => m.id === mealId);
      
      if (!meal) throw new Error('Meal not found');
      
      // Delete from Firestore
      await deleteDoc(doc(db, 'meals', mealId));
      
      // Update daily totals
      if (todaysTotals) {
        const updatedTotals: DailyTotal = {
          ...todaysTotals,
          totalCalories: todaysTotals.totalCalories - meal.macros.calories,
          totalProtein: todaysTotals.totalProtein - meal.macros.protein,
          totalCarbs: todaysTotals.totalCarbs - meal.macros.carbs,
          totalFat: todaysTotals.totalFat - meal.macros.fat,
          meals: todaysMeals.filter(m => m.id !== mealId),
        };
        
        const dailyTotalId = `${meal.userId}_${todaysTotals.date}`;
        await setDoc(doc(db, 'dailyTotals', dailyTotalId), {
          ...updatedTotals,
          lastUpdated: serverTimestamp(),
        }, { merge: true });
        
        set({ 
          todaysMeals: todaysMeals.filter(m => m.id !== mealId),
          todaysTotals: updatedTotals,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete meal');
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchTodaysMeals: async (userId: string, dailyTargets: any) => {
    try {
      set({ isLoading: true });
      const dateString = getTodayDateString();
      
      // Fetch meals for today
      const mealsQuery = query(
        collection(db, 'meals'),
        where('userId', '==', userId)
      );
      
      const mealsSnapshot = await getDocs(mealsQuery);
      const allMeals: Meal[] = [];
      
      mealsSnapshot.forEach((doc) => {
        const data = doc.data();
        const mealDate = data.timestamp?.toDate() || new Date();
        if (formatDate(mealDate) === dateString) {
          allMeals.push({
            id: doc.id,
            userId: data.userId,
            timestamp: mealDate,
            mealName: data.mealName,
            imageUrl: data.imageUrl,
            macros: data.macros,
            portionMultiplier: data.portionMultiplier || 1.0,
          });
        }
      });
      
      // Sort by timestamp (newest first)
      allMeals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      // Calculate totals
      const totals = allMeals.reduce(
        (acc, meal) => ({
          totalCalories: acc.totalCalories + meal.macros.calories,
          totalProtein: acc.totalProtein + meal.macros.protein,
          totalCarbs: acc.totalCarbs + meal.macros.carbs,
          totalFat: acc.totalFat + meal.macros.fat,
        }),
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
      );
      
      const dailyTotal: DailyTotal = {
        date: dateString,
        userId,
        ...totals,
        meals: allMeals,
        targetCalories: dailyTargets.calories,
        targetProtein: dailyTargets.protein,
        targetCarbs: dailyTargets.carbs,
        targetFat: dailyTargets.fat,
      };
      
      set({ 
        todaysMeals: allMeals,
        todaysTotals: dailyTotal,
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch meals');
    } finally {
      set({ isLoading: false });
    }
  },
  
  getTodaysProgress: () => {
    const { todaysTotals } = get();
    if (!todaysTotals) {
      return {
        calories: { current: 0, target: 0, percentage: 0 },
        protein: { current: 0, target: 0, percentage: 0 },
        carbs: { current: 0, target: 0, percentage: 0 },
        fat: { current: 0, target: 0, percentage: 0 },
      };
    }
    
    return {
      calories: {
        current: todaysTotals.totalCalories,
        target: todaysTotals.targetCalories,
        percentage: Math.min((todaysTotals.totalCalories / todaysTotals.targetCalories) * 100, 100),
      },
      protein: {
        current: todaysTotals.totalProtein,
        target: todaysTotals.targetProtein,
        percentage: Math.min((todaysTotals.totalProtein / todaysTotals.targetProtein) * 100, 100),
      },
      carbs: {
        current: todaysTotals.totalCarbs,
        target: todaysTotals.targetCarbs,
        percentage: Math.min((todaysTotals.totalCarbs / todaysTotals.targetCarbs) * 100, 100),
      },
      fat: {
        current: todaysTotals.totalFat,
        target: todaysTotals.targetFat,
        percentage: Math.min((todaysTotals.totalFat / todaysTotals.targetFat) * 100, 100),
      },
    };
  },
}));

// Helper function for date formatting
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

