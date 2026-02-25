import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  user: {
    id: string;
    email?: string;
    walletAddress?: string;
  } | null;
  login: (user: AuthState['user']) => void;
  logout: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      user: null,
      login: user => set({isAuthenticated: true, user}),
      logout: () => set({isAuthenticated: false, user: null}),
      completeOnboarding: () => set({hasCompletedOnboarding: true}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
