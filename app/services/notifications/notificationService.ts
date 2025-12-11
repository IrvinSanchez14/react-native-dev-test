import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are presented when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  /**
   * Request notification permissions from user
   * Should be called on first launch
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('[Notifications] Permission denied');
        return false;
      }

      console.log('[Notifications] Permission granted');

      // Set up Android notification channel (required for Android)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF6600',
        });
      }

      // Note: Local notifications work on both simulators and physical devices
      // Only remote push notifications require a physical device
      if (!Device.isDevice) {
        console.log('[Notifications] Running on simulator - local notifications will work, but remote push notifications are not available');
      }

      return true;
    } catch (error) {
      console.error('[Notifications] Error requesting permissions:', error);
      return false;
    }
  }

  /**
   * Schedule a local notification for new articles
   */
  async scheduleNewArticleNotification(title: string, articleId?: string, url?: string): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Mobile Dev Article',
          body: title,
          data: {
            type: 'new_article',
            articleId,
            url,
            title,
          },
        },
        trigger: null, // Immediate
      });
    } catch (error) {
      console.error('[Notifications] Error scheduling notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get notification permission status
   */
  async getPermissionStatus(): Promise<string> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }
}

export const notificationService = new NotificationService();
