import { create } from 'zustand';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthState: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Set up auth state listener
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  });

  return {
    user: null,
    isLoading: true,
    isAuthenticated: false,
    
    login: async (email: string, password: string) => {
      try {
        set({ isLoading: true });
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(error.message || 'Failed to log in');
      }
    },
    
    signup: async (email: string, password: string) => {
      try {
        set({ isLoading: true });
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error: any) {
        set({ isLoading: false });
        throw new Error(error.message || 'Failed to create account');
      }
    },
    
    logout: async () => {
      try {
        await signOut(auth);
        set({ user: null, isAuthenticated: false });
      } catch (error: any) {
        throw new Error(error.message || 'Failed to log out');
      }
    },
    
    checkAuthState: () => {
      // Auth state is handled by onAuthStateChanged
      set({ isLoading: false });
    },
  };
});

