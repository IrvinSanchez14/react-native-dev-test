import { useEffect, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import type { RootTabParamList } from '../types/navigation';

/**
 * Hook for handling notification navigation
 * Listens for notification taps and navigates to the appropriate screen
 */
export function useNotificationNavigation() {
  const navigationRef = useRef<NavigationContainerRef<RootTabParamList>>(null);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      console.log('[Notification] Tapped:', data);

      if (data.type === 'new_article' && data.url) {
        // Navigate to the article web view
        if (navigationRef.current?.isReady()) {
          navigationRef.current.navigate('ArticlesTab', {
            screen: 'ArticleWebView',
            params: {
              url: data.url,
              title: data.title || 'Article',
            },
          });
        }
      }
    });

    return () => subscription.remove();
  }, []);

  return { navigationRef };
}
