import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { algoliaApi } from '../services/api/algoliaApi';
import { mobileArticleRepository } from '../services/database/mobileArticleRepository';
import { MobileArticle } from '../types/mobile-article';

const QUERY_KEY = ['mobileArticles'];

async function fetchMobileArticles(signal?: AbortSignal): Promise<MobileArticle[]> {
  try {
    const response = await algoliaApi.fetchMobileArticles(0, signal);

    await mobileArticleRepository.upsertArticles(response.hits);

    const articles = await mobileArticleRepository.getArticles();

    return articles;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }

    return await mobileArticleRepository.getArticles();
  }
}

export function useMobileArticles() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => fetchMobileArticles(signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: 'always',
  });
}

export function useFavoriteArticles() {
  return useQuery({
    queryKey: ['favoriteArticles'],
    queryFn: () => mobileArticleRepository.getFavoriteArticles(),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false, // Don't refetch when component mounts if data is fresh
  });
}

export function useDeletedArticles() {
  return useQuery({
    queryKey: ['deletedArticles'],
    queryFn: () => mobileArticleRepository.getDeletedArticles(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      await mobileArticleRepository.deleteArticle(articleId);
    },
    onMutate: async (articleId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: ['favoriteArticles'] });
      await queryClient.cancelQueries({ queryKey: ['deletedArticles'] });

      // Snapshot previous values
      const previousArticles = queryClient.getQueryData<MobileArticle[]>(QUERY_KEY);
      const previousFavorites = queryClient.getQueryData<MobileArticle[]>(['favoriteArticles']);

      // Optimistically remove from main articles list
      queryClient.setQueryData<MobileArticle[]>(QUERY_KEY, (old) =>
        old ? old.filter((article) => article.id !== articleId) : []
      );

      // Optimistically remove from favorites list if it was favorited
      queryClient.setQueryData<MobileArticle[]>(['favoriteArticles'], (old) =>
        old ? old.filter((article) => article.id !== articleId) : []
      );

      return { previousArticles, previousFavorites };
    },
    onError: (err, articleId, context) => {
      // Rollback on error
      if (context?.previousArticles) {
        queryClient.setQueryData(QUERY_KEY, context.previousArticles);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favoriteArticles'], context.previousFavorites);
      }
      // Only invalidate on error to ensure consistency after rollback
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['favoriteArticles'] });
      queryClient.invalidateQueries({ queryKey: ['deletedArticles'] });
    },
  });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      await mobileArticleRepository.toggleFavorite(articleId);
    },
    onMutate: async (articleId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: ['favoriteArticles'] });

      // Snapshot previous values
      const previousArticles = queryClient.getQueryData<MobileArticle[]>(QUERY_KEY);
      const previousFavorites = queryClient.getQueryData<MobileArticle[]>(['favoriteArticles']);

      // Optimistically update the articles list
      queryClient.setQueryData<MobileArticle[]>(QUERY_KEY, (old) =>
        old
          ? old.map((article) =>
              article.id === articleId
                ? { ...article, isFavorite: !article.isFavorite }
                : article
            )
          : []
      );

      // Optimistically update favorites list
      queryClient.setQueryData<MobileArticle[]>(['favoriteArticles'], (old) => {
        if (!old) return [];
        const article = old.find((a) => a.id === articleId);
        if (article) {
          // Remove from favorites if it was favorited
          return old.filter((a) => a.id !== articleId);
        } else {
          // Add to favorites - get the article from the main list (already updated optimistically)
          const allArticles = queryClient.getQueryData<MobileArticle[]>(QUERY_KEY);
          const articleToAdd = allArticles?.find((a) => a.id === articleId);
          if (articleToAdd && articleToAdd.isFavorite) {
            return [...old, articleToAdd];
          }
          return old;
        }
      });

      return { previousArticles, previousFavorites };
    },
    onError: (err, articleId, context) => {
      // Rollback on error
      if (context?.previousArticles) {
        queryClient.setQueryData(QUERY_KEY, context.previousArticles);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(['favoriteArticles'], context.previousFavorites);
      }
      // Only invalidate on error to ensure consistency after rollback
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['favoriteArticles'] });
    },
  });
}

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
