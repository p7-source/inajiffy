import { create } from 'zustand';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { UserProfile, Goal, ActivityLevel, DietaryPreference } from '../types/user.types';
import { calculateDailyTargets } from '../utils/macroCalculator';
import { useAuthStore } from './authStore';

interface UserState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  isLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (data: {
    goal: Goal;
    activityLevel: ActivityLevel;
    dietaryPreference: DietaryPreference;
  }) => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isOnboarded: false,
  isLoading: false,
  
  updateProfile: async (data: Partial<UserProfile>) => {
    const { profile } = get();
    if (!profile) throw new Error('No user profile found');
    
    try {
      set({ isLoading: true });
      const updatedProfile = { ...profile, ...data };
      await setDoc(doc(db, 'users', profile.userId), {
        ...updatedProfile,
        createdAt: profile.createdAt,
      }, { merge: true });
      
      set({ profile: updatedProfile });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    } finally {
      set({ isLoading: false });
    }
  },
  
  completeOnboarding: async (data) => {
    const { profile } = get();
    const authUser = useAuthStore.getState().user;
    
    if (!authUser) throw new Error('User not authenticated');
    
    try {
      set({ isLoading: true });
      const dailyTargets = calculateDailyTargets(
        data.goal,
        data.activityLevel,
        data.dietaryPreference
      );
      
      const updatedProfile: UserProfile = {
        userId: authUser.uid,
        email: authUser.email || '',
        onboardingComplete: true,
        ...data,
        dailyTargets,
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, 'users', authUser.uid), {
        ...updatedProfile,
        createdAt: serverTimestamp(),
      });
      
      set({ 
        profile: updatedProfile, 
        isOnboarded: true 
      });
    } catch (error: any) {
      throw new Error(error.message || 'Failed to complete onboarding');
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchProfile: async (userId: string) => {
    try {
      set({ isLoading: true });
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const profile: UserProfile = {
          userId: data.userId,
          email: data.email,
          onboardingComplete: data.onboardingComplete || false,
          goal: data.goal,
          activityLevel: data.activityLevel,
          dietaryPreference: data.dietaryPreference,
          dailyTargets: data.dailyTargets,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
        
        set({ 
          profile, 
          isOnboarded: profile.onboardingComplete 
        });
      } else {
        // Profile doesn't exist - will be created during onboarding
        set({ 
          profile: null, 
          isOnboarded: false 
        });
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch profile');
    } finally {
      set({ isLoading: false });
    }
  },
}));

