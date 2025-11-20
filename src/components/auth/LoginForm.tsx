import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { AuthLayout } from './AuthLayout';
import { Button } from '../shared/Button';
import { LoadingSpinner } from '../shared/LoadingSpinner';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const { fetchProfile } = useUserStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsLoading(true);
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user) {
        await fetchProfile(user.uid);
        const profile = useUserStore.getState().profile;
        if (profile?.onboardingComplete) {
          navigate('/camera');
        } else {
          navigate('/onboarding');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Log in to continue tracking"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            placeholder="your@email.com"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          fullWidth 
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Log In'}
        </Button>
        
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-600 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

