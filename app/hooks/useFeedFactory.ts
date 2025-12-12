import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { FeedType, Article, HNArticle } from '../types/article';
import { IHackerNewsAPI, hnApi } from '../services/api/hackerNewsApi';
import { articleRepository } from '../services/database/articleRepository';
import { useArticleStore } from '../store/articleStore';
import { QUERY_KEYS } from './useArticles';

const PAGE_SIZE = 30;

export interface FeedPageResult {
  articles: Article[];
  hasMore: boolean;
  nextPage: number;
}

export async function fetchFeedArticlesPage(
  feedType: FeedType,
  page: number = 0,
  pageSize: number = PAGE_SIZE,
  signal?: AbortSignal,
  api: IHackerNewsAPI = hnApi
): Promise<FeedPageResult> {
  try {
    const offset = page * pageSize;
    const limit = pageSize;

    let storyIds: number[] = [];
    if (page === 0) {
      storyIds = await api.getStoriesByFeed(feedType, signal);

      const topIds = storyIds.slice(0, Math.min(storyIds.length, pageSize * 10));

      const cached = await articleRepository.getByIds(topIds);
      const cachedIds = new Set(cached.map(a => a.id));

      const missingIds = topIds.filter(id => !cachedIds.has(id));

      let freshArticles: HNArticle[] = [];
      if (missingIds.length > 0) {
        freshArticles = await api.getItemsBatched(missingIds, 20, 5, signal);
      }

      if (freshArticles.length > 0) {
        await articleRepository.bulkInsert(freshArticles, feedType);
      }
    }

    const articles = await articleRepository.getByFeed(feedType, limit, offset);

    const totalCached = await articleRepository.getCountByFeed(feedType);
    const hasMore = offset + articles.length < totalCached;

    return {
      articles,
      hasMore,
      nextPage: hasMore ? page + 1 : page,
    };
  } catch (error) {
    const offset = page * PAGE_SIZE;
    const articles = await articleRepository.getByFeed(feedType, PAGE_SIZE, offset);
    const totalCached = await articleRepository.getCountByFeed(feedType);
    const hasMore = offset + articles.length < totalCached;

    return {
      articles,
      hasMore,
      nextPage: hasMore ? page + 1 : page,
    };
  }
}

export function createFeedHook(feedType: FeedType) {
  return function useFeed(
    api?: IHackerNewsAPI
  ): UseInfiniteQueryResult<FeedPageResult, Error> {
    const { setLastSync } = useArticleStore();
    
    const getQueryKey = () => {
      switch (feedType) {
        case 'top':
          return QUERY_KEYS.topStories();
        case 'new':
          return QUERY_KEYS.newStories();
        case 'best':
          return QUERY_KEYS.bestStories();
        case 'ask':
          return QUERY_KEYS.askStories();
        default:
          const _exhaustive: never = feedType;
          throw new Error(`Unknown feed type: ${_exhaustive}`);
      }
    };
    const queryKey = getQueryKey();

    return useInfiniteQuery({
      queryKey,
      queryFn: async ({ pageParam = 0, signal }) => {
        const result = await fetchFeedArticlesPage(
          feedType,
          pageParam,
          PAGE_SIZE,
          signal,
          api
        );
        if (pageParam === 0) {
          setLastSync(feedType, Date.now());
        }
        return result;
      },
      getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
      initialPageParam: 0,
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      retry: 1,
    });
  };
}
