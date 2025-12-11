import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationPreferences } from '../types/mobile-article';
import { DEFAULT_VALUES } from '../services/storage/keys';

interface UserPreferencesStore {
  // Notification preferences
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => void;

  // Theme mode
  themeMode: 'light' | 'dark' | 'auto';
  setThemeMode: (mode: 'light' | 'dark' | 'auto') => void;

  // Articles per page
  articlesPerPage: number;
  setArticlesPerPage: (count: number) => void;

  // Onboarding
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;

  // Notification permission
  notificationPermissionAsked: boolean;
  setNotificationPermissionAsked: (asked: boolean) => void;

  // Reset
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

      // Update notification preferences
      updateNotificationPreferences: (preferences: Partial<NotificationPreferences>) => {
        set(state => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...preferences,
          },
        }));
      },

      // Set theme mode
      setThemeMode: (mode: 'light' | 'dark' | 'auto') => {
        set({ themeMode: mode });
      },

      // Set articles per page
      setArticlesPerPage: (count: number) => {
        if (count < 10 || count > 100) {
          console.warn('Articles per page must be between 10 and 100');
          return;
        }
        set({ articlesPerPage: count });
      },

      // Set onboarding completion
      setHasCompletedOnboarding: (completed: boolean) => {
        set({ hasCompletedOnboarding: completed });
      },

      // Set notification permission asked
      setNotificationPermissionAsked: (asked: boolean) => {
        set({ notificationPermissionAsked: asked });
      },

      // Reset preferences to defaults
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
