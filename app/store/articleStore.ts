import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { articleRepository } from '../services/database/articleRepository';
import { FeedType } from '../types/article';

interface ArticleStore {
  lastSync: Record<FeedType, number>;

  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  saveArticle: (id: number) => Promise<void>;
  unsaveArticle: (id: number) => Promise<void>;
  favoriteArticle: (id: number) => Promise<void>;
  unfavoriteArticle: (id: number) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;

  setLastSync: (feed: FeedType, timestamp: number) => void;
  getLastSync: (feed: FeedType) => number;

  resetStore: () => void;
}

const initialState = {
  lastSync: {
    top: 0,
    new: 0,
    best: 0,
    ask: 0,
  } as Record<FeedType, number>,
};

export const useArticleStore = create<ArticleStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      markAsRead: async (id: number) => {
        try {
          await articleRepository.markAsRead(id);
          console.log(`Article ${id} marked as read`);
        } catch (error) {
          console.error('Error marking article as read:', error);
          throw error;
        }
      },

      markAsUnread: async (id: number) => {
        try {
          await articleRepository.markAsUnread(id);
          console.log(`Article ${id} marked as unread`);
        } catch (error) {
          console.error('Error marking article as unread:', error);
          throw error;
        }
      },

      saveArticle: async (id: number) => {
        try {
          await articleRepository.saveArticle(id);
          console.log(`Article ${id} saved`);
        } catch (error) {
          console.error('Error saving article:', error);
          throw error;
        }
      },

      unsaveArticle: async (id: number) => {
        try {
          await articleRepository.unsaveArticle(id);
          console.log(`Article ${id} unsaved`);
        } catch (error) {
          console.error('Error unsaving article:', error);
          throw error;
        }
      },

      favoriteArticle: async (id: number) => {
        try {
          await articleRepository.favoriteArticle(id);
          console.log(`Article ${id} favorited`);
        } catch (error) {
          console.error('Error favoriting article:', error);
          throw error;
        }
      },

      unfavoriteArticle: async (id: number) => {
        try {
          await articleRepository.unfavoriteArticle(id);
          console.log(`Article ${id} unfavorited`);
        } catch (error) {
          console.error('Error unfavoriting article:', error);
          throw error;
        }
      },

      deleteArticle: async (id: number) => {
        try {
          await articleRepository.deleteArticle(id);
          console.log(`Article ${id} deleted`);
        } catch (error) {
          console.error('Error deleting article:', error);
          throw error;
        }
      },

      setLastSync: (feed: FeedType, timestamp: number) => {
        set(state => ({
          lastSync: {
            ...state.lastSync,
            [feed]: timestamp,
          },
        }));
      },

      getLastSync: (feed: FeedType) => {
        return get().lastSync[feed];
      },

      resetStore: () => {
        set(initialState);
      },
    }),
    {
      name: 'article-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        lastSync: state.lastSync,
      }),
    }
  )
);
