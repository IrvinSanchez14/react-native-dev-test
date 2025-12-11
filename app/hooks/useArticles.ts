import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { hnApi, IHackerNewsAPI } from '../services/api/hackerNewsApi';
import { articleRepository } from '../services/database/articleRepository';
import { Article, FeedType, HNArticle } from '../types/article';
import { useArticleStore } from '../store/articleStore';
import { createFeedHook } from './useFeedFactory';

// Query keys
export const QUERY_KEYS = {
  topStories: () => ['articles', 'top'] as const,
  newStories: () => ['articles', 'new'] as const,
  bestStories: () => ['articles', 'best'] as const,
  askStories: () => ['articles', 'ask'] as const,
  article: (id: number) => ['article', id] as const,
  savedArticles: () => ['articles', 'saved'] as const,
  favoriteArticles: () => ['articles', 'favorites'] as const,
  unreadArticles: () => ['articles', 'unread'] as const,
  statistics: () => ['articles', 'statistics'] as const,
};

// Create feed hooks using factory pattern
// This reduces code duplication and makes it easier to maintain
export const useTopStories = createFeedHook('top');
export const useNewStories = createFeedHook('new');
export const useBestStories = createFeedHook('best');
export const useAskStories = createFeedHook('ask');

/**
 * Hook for fetching a single article
 */
export function useArticle(id: number, api: IHackerNewsAPI = hnApi) {
  return useQuery({
    queryKey: QUERY_KEYS.article(id),
    queryFn: async ({ signal }) => {
      // Try to get from database first
      let article = await articleRepository.getById(id);

      // If not in database or stale, fetch from API
      if (!article || Date.now() - article.fetchedAt > 60 * 60 * 1000) {
        console.log(`[useArticle] Fetching article ${id} from API...`);
        const hnArticle = await api.getItem(id, signal);

        if (hnArticle) {
          // Determine feed type (default to 'top')
          await articleRepository.insert(hnArticle, 'top');
          article = await articleRepository.getById(id);
        }
      }

      return article;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    enabled: id > 0,
  });
}

/**
 * Hook for fetching saved articles
 */
export function useSavedArticles() {
  return useQuery({
    queryKey: QUERY_KEYS.savedArticles(),
    queryFn: () => articleRepository.getSavedArticles(),
    staleTime: 0, // Always fresh
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching favorite articles
 */
export function useFavoriteArticles() {
  return useQuery({
    queryKey: QUERY_KEYS.favoriteArticles(),
    queryFn: () => articleRepository.getFavoriteArticles(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching unread articles
 */
export function useUnreadArticles() {
  return useQuery({
    queryKey: QUERY_KEYS.unreadArticles(),
    queryFn: () => articleRepository.getUnreadArticles(100),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching article statistics
 */
export function useArticleStatistics() {
  return useQuery({
    queryKey: QUERY_KEYS.statistics(),
    queryFn: () => articleRepository.getStatistics(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for article actions with optimistic updates
 */
export function useArticleActions() {
  const queryClient = useQueryClient();
  const articleStore = useArticleStore();

  // Invalidate relevant queries after article actions
  const invalidateArticleQueries = (articleId: number) => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.article(articleId) });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.savedArticles() });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.favoriteArticles() });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadArticles() });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.statistics() });
  };

  const markAsRead = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.markAsRead(id);
    },
    onSuccess: (_, id) => {
      invalidateArticleQueries(id);
    },
  });

  const markAsUnread = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.markAsUnread(id);
    },
    onSuccess: (_, id) => {
      invalidateArticleQueries(id);
    },
  });

  const saveArticle = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.saveArticle(id);
    },
    onSuccess: (_, id) => {
      invalidateArticleQueries(id);
    },
  });

  const unsaveArticle = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.unsaveArticle(id);
    },
    onSuccess: (_, id) => {
      invalidateArticleQueries(id);
    },
  });

  const favoriteArticle = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.favoriteArticle(id);
    },
    onSuccess: (_, id) => {
      invalidateArticleQueries(id);
    },
  });

  const unfavoriteArticle = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.unfavoriteArticle(id);
    },
    onSuccess: (_, id) => {
      invalidateArticleQueries(id);
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.deleteArticle(id);
    },
    onSuccess: (_, id) => {
      invalidateArticleQueries(id);
      // Also invalidate feed queries
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  return {
    markAsRead,
    markAsUnread,
    saveArticle,
    unsaveArticle,
    favoriteArticle,
    unfavoriteArticle,
    deleteArticle,
  };
}

/**
 * Hook for refreshing a specific feed
 */
export function useRefreshFeed(feedType: FeedType) {
  const queryClient = useQueryClient();

  const refresh = useMutation({
    mutationFn: async () => {
      // Clear feed mappings to force fresh fetch
      await articleRepository.clearFeed(feedType);

      // Fetch fresh data (first page)
      return await fetchFeedArticlesPage(feedType, 0);
    },
    onSuccess: () => {
      // Invalidate the specific feed query
      const queryKey =
        feedType === 'top'
          ? QUERY_KEYS.topStories()
          : feedType === 'new'
          ? QUERY_KEYS.newStories()
          : feedType === 'best'
          ? QUERY_KEYS.bestStories()
          : QUERY_KEYS.askStories();

      queryClient.invalidateQueries({ queryKey });
    },
  });

  return refresh;
}
