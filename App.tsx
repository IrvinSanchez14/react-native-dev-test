import React, { useEffect, useState, useMemo, useRef } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme, View, StyleSheet, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';

// Navigation
import { TabNavigator } from './app/navigation/TabNavigator';
import type { RootTabParamList } from './app/types/navigation';

// Theme
import { lightTheme, darkTheme } from './app/theme/theme';
import { useUserPreferencesStore } from './app/store/userPreferencesStore';

// Database
import { database } from './app/services/database/database';
import { mobileArticleRepository } from './app/services/database/mobileArticleRepository';

// Notifications
import { registerBackgroundFetch } from './app/services/notifications/backgroundFetch';

// Loading component
import { LoadingSpinner } from './app/components/molecules';
import { ErrorBoundary } from './app/components/ErrorBoundary';

// Error tracking
import { initializeErrorTracking } from './app/services/errorTracking/errorTracker';
import { ERROR_TRACKING_CONFIG } from './app/config/env';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const systemColorScheme = useColorScheme();
  const { themeMode } = useUserPreferencesStore();
  const navigationRef = useRef<NavigationContainerRef<RootTabParamList>>(null);

  // Determine active theme
  const activeTheme = useMemo(() => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  // Initialize database
  useEffect(() => {
    async function initializeApp() {
      try {
        console.log('Initializing Mobile Dev News app...');

        // Initialize error tracking
        // In production, pass your Sentry DSN here
        initializeErrorTracking(ERROR_TRACKING_CONFIG.SENTRY_DSN);

        // Initialize database
        await database.init();
        console.log('Database initialized');

        // Initialize mobile articles table
        await mobileArticleRepository.initialize();
        console.log('Mobile articles repository initialized');

        // Register background fetch for notifications
        await registerBackgroundFetch();
        console.log('Background fetch registered');

        setIsReady(true);
        console.log('App initialization complete');
      } catch (error) {
        console.error('Failed to initialize app:', error);
        // For now, continue anyway
        setIsReady(true);
      }
    }

    initializeApp();
  }, []);

  // Set up notification tap handler
  useEffect(() => {
    // Handle notification taps when app is in foreground or background
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

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={activeTheme}>
            {!isReady ? (
              <View style={styles.loadingContainer}>
                <LoadingSpinner message="Initializing app..." />
              </View>
            ) : (
              <NavigationContainer ref={navigationRef}>
                <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />
                <TabNavigator />
              </NavigationContainer>
            )}
          </PaperProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
