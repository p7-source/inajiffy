import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealStore } from '../../store/mealStore';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { DailyProgress } from './DailyProgress';
import { MacroRings } from './MacroRings';
import { MealHistory } from './MealHistory';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { formatDate, formatTime } from '../../utils/dateHelpers';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { profile } = useUserStore();
  const { todaysMeals, todaysTotals, fetchTodaysMeals, deleteMeal, getTodaysProgress, isLoading } = useMealStore();
  const progress = getTodaysProgress();
  
  useEffect(() => {
    if (user && profile?.dailyTargets) {
      fetchTodaysMeals(user.uid, profile.dailyTargets);
    }
  }, [user, profile]);
  
  const handleDeleteMeal = async (mealId: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await deleteMeal(mealId);
      } catch (error) {
        console.error('Failed to delete meal:', error);
        alert('Failed to delete meal. Please try again.');
      }
    }
  };
  
  if (isLoading && !todaysTotals) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your progress..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
          </div>
          <button
            onClick={() => navigate('/camera')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Back to camera"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Daily Progress */}
          <DailyProgress calories={progress.calories} />
          
          {/* Macro Rings */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Macros</h3>
            <MacroRings
              protein={progress.protein}
              carbs={progress.carbs}
              fat={progress.fat}
            />
          </div>
          
          {/* Meal History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Meals</h3>
            <MealHistory meals={todaysMeals} onDelete={handleDeleteMeal} />
          </div>
          
          {/* Back to Camera Button */}
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/camera')}
          >
            Back to Camera
          </Button>
        </div>
      </div>
    </div>
  );
};

