import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabNavigator } from './app/navigation/TabNavigator';

import { LoadingSpinner } from './app/components/molecules';
import { ErrorBoundary } from './app/components/ErrorBoundary';

import { useAppInitialization } from './app/hooks/useAppInitialization';
import { useAppTheme } from './app/hooks/useAppTheme';
import { useNotificationNavigation } from './app/hooks/useNotificationNavigation';
import { styles } from './App.styles';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

export default function App() {
  const { isReady } = useAppInitialization();
  const { activeTheme, statusBarStyle } = useAppTheme();
  const { navigationRef } = useNotificationNavigation();

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <PaperProvider theme={activeTheme}>
            {!isReady ? (
              <View style={[styles.loadingContainer, { backgroundColor: activeTheme.colors.background }]}>
                <LoadingSpinner message="Initializing app..." />
              </View>
            ) : (
              <View style={{ flex: 1, backgroundColor: activeTheme.colors.background }}>
                <NavigationContainer
                  ref={navigationRef}
                  theme={
                    activeTheme.dark
                      ? {
                          ...DarkTheme,
                          colors: {
                            ...DarkTheme.colors,
                            primary: activeTheme.colors.primary,
                            background: activeTheme.colors.background,
                            card: activeTheme.colors.surface,
                            text: activeTheme.colors.onBackground,
                            border: activeTheme.colors.outline,
                            notification: activeTheme.colors.primary,
                          },
                        }
                      : {
                          ...DefaultTheme,
                          colors: {
                            ...DefaultTheme.colors,
                            primary: activeTheme.colors.primary,
                            background: activeTheme.colors.background,
                            card: activeTheme.colors.surface,
                            text: activeTheme.colors.onBackground,
                            border: activeTheme.colors.outline,
                            notification: activeTheme.colors.primary,
                          },
                        }
                  }
                >
                  <StatusBar style={statusBarStyle} />
                  <TabNavigator />
                </NavigationContainer>
              </View>
            )}
          </PaperProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
