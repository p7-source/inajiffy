import React from 'react';
import { Meal } from '../../types/meal.types';
import { formatTime } from '../../utils/dateHelpers';

interface MealHistoryProps {
  meals: Meal[];
  onDelete?: (mealId: string) => void;
}

export const MealHistory: React.FC<MealHistoryProps> = ({ meals, onDelete }) => {
  if (meals.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No meals logged today</p>
        <p className="text-sm mt-2">Start tracking by taking a photo!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {meal.imageUrl ? (
              <img
                src={meal.imageUrl}
                alt={meal.mealName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{meal.mealName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-gray-700">
                {meal.macros.calories} cal
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">
                {formatTime(meal.timestamp)}
              </span>
            </div>
          </div>
          
          {onDelete && (
            <button
              onClick={() => onDelete(meal.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete meal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

