import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserPreferencesStore } from '../store/userPreferencesStore';
import { notificationService } from '../services/notifications/notificationService';
import { registerBackgroundFetch, unregisterBackgroundFetch } from '../services/notifications/backgroundFetch';
import { ScreenHeader, ThemeSettings } from '../components/molecules';
import { NotificationSettings } from '../components/organisms';
import { Card, CardContent, Text, Divider } from '../components/atoms';
import type { AppTheme } from '../theme/theme';
import type { NotificationTopic } from '../types/mobile-article';
import type { SettingsScreenProps } from '../types/navigation';

export function SettingsScreen({ navigation, route }: SettingsScreenProps) {
  const theme = useTheme<AppTheme>();
  const {
    notificationPreferences,
    updateNotificationPreferences,
    themeMode,
    setThemeMode,
  } = useUserPreferencesStore();

  const [permissionStatus, setPermissionStatus] = useState<string>('');

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    const status = await notificationService.getPermissionStatus();
    setPermissionStatus(status);
  };

  const handleNotificationToggle = async () => {
    if (!notificationPreferences.enabled) {
      // User is enabling notifications - request permission
      const granted = await notificationService.requestPermissions();

      if (granted) {
        updateNotificationPreferences({
          enabled: true,
          lastCheckedTimestamp: Date.now(),
        });
        await checkPermissionStatus();

        // Register background fetch
        await registerBackgroundFetch();
        console.log('[Settings] Background fetch registered');
      } else {
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your device settings to receive article updates.',
          [{ text: 'OK' }]
        );
      }
    } else {
      // User is disabling notifications
      updateNotificationPreferences({ enabled: false });
      await notificationService.cancelAllNotifications();

      // Unregister background fetch
      await unregisterBackgroundFetch();
      console.log('[Settings] Background fetch unregistered');
    }
  };

  const handleTopicChange = (value: string) => {
    updateNotificationPreferences({
      topics: value as NotificationTopic,
      lastCheckedTimestamp: Date.now(), // Reset to check for new articles
    });
  };

  const handleTestNotification = async () => {
    if (notificationPreferences.enabled && permissionStatus === 'granted') {
      await notificationService.scheduleNewArticleNotification(
        'This is a test notification from Mobile Dev News'
      );
      Alert.alert(
        'Test Notification Sent',
        'You should receive a test notification shortly.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Notifications Disabled',
        'Please enable notifications first.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTestNotificationWithArticle = async () => {
    if (notificationPreferences.enabled && permissionStatus === 'granted') {
      await notificationService.scheduleNewArticleNotification(
        'Announcing React Native 0.76 - The New Architecture is here',
        'test-article-123',
        'https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here'
      );
      Alert.alert(
        'Test Notification Sent',
        'Tap the notification to test navigation to the article.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Notifications Disabled',
        'Please enable notifications first.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTestBackgroundFetch = async () => {
    if (notificationPreferences.enabled && permissionStatus === 'granted') {
      Alert.alert(
        'Manual Background Fetch',
        'This will fetch the latest mobile articles and send notifications if any new ones are found.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Run Now',
            onPress: async () => {
              try {
                // Import the background fetch task logic
                const { algoliaApi } = await import('../services/api/algoliaApi');

                const response = await algoliaApi.fetchMobileArticles(0);
                const articles = response.hits;

                if (articles.length === 0) {
                  Alert.alert('No Articles', 'No articles found.');
                  return;
                }

                // Send notifications for top 3 articles
                const articlesToNotify = articles.slice(0, 3);
                for (const article of articlesToNotify) {
                  await notificationService.scheduleNewArticleNotification(
                    article.title,
                    article.objectID,
                    article.url
                  );
                }

                Alert.alert(
                  'Success',
                  `Sent ${articlesToNotify.length} notification(s) for the latest mobile dev articles.`,
                  [{ text: 'OK' }]
                );
              } catch (error) {
                Alert.alert(
                  'Error',
                  'Failed to fetch articles: ' + (error as Error).message,
                  [{ text: 'OK' }]
                );
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Notifications Disabled',
        'Please enable notifications first.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Settings" />

      <ScrollView style={styles.scrollView}>
        {/* Notifications Section */}
        <NotificationSettings
          enabled={notificationPreferences.enabled}
          topics={notificationPreferences.topics}
          onToggle={handleNotificationToggle}
          onTopicChange={handleTopicChange}
          onTestSimple={handleTestNotification}
          onTestWithArticle={handleTestNotificationWithArticle}
          onTestBackgroundFetch={handleTestBackgroundFetch}
        />

        <Divider />

        {/* Appearance Section */}
        <ThemeSettings
          themeMode={themeMode}
          onThemeChange={setThemeMode}
        />

        <Divider />

        {/* About Section */}
        <Card style={styles.card} mode="elevated">
          <CardContent>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About
            </Text>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">App Version</Text>
              <Text variant="bodyMedium" style={{ color: theme.custom.colors.textSecondary }}>
                1.0.0
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">Notification Status</Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: permissionStatus === 'granted'
                    ? theme.colors.primary
                    : theme.custom.colors.textSecondary
                }}
              >
                {permissionStatus || 'Not requested'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text variant="bodyMedium">API</Text>
              <Text variant="bodyMedium" style={{ color: theme.custom.colors.textSecondary }}>
                Algolia HN Search
              </Text>
            </View>
          </CardContent>
        </Card>

        <View style={styles.footer}>
          <Text
            variant="bodySmall"
            style={[styles.footerText, { color: theme.custom.colors.textSecondary }]}
          >
            Built with Expo, React Native, and React Native Paper
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 0,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  sectionLabel: {
    marginBottom: 8,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 16,
  },
  testButton: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  footer: {
    padding: 32,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
  },
});
