import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { algoliaApi } from '../services/api/algoliaApi';
import { mobileArticleRepository } from '../services/database/mobileArticleRepository';
import { MobileArticle } from '../types/mobile-article';

const QUERY_KEY = ['mobileArticles'];

/**
 * Fetch mobile articles from Algolia API and cache in SQLite
 */
async function fetchMobileArticles(signal?: AbortSignal): Promise<MobileArticle[]> {
  try {
    console.log('[useMobileArticles] Fetching from Algolia API...');

    // Fetch from Algolia
    const response = await algoliaApi.fetchMobileArticles(0, signal);

    // Upsert to database (preserves deletion status)
    await mobileArticleRepository.upsertArticles(response.hits);

    // Return non-deleted articles from database
    const articles = await mobileArticleRepository.getArticles();

    console.log(`[useMobileArticles] Returning ${articles.length} articles`);
    return articles;
  } catch (error) {
    // Don't fallback if request was cancelled
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    console.error('[useMobileArticles] Error fetching, falling back to cache:', error);

    // Fallback to cached data
    return await mobileArticleRepository.getArticles();
  }
}

/**
 * Hook for fetching mobile articles
 */
export function useMobileArticles() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => fetchMobileArticles(signal),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnMount: 'always',
  });
}

/**
 * Hook for favorite articles
 */
export function useFavoriteArticles() {
  return useQuery({
    queryKey: ['favoriteArticles'],
    queryFn: () => mobileArticleRepository.getFavoriteArticles(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for deleted articles
 */
export function useDeletedArticles() {
  return useQuery({
    queryKey: ['deletedArticles'],
    queryFn: () => mobileArticleRepository.getDeletedArticles(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for deleting articles
 */
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      await mobileArticleRepository.deleteArticle(articleId);
    },
    onMutate: async (articleId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });

      // Snapshot previous value
      const previousArticles = queryClient.getQueryData<MobileArticle[]>(QUERY_KEY);

      // Optimistically update
      queryClient.setQueryData<MobileArticle[]>(QUERY_KEY, (old) =>
        old ? old.filter((article) => article.id !== articleId) : []
      );

      return { previousArticles };
    },
    onError: (err, articleId, context) => {
      // Rollback on error
      if (context?.previousArticles) {
        queryClient.setQueryData(QUERY_KEY, context.previousArticles);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['deletedArticles'] });
    },
  });
}

/**
 * Hook for toggling favorite
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      await mobileArticleRepository.toggleFavorite(articleId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['favoriteArticles'] });
    },
  });
}

/**
 * Hook for restoring deleted articles
 */
export function useRestoreArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      await mobileArticleRepository.restoreArticle(articleId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['deletedArticles'] });
    },
  });
}
