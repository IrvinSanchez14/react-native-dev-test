import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { hnApi, IHackerNewsAPI } from '../services/api/hackerNewsApi';
import { articleRepository } from '../services/database/articleRepository';
import { Article, FeedType, HNArticle } from '../types/article';
import { useArticleStore } from '../store/articleStore';
import { createFeedHook, fetchFeedArticlesPage } from './useFeedFactory';

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



export const useTopStories = createFeedHook('top');
export const useNewStories = createFeedHook('new');
export const useBestStories = createFeedHook('best');
export const useAskStories = createFeedHook('ask');

export function useArticle(id: number, api: IHackerNewsAPI = hnApi) {
  return useQuery({
    queryKey: QUERY_KEYS.article(id),
    queryFn: async ({ signal }) => {

      let article = await articleRepository.getById(id);

      if (!article || Date.now() - article.fetchedAt > 60 * 60 * 1000) {
        const hnArticle = await api.getItem(id, signal);

        if (hnArticle) {
          await articleRepository.insert(hnArticle, 'top');
          article = await articleRepository.getById(id);
        }
      }

      return article;
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: id > 0,
  });
}

export function useSavedArticles() {
  return useQuery({
    queryKey: QUERY_KEYS.savedArticles(),
    queryFn: () => articleRepository.getSavedArticles(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

export function useFavoriteArticles() {
  return useQuery({
    queryKey: QUERY_KEYS.favoriteArticles(),
    queryFn: () => articleRepository.getFavoriteArticles(),
    staleTime: 30 * 1000, 
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false, 
  });
}

export function useUnreadArticles() {
  return useQuery({
    queryKey: QUERY_KEYS.unreadArticles(),
    queryFn: () => articleRepository.getUnreadArticles(100),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

export function useArticleStatistics() {
  return useQuery({
    queryKey: QUERY_KEYS.statistics(),
    queryFn: () => articleRepository.getStatistics(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
}

export function useArticleActions() {
  const queryClient = useQueryClient();
  const articleStore = useArticleStore();

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
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.article(id) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.favoriteArticles() });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.savedArticles() });

      const previousArticle = queryClient.getQueryData<Article>(QUERY_KEYS.article(id));
      const previousFavorites = queryClient.getQueryData<Article[]>(QUERY_KEYS.favoriteArticles());

      queryClient.setQueryData<Article>(QUERY_KEYS.article(id), (old) =>
        old ? { ...old, isFavorite: true } : old
      );

      queryClient.setQueryData<Article[]>(QUERY_KEYS.favoriteArticles(), (old) => {
        if (!old) return [];
        const article = queryClient.getQueryData<Article>(QUERY_KEYS.article(id));
        if (article && !old.find((a) => a.id === id)) {
          return [...old, { ...article, isFavorite: true }];
        }
        return old;
      });

      return { previousArticle, previousFavorites };
    },
    onError: (err, id, context) => {
      if (context?.previousArticle) {
        queryClient.setQueryData(QUERY_KEYS.article(id), context.previousArticle);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(QUERY_KEYS.favoriteArticles(), context.previousFavorites);
      }
      invalidateArticleQueries(id);
    },
  });

  const unfavoriteArticle = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.unfavoriteArticle(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.article(id) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.favoriteArticles() });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.savedArticles() });

      const previousArticle = queryClient.getQueryData<Article>(QUERY_KEYS.article(id));
      const previousFavorites = queryClient.getQueryData<Article[]>(QUERY_KEYS.favoriteArticles());

      queryClient.setQueryData<Article>(QUERY_KEYS.article(id), (old) =>
        old ? { ...old, isFavorite: false } : old
      );

      queryClient.setQueryData<Article[]>(QUERY_KEYS.favoriteArticles(), (old) =>
        old ? old.filter((a) => a.id !== id) : []
      );

      return { previousArticle, previousFavorites };
    },
    onError: (err, id, context) => {
      if (context?.previousArticle) {
        queryClient.setQueryData(QUERY_KEYS.article(id), context.previousArticle);
      }
      if (context?.previousFavorites) {
        queryClient.setQueryData(QUERY_KEYS.favoriteArticles(), context.previousFavorites);
      }
      invalidateArticleQueries(id);
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: number) => {
      await articleStore.deleteArticle(id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.article(id) });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.favoriteArticles() });
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.savedArticles() });
      await queryClient.cancelQueries({ queryKey: ['articles'] });

      const previousArticle = queryClient.getQueryData<Article>(QUERY_KEYS.article(id));
      const previousFavorites = queryClient.getQueryData<Article[]>(QUERY_KEYS.favoriteArticles());
      const previousSaved = queryClient.getQueryData<Article[]>(QUERY_KEYS.savedArticles());

      queryClient.setQueryData<Article[]>(QUERY_KEYS.favoriteArticles(), (old) =>
        old ? old.filter((article) => article.id !== id) : []
      );

      queryClient.setQueryData<Article[]>(QUERY_KEYS.savedArticles(), (old) =>
        old ? old.filter((article) => article.id !== id) : []
      );

      queryClient.removeQueries({ queryKey: QUERY_KEYS.article(id) });

      return { previousArticle, previousFavorites, previousSaved };
    },
    onError: (err, id, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(QUERY_KEYS.favoriteArticles(), context.previousFavorites);
      }
      if (context?.previousSaved) {
        queryClient.setQueryData(QUERY_KEYS.savedArticles(), context.previousSaved);
      }
      invalidateArticleQueries(id);
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

export function useRefreshFeed(feedType: FeedType) {
  const queryClient = useQueryClient();

  const refresh = useMutation({
    mutationFn: async () => {

      await articleRepository.clearFeed(feedType);


      return await fetchFeedArticlesPage(feedType, 0);
    },
    onSuccess: () => {

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
