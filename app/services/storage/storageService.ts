import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_VALUES } from './keys';
import { NotificationConfig, UserPreferences, CacheMetadata } from '../../types/article';

class StorageService {
  // Generic get/set methods
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Notification config
  async getNotificationConfig(): Promise<NotificationConfig> {
    const config = await this.get<NotificationConfig>(STORAGE_KEYS.NOTIFICATION_CONFIG);
    return config || DEFAULT_VALUES.NOTIFICATION_CONFIG;
  }

  async setNotificationConfig(config: NotificationConfig): Promise<void> {
    await this.set(STORAGE_KEYS.NOTIFICATION_CONFIG, config);
  }

  // Theme mode
  async getThemeMode(): Promise<'light' | 'dark' | 'auto'> {
    const mode = await this.get<'light' | 'dark' | 'auto'>(STORAGE_KEYS.THEME_MODE);
    return mode || DEFAULT_VALUES.THEME_MODE;
  }

  async setThemeMode(mode: 'light' | 'dark' | 'auto'): Promise<void> {
    await this.set(STORAGE_KEYS.THEME_MODE, mode);
  }

  // Articles per page
  async getArticlesPerPage(): Promise<number> {
    const count = await this.get<number>(STORAGE_KEYS.ARTICLES_PER_PAGE);
    return count || DEFAULT_VALUES.ARTICLES_PER_PAGE;
  }

  async setArticlesPerPage(count: number): Promise<void> {
    await this.set(STORAGE_KEYS.ARTICLES_PER_PAGE, count);
  }

  // Sync timestamps
  async getLastSync(feedType: 'top' | 'new' | 'best' | 'ask'): Promise<number | null> {
    const keyMap = {
      top: STORAGE_KEYS.LAST_SYNC_TOP,
      new: STORAGE_KEYS.LAST_SYNC_NEW,
      best: STORAGE_KEYS.LAST_SYNC_BEST,
      ask: STORAGE_KEYS.LAST_SYNC_ASK,
    };
    return await this.get<number>(keyMap[feedType]);
  }

  async setLastSync(feedType: 'top' | 'new' | 'best' | 'ask', timestamp: number): Promise<void> {
    const keyMap = {
      top: STORAGE_KEYS.LAST_SYNC_TOP,
      new: STORAGE_KEYS.LAST_SYNC_NEW,
      best: STORAGE_KEYS.LAST_SYNC_BEST,
      ask: STORAGE_KEYS.LAST_SYNC_ASK,
    };
    await this.set(keyMap[feedType], timestamp);
  }

  // Cache metadata
  async getCacheVersion(): Promise<number> {
    const version = await this.get<number>(STORAGE_KEYS.CACHE_VERSION);
    return version || DEFAULT_VALUES.CACHE_VERSION;
  }

  async setCacheVersion(version: number): Promise<void> {
    await this.set(STORAGE_KEYS.CACHE_VERSION, version);
  }

  async getLastCacheCleanup(): Promise<number | null> {
    return await this.get<number>(STORAGE_KEYS.LAST_CACHE_CLEANUP);
  }

  async setLastCacheCleanup(timestamp: number): Promise<void> {
    await this.set(STORAGE_KEYS.LAST_CACHE_CLEANUP, timestamp);
  }

  // Notification tracking
  async getLastNotifiedStoryId(): Promise<number | null> {
    return await this.get<number>(STORAGE_KEYS.LAST_NOTIFIED_STORY_ID);
  }

  async setLastNotifiedStoryId(storyId: number): Promise<void> {
    await this.set(STORAGE_KEYS.LAST_NOTIFIED_STORY_ID, storyId);
  }

  // Onboarding
  async getHasCompletedOnboarding(): Promise<boolean> {
    const completed = await this.get<boolean>(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING);
    return completed || DEFAULT_VALUES.HAS_COMPLETED_ONBOARDING;
  }

  async setHasCompletedOnboarding(completed: boolean): Promise<void> {
    await this.set(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING, completed);
  }

  async getNotificationPermissionAsked(): Promise<boolean> {
    const asked = await this.get<boolean>(STORAGE_KEYS.NOTIFICATION_PERMISSION_ASKED);
    return asked || DEFAULT_VALUES.NOTIFICATION_PERMISSION_ASKED;
  }

  async setNotificationPermissionAsked(asked: boolean): Promise<void> {
    await this.set(STORAGE_KEYS.NOTIFICATION_PERMISSION_ASKED, asked);
  }

  // Get all user preferences
  async getUserPreferences(): Promise<UserPreferences> {
    const [
      notificationConfig,
      themeMode,
      articlesPerPage,
      hasCompletedOnboarding,
      notificationPermissionAsked,
    ] = await Promise.all([
      this.getNotificationConfig(),
      this.getThemeMode(),
      this.getArticlesPerPage(),
      this.getHasCompletedOnboarding(),
      this.getNotificationPermissionAsked(),
    ]);

    return {
      notificationConfig,
      themeMode,
      articlesPerPage,
      hasCompletedOnboarding,
      notificationPermissionAsked,
    };
  }

  // Get all cache metadata
  async getCacheMetadata(): Promise<CacheMetadata> {
    const [lastSyncTop, lastSyncNew, lastSyncBest, lastSyncAsk, lastCacheCleanup, cacheVersion] =
      await Promise.all([
        this.getLastSync('top'),
        this.getLastSync('new'),
        this.getLastSync('best'),
        this.getLastSync('ask'),
        this.getLastCacheCleanup(),
        this.getCacheVersion(),
      ]);

    return {
      lastSyncTop,
      lastSyncNew,
      lastSyncBest,
      lastSyncAsk,
      lastCacheCleanup,
      cacheVersion,
    };
  }
}

// Export singleton instance
export const storageService = new StorageService();
