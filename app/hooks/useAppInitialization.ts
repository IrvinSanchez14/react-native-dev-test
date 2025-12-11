import { useEffect, useState } from 'react';
import { database } from '../services/database/database';
import { mobileArticleRepository } from '../services/database/mobileArticleRepository';
import { registerBackgroundFetch } from '../services/notifications/backgroundFetch';
import { initializeErrorTracking } from '../services/errorTracking/errorTracker';
import { notificationService } from '../services/notifications/notificationService';
import { useUserPreferencesStore } from '../store/userPreferencesStore';
import { ERROR_TRACKING_CONFIG } from '../config/env';

/**
 * Hook for initializing the app
 * Handles database, error tracking, background fetch setup, and notification permissions
 */
export function useAppInitialization() {
  const [isReady, setIsReady] = useState(false);
  const { notificationPermissionAsked, setNotificationPermissionAsked } = useUserPreferencesStore();

  useEffect(() => {
    async function initializeApp() {
      try {
        console.log('Initializing Mobile Dev News app...');

        initializeErrorTracking(ERROR_TRACKING_CONFIG.SENTRY_DSN);

        await database.init();
        console.log('Database initialized');

        await mobileArticleRepository.initialize();
        console.log('Mobile articles repository initialized');

        await registerBackgroundFetch();
        console.log('Background fetch registered');

        // Request notification permission on first launch
        if (!notificationPermissionAsked) {
          console.log('Requesting notification permission on first launch...');
          const granted = await notificationService.requestPermissions();
          setNotificationPermissionAsked(true);
          if (granted) {
            console.log('Notification permission granted on first launch');
          } else {
            console.log('Notification permission denied on first launch');
          }
        }

        setIsReady(true);
        console.log('App initialization complete');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setIsReady(true);
      }
    }

    initializeApp();
  }, [notificationPermissionAsked, setNotificationPermissionAsked]);

  return { isReady };
}
