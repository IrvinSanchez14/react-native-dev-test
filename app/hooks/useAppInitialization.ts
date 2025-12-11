import { useEffect, useState } from 'react';
import { database } from '../services/database/database';
import { mobileArticleRepository } from '../services/database/mobileArticleRepository';
import { registerBackgroundFetch } from '../services/notifications/backgroundFetch';
import { initializeErrorTracking } from '../services/errorTracking/errorTracker';
import { notificationService } from '../services/notifications/notificationService';
import { useUserPreferencesStore } from '../store/userPreferencesStore';
import { ERROR_TRACKING_CONFIG } from '../config/env';

export function useAppInitialization() {
  const [isReady, setIsReady] = useState(false);
  const { notificationPermissionAsked, setNotificationPermissionAsked } = useUserPreferencesStore();

  useEffect(() => {
    async function initializeApp() {
      try {
        initializeErrorTracking(ERROR_TRACKING_CONFIG.SENTRY_DSN);

        await database.init();

        await mobileArticleRepository.initialize();

        await registerBackgroundFetch();

        if (!notificationPermissionAsked) {
          await notificationService.requestPermissions();
          setNotificationPermissionAsked(true);
        }

        setIsReady(true);
      } catch (error) {
        setIsReady(true);
      }
    }

    initializeApp();
  }, [notificationPermissionAsked, setNotificationPermissionAsked]);

  return { isReady };
}
