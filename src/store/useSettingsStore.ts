import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'ko' | 'id';
type Theme = 'light' | 'dark' | 'system';

interface SettingsState {
  language: Language;
  theme: Theme;
  notificationsEnabled: boolean;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      language: 'en',
      theme: 'system',
      notificationsEnabled: true,
      setLanguage: language => set({language}),
      setTheme: theme => set({theme}),
      toggleNotifications: () =>
        set(state => ({notificationsEnabled: !state.notificationsEnabled})),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
