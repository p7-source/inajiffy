import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useUserStore } from './store/userStore';
import { SignupForm } from './components/auth/SignupForm';
import { LoginForm } from './components/auth/LoginForm';
import { OnboardingPage } from './components/onboarding/OnboardingPage';
import { CameraView } from './components/camera/CameraView';
import { ResultsScreen } from './components/results/ResultsScreen';
import { DashboardView } from './components/dashboard/DashboardView';
import { LoadingSpinner } from './components/shared/LoadingSpinner';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Onboarding Route Component
const OnboardingRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { profile, isOnboarded, fetchProfile } = useUserStore();
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated && user && !profile) {
      fetchProfile(user.uid);
    }
  }, [isAuthenticated, user, profile, fetchProfile]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (isOnboarded) {
    return <Navigate to="/camera" replace />;
  }
  
  return <OnboardingPage />;
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuthStore();
  const { profile, isOnboarded, fetchProfile } = useUserStore();
  
  useEffect(() => {
    if (isAuthenticated && user && !profile) {
      fetchProfile(user.uid);
    }
  }, [isAuthenticated, user, profile, fetchProfile]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/login" element={<LoginForm />} />
      
      {/* Protected Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingRoute />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/camera"
        element={
          <ProtectedRoute>
            {isOnboarded ? <CameraView /> : <Navigate to="/onboarding" replace />}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            {isOnboarded ? <ResultsScreen /> : <Navigate to="/onboarding" replace />}
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {isOnboarded ? <DashboardView /> : <Navigate to="/onboarding" replace />}
          </ProtectedRoute>
        }
      />
      
      {/* Default Route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isOnboarded ? (
              <Navigate to="/camera" replace />
            ) : (
              <Navigate to="/onboarding" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

