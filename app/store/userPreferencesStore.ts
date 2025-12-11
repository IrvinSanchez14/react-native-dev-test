import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationPreferences } from '../types/mobile-article';
import { DEFAULT_VALUES } from '../services/storage/keys';

interface UserPreferencesStore {
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => void;

  themeMode: 'light' | 'dark' | 'auto';
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;

  articlesPerPage: number;
  setArticlesPerPage: (count: number) => void;

  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;

  notificationPermissionAsked: boolean;
  setNotificationPermissionAsked: (asked: boolean) => void;

  resetPreferences: () => void;
}

const initialState = {
  notificationPreferences: DEFAULT_VALUES.NOTIFICATION_PREFERENCES,
  themeMode: DEFAULT_VALUES.THEME_MODE,
  articlesPerPage: DEFAULT_VALUES.ARTICLES_PER_PAGE,
  hasCompletedOnboarding: DEFAULT_VALUES.HAS_COMPLETED_ONBOARDING,
  notificationPermissionAsked: DEFAULT_VALUES.NOTIFICATION_PERMISSION_ASKED,
};

export const useUserPreferencesStore = create<UserPreferencesStore>()(
  persist(
    set => ({
      ...initialState,

      updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => {
        set(state => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...preferences,
          },
        }));
      },

      setThemeMode: (mode: 'light' | 'dark' | 'auto') => {
        set({ themeMode: mode });
      },

      setArticlesPerPage: (count: number) => {
        if (count < 10 || count > 100) {
          return;
        }
        set({ articlesPerPage: count });
      },

      setHasCompletedOnboarding: (completed: boolean) => {
        set({ hasCompletedOnboarding: completed });
      },

      setNotificationPermissionAsked: (asked: boolean) => {
        set({ notificationPermissionAsked: asked });
      },

      resetPreferences: () => {
        set(initialState);
      },
    }),
    {
      name: 'user-preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
