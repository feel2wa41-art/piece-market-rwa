import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types/user';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  completeOnboarding: () => void;
  loginAsDemoUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      user: null,
      login: user => set({isAuthenticated: true, hasCompletedOnboarding: true, user}),
      logout: () => set({isAuthenticated: false, user: null}),
      completeOnboarding: () => set({hasCompletedOnboarding: true}),
      loginAsDemoUser: user =>
        set({isAuthenticated: true, hasCompletedOnboarding: true, user}),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
