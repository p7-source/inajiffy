import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMealStore } from '../../store/mealStore';
import { useUserStore } from '../../store/userStore';
import { compressImage } from '../../utils/imageCompression';
import { analyzeMeal } from '../../utils/mockAI';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ProgressBar } from '../shared/ProgressBar';

export const CameraView: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();
  
  const { getTodaysProgress } = useMealStore();
  const { profile } = useUserStore();
  const progress = getTodaysProgress();
  
  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsAnalyzing(true);
      
      // Compress image
      const compressedBlob = await compressImage(file);
      
      // Analyze meal
      const analysis = await analyzeMeal(compressedBlob);
      
      // Navigate to results with analysis data
      navigate('/results', { 
        state: { 
          analysis, 
          imageBlob: compressedBlob,
          imageUrl: URL.createObjectURL(compressedBlob),
        } 
      });
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Couldn\'t analyze photo. Try taking another?');
    } finally {
      setIsAnalyzing(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-black bg-opacity-60 backdrop-blur-sm h-16 flex items-center justify-between px-4 text-white z-10">
        <h1 className="text-xl font-bold">Meal Tracker</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          aria-label="Dashboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
      </div>
      
      {/* Camera Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-800 relative">
        {isAnalyzing ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
            <div className="text-center text-white">
              <LoadingSpinner size="lg" text="Analyzing your meal..." />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-64 h-64 mx-auto bg-gray-700 rounded-2xl flex items-center justify-center mb-4 border-4 border-dashed border-gray-500">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-white text-lg font-medium">Tap to take a photo of your meal</p>
            </div>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
        />
      </div>
      
      {/* Bottom Section */}
      <div className="bg-black bg-opacity-60 backdrop-blur-sm p-6 text-white">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Today's Progress</span>
            <span className="text-lg font-bold">
              {Math.round(progress.calories.current)} / {Math.round(progress.calories.target)} cal
            </span>
          </div>
          <ProgressBar
            current={progress.calories.current}
            target={progress.calories.target}
            color="green"
            showNumbers={false}
          />
        </div>
        
        <button
          onClick={handleCaptureClick}
          disabled={isAnalyzing}
          className="w-full h-24 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <LoadingSpinner size="md" />
          ) : (
            <span>Capture Meal</span>
          )}
        </button>
      </div>
    </div>
  );
};

