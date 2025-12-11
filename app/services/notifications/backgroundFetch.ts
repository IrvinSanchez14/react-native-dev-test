import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { algoliaApi } from '../api/algoliaApi';
import { mobileArticleRepository } from '../database/mobileArticleRepository';
import { notificationService } from './notificationService';
import type { NotificationPreferences } from '../../types/mobile-article';

const BACKGROUND_FETCH_TASK = 'MOBILE_ARTICLES_BACKGROUND_FETCH';
const LAST_CHECKED_KEY = '@mobile_dev_news/last_checked_article_id';

/**
 * Background fetch task definition
 * This task runs periodically to check for new articles and send notifications
 */
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log('[BackgroundFetch] Task started');

    // Get user's notification preferences from AsyncStorage
    const preferencesJson = await AsyncStorage.getItem('user-preferences-store');
    if (!preferencesJson) {
      console.log('[BackgroundFetch] No preferences found');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const preferences = JSON.parse(preferencesJson);
    const notificationPrefs: NotificationPreferences = preferences.state?.notificationPreferences;

    // Check if notifications are enabled
    if (!notificationPrefs || !notificationPrefs.enabled) {
      console.log('[BackgroundFetch] Notifications disabled');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Fetch latest articles from Algolia
    const response = await algoliaApi.fetchMobileArticles(0);
    const articles = response.hits;

    if (articles.length === 0) {
      console.log('[BackgroundFetch] No articles found');
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Get the last checked article ID
    const lastCheckedId = await AsyncStorage.getItem(LAST_CHECKED_KEY);

    // Filter articles based on user's topic preference
    const filteredArticles = articles.filter((article) => {
      const title = article.title.toLowerCase();
      const url = article.url?.toLowerCase() || '';

      if (notificationPrefs.topics === 'android') {
        return title.includes('android') || url.includes('android');
      } else if (notificationPrefs.topics === 'ios') {
        return (
          title.includes('ios') ||
          title.includes('iphone') ||
          title.includes('ipad') ||
          title.includes('swift') ||
          url.includes('apple.com')
        );
      } else {
        // 'both' - include all mobile articles
        return true;
      }
    });

    // Find new articles (articles we haven't seen before)
    const newArticles = lastCheckedId
      ? filteredArticles.filter((article) => {
          const articleTime = new Date(article.created_at).getTime();
          const lastCheckedTime = notificationPrefs.lastCheckedTimestamp || 0;
          return articleTime > lastCheckedTime;
        })
      : filteredArticles.slice(0, 3); // If first time, show top 3

    console.log(`[BackgroundFetch] Found ${newArticles.length} new articles`);

    // Send notifications for new articles (max 3 to avoid spam)
    const articlesToNotify = newArticles.slice(0, 3);
    for (const article of articlesToNotify) {
      await notificationService.scheduleNewArticleNotification(
        article.title,
        article.objectID,
        article.url
      );
    }

    // Update last checked timestamp and article ID
    if (articles.length > 0) {
      await AsyncStorage.setItem(LAST_CHECKED_KEY, articles[0].objectID);

      // Update the preferences with new timestamp
      const updatedPreferences = {
        ...preferences,
        state: {
          ...preferences.state,
          notificationPreferences: {
            ...notificationPrefs,
            lastCheckedTimestamp: Date.now(),
          },
        },
      };
      await AsyncStorage.setItem('user-preferences-store', JSON.stringify(updatedPreferences));
    }

    // Save articles to database for offline access
    await mobileArticleRepository.upsertArticles(articles);

    return newArticles.length > 0
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('[BackgroundFetch] Error:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Register background fetch task
 * Should be called once when the app starts
 */
export async function registerBackgroundFetch(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 30 * 60, // 30 minutes (minimum allowed by iOS)
        stopOnTerminate: false, // Continue after app is closed
        startOnBoot: true, // Start after device restart
      });

      console.log('[BackgroundFetch] Task registered successfully');
    } else {
      console.log('[BackgroundFetch] Task already registered');
    }
  } catch (error) {
    console.error('[BackgroundFetch] Failed to register task:', error);
  }
}

/**
 * Unregister background fetch task
 * Should be called when user disables notifications
 */
export async function unregisterBackgroundFetch(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
      console.log('[BackgroundFetch] Task unregistered');
    }
  } catch (error) {
    console.error('[BackgroundFetch] Failed to unregister task:', error);
  }
}

/**
 * Get background fetch status
 */
export async function getBackgroundFetchStatus(): Promise<BackgroundFetch.BackgroundFetchStatus> {
  return await BackgroundFetch.getStatusAsync();
}
