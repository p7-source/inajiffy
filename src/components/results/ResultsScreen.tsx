import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMealStore } from '../../store/mealStore';
import { useAuthStore } from '../../store/authStore';
import { MealAnalysis } from '../../types/meal.types';
import { MacroDisplay } from './MacroDisplay';
import { PortionAdjuster } from './PortionAdjuster';
import { ActionButtons } from './ActionButtons';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface ResultsScreenLocationState {
  analysis: MealAnalysis;
  imageUrl: string;
  imageBlob: Blob;
}

export const ResultsScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addMeal } = useMealStore();
  
  const state = location.state as ResultsScreenLocationState;
  
  if (!state?.analysis) {
    navigate('/camera');
    return null;
  }
  
  const { analysis, imageUrl } = state;
  const [portionMultiplier, setPortionMultiplier] = useState(analysis.portionSize);
  const [isSaving, setIsSaving] = useState(false);
  
  const adjustedMacros = {
    calories: Math.round(analysis.macros.calories * portionMultiplier),
    protein: Math.round(analysis.macros.protein * portionMultiplier),
    carbs: Math.round(analysis.macros.carbs * portionMultiplier),
    fat: Math.round(analysis.macros.fat * portionMultiplier),
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      await addMeal({
        userId: user.uid,
        mealName: analysis.mealName,
        macros: adjustedMacros,
        portionMultiplier,
        imageUrl: undefined, // Could upload to Firebase Storage here
      });
      
      // Show success feedback
      setTimeout(() => {
        navigate('/camera');
      }, 1000);
    } catch (error) {
      console.error('Failed to save meal:', error);
      alert('Failed to save meal. Please try again.');
      setIsSaving(false);
    }
  };
  
  const handleSkip = () => {
    navigate('/camera');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Meal Photo */}
        <div className="w-full h-64 bg-gray-200 overflow-hidden">
          <img
            src={imageUrl}
            alt={analysis.mealName}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Meal Info */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {analysis.mealName}
            </h2>
            <p className="text-sm text-gray-500">
              {Math.round(analysis.confidence * 100)}% confident
            </p>
          </div>
          
          {/* Macros */}
          <MacroDisplay macros={analysis.macros} portionMultiplier={portionMultiplier} />
          
          {/* Portion Adjuster */}
          <PortionAdjuster
            portionMultiplier={portionMultiplier}
            onAdjust={setPortionMultiplier}
          />
          
          {/* Action Buttons */}
          <ActionButtons
            onSkip={handleSkip}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

