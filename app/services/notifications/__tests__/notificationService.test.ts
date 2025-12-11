import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { notificationService } from '../notificationService';
import { Platform } from 'react-native';

jest.mock('expo-notifications');
jest.mock('expo-device');
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

const mockedNotifications = Notifications as jest.Mocked<typeof Notifications>;
const mockedDevice = Device as jest.Mocked<typeof Device>;

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockedDevice as any).isDevice = true;
  });

  describe('requestPermissions', () => {
    it('should return false on simulator', async () => {
      (mockedDevice as any).isDevice = false;

      const result = await notificationService.requestPermissions();

      expect(result).toBe(false);
      expect(mockedNotifications.getPermissionsAsync).not.toHaveBeenCalled();
    });

    it('should return true if permission already granted', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'granted',
      } as any);

      const result = await notificationService.requestPermissions();

      expect(result).toBe(true);
      expect(mockedNotifications.getPermissionsAsync).toHaveBeenCalled();
    });

    it('should request permission if not granted', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'undetermined',
      } as any);

      mockedNotifications.requestPermissionsAsync.mockResolvedValue({
        status: 'granted',
      } as any);

      const result = await notificationService.requestPermissions();

      expect(result).toBe(true);
      expect(mockedNotifications.requestPermissionsAsync).toHaveBeenCalled();
    });

    it('should return false if permission denied', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'undetermined',
      } as any);

      mockedNotifications.requestPermissionsAsync.mockResolvedValue({
        status: 'denied',
      } as any);

      const result = await notificationService.requestPermissions();

      expect(result).toBe(false);
    });

    it('should handle errors gracefully', async () => {
      mockedNotifications.getPermissionsAsync.mockRejectedValue(new Error('Permission error'));

      const result = await notificationService.requestPermissions();

      expect(result).toBe(false);
    });
  });

  describe('scheduleNewArticleNotification', () => {
    it('should schedule notification with correct data', async () => {
      await notificationService.scheduleNewArticleNotification(
        'Test Article',
        'article-123',
        'https://example.com'
      );

      expect(mockedNotifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'New Mobile Dev Article',
          body: 'Test Article',
          data: {
            type: 'new_article',
            articleId: 'article-123',
            url: 'https://example.com',
            title: 'Test Article',
          },
        },
        trigger: null,
      });
    });

    it('should handle errors when scheduling', async () => {
      mockedNotifications.scheduleNotificationAsync.mockRejectedValue(
        new Error('Schedule error')
      );


      await expect(
        notificationService.scheduleNewArticleNotification('Test')
      ).resolves.not.toThrow();
    });
  });

  describe('cancelAllNotifications', () => {
    it('should cancel all scheduled notifications', async () => {
      await notificationService.cancelAllNotifications();

      expect(mockedNotifications.cancelAllScheduledNotificationsAsync).toHaveBeenCalled();
    });
  });

  describe('getPermissionStatus', () => {
    it('should return current permission status', async () => {
      mockedNotifications.getPermissionsAsync.mockResolvedValue({
        status: 'granted',
      } as any);

      const status = await notificationService.getPermissionStatus();

      expect(status).toBe('granted');
      expect(mockedNotifications.getPermissionsAsync).toHaveBeenCalled();
    });
  });
});
