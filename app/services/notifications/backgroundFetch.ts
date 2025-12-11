import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { algoliaApi } from '../api/algoliaApi';
import { mobileArticleRepository } from '../database/mobileArticleRepository';
import { notificationService } from './notificationService';
import type { NotificationPreferences } from '../../types/mobile-article';

const BACKGROUND_FETCH_TASK = 'MOBILE_ARTICLES_BACKGROUND_FETCH';
const LAST_CHECKED_KEY = '@mobile_dev_news/last_checked_article_id';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const preferencesJson = await AsyncStorage.getItem('user-preferences-store');
    if (!preferencesJson) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const preferences = JSON.parse(preferencesJson);
    const notificationPrefs: NotificationPreferences = preferences.state?.notificationPreferences;

    if (!notificationPrefs || !notificationPrefs.enabled) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const response = await algoliaApi.fetchMobileArticles(0);
    const articles = response.hits;

    if (articles.length === 0) {
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    const lastCheckedId = await AsyncStorage.getItem(LAST_CHECKED_KEY);

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
        return true;
      }
    });

    const newArticles = lastCheckedId
      ? filteredArticles.filter((article) => {
          const articleTime = new Date(article.created_at).getTime();
          const lastCheckedTime = notificationPrefs.lastCheckedTimestamp || 0;
          return articleTime > lastCheckedTime;
        })
      : filteredArticles.slice(0, 3);

    const articlesToNotify = newArticles.slice(0, 3);
    for (const article of articlesToNotify) {
      await notificationService.scheduleNewArticleNotification(
        article.title,
        article.objectID,
        article.url
      );
    }

    if (articles.length > 0) {
      await AsyncStorage.setItem(LAST_CHECKED_KEY, articles[0].objectID);

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

    await mobileArticleRepository.upsertArticles(articles);

    return newArticles.length > 0
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundFetch(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 30 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  } catch (error) {
  }
}

export async function unregisterBackgroundFetch(): Promise<void> {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }
  } catch (error) {
  }
}

export async function getBackgroundFetchStatus(): Promise<BackgroundFetch.BackgroundFetchStatus> {
  return await BackgroundFetch.getStatusAsync();
}
