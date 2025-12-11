import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { articleRepository } from '../services/database/articleRepository';
import { FeedType } from '../types/article';

interface ArticleStore {
  // Sync metadata
  lastSync: Record<FeedType, number>;

  // Article actions (optimistic updates)
  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  saveArticle: (id: number) => Promise<void>;
  unsaveArticle: (id: number) => Promise<void>;
  favoriteArticle: (id: number) => Promise<void>;
  unfavoriteArticle: (id: number) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;

  // Sync tracking
  setLastSync: (feed: FeedType, timestamp: number) => void;
  getLastSync: (feed: FeedType) => number;

  // Utility
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

      // Mark article as read
      markAsRead: async (id: number) => {
        try {
          await articleRepository.markAsRead(id);
          console.log(`Article ${id} marked as read`);
        } catch (error) {
          console.error('Error marking article as read:', error);
          throw error;
        }
      },

      // Mark article as unread
      markAsUnread: async (id: number) => {
        try {
          await articleRepository.markAsUnread(id);
          console.log(`Article ${id} marked as unread`);
        } catch (error) {
          console.error('Error marking article as unread:', error);
          throw error;
        }
      },

      // Save article (bookmark)
      saveArticle: async (id: number) => {
        try {
          await articleRepository.saveArticle(id);
          console.log(`Article ${id} saved`);
        } catch (error) {
          console.error('Error saving article:', error);
          throw error;
        }
      },

      // Unsave article (remove bookmark)
      unsaveArticle: async (id: number) => {
        try {
          await articleRepository.unsaveArticle(id);
          console.log(`Article ${id} unsaved`);
        } catch (error) {
          console.error('Error unsaving article:', error);
          throw error;
        }
      },

      // Favorite article
      favoriteArticle: async (id: number) => {
        try {
          await articleRepository.favoriteArticle(id);
          console.log(`Article ${id} favorited`);
        } catch (error) {
          console.error('Error favoriting article:', error);
          throw error;
        }
      },

      // Unfavorite article
      unfavoriteArticle: async (id: number) => {
        try {
          await articleRepository.unfavoriteArticle(id);
          console.log(`Article ${id} unfavorited`);
        } catch (error) {
          console.error('Error unfavoriting article:', error);
          throw error;
        }
      },

      // Delete article
      deleteArticle: async (id: number) => {
        try {
          await articleRepository.deleteArticle(id);
          console.log(`Article ${id} deleted`);
        } catch (error) {
          console.error('Error deleting article:', error);
          throw error;
        }
      },

      // Set last sync timestamp for a feed
      setLastSync: (feed: FeedType, timestamp: number) => {
        set(state => ({
          lastSync: {
            ...state.lastSync,
            [feed]: timestamp,
          },
        }));
      },

      // Get last sync timestamp for a feed
      getLastSync: (feed: FeedType) => {
        return get().lastSync[feed];
      },

      // Reset store to initial state
      resetStore: () => {
        set(initialState);
      },
    }),
    {
      name: 'article-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist sync metadata, not actions
      partialize: state => ({
        lastSync: state.lastSync,
      }),
    }
  )
);
