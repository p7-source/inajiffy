import React from 'react';
import { Macros } from '../../types/meal.types';

interface MacroDisplayProps {
  macros: Macros;
  portionMultiplier?: number;
}

export const MacroDisplay: React.FC<MacroDisplayProps> = ({
  macros,
  portionMultiplier = 1.0,
}) => {
  const adjustedMacros = {
    calories: Math.round(macros.calories * portionMultiplier),
    protein: Math.round(macros.protein * portionMultiplier),
    carbs: Math.round(macros.carbs * portionMultiplier),
    fat: Math.round(macros.fat * portionMultiplier),
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {adjustedMacros.calories}
        </div>
        <div className="text-sm text-gray-500">calories</div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-700 mb-1">
            {adjustedMacros.protein}g
          </div>
          <div className="text-xs font-medium text-blue-600">Protein</div>
        </div>
        
        <div className="bg-orange-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-700 mb-1">
            {adjustedMacros.carbs}g
          </div>
          <div className="text-xs font-medium text-orange-600">Carbs</div>
        </div>
        
        <div className="bg-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700 mb-1">
            {adjustedMacros.fat}g
          </div>
          <div className="text-xs font-medium text-green-600">Fat</div>
        </div>
      </div>
    </div>
  );
};

