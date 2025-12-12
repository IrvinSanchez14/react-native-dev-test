import { useEffect, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import type { RootTabParamList } from '../types/navigation';

export function useNotificationNavigation() {
  const navigationRef = useRef<NavigationContainerRef<RootTabParamList>>(null);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as {
        type?: string;
        url?: string;
        title?: string;
      };

      if (data.type === 'new_article' && data.url && typeof data.url === 'string') {
        const url: string = data.url;
        const title: string = typeof data.title === 'string' ? data.title : 'Article';

        if (navigationRef.current?.isReady()) {
          navigationRef.current.navigate('ArticlesTab', {
            screen: 'ArticleWebView',
            params: {
              url,
              title,
            },
          });
        }
      }
    });

    return () => subscription.remove();
  }, []);

  return { navigationRef };
}
