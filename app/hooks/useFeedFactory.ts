import { useInfiniteQuery, UseInfiniteQueryResult } from '@tanstack/react-query';
import { FeedType, Article, HNArticle } from '../types/article';
import { IHackerNewsAPI, hnApi } from '../services/api/hackerNewsApi';
import { articleRepository } from '../services/database/articleRepository';
import { useArticleStore } from '../store/articleStore';
import { QUERY_KEYS } from './useArticles';

// Pagination configuration
const PAGE_SIZE = 30;

export interface FeedPageResult {
  articles: Article[];
  hasMore: boolean;
  nextPage: number;
}

/**
 * Fetch and cache articles for a specific feed with pagination
 */
async function fetchFeedArticlesPage(
  feedType: FeedType,
  page: number = 0,
  pageSize: number = PAGE_SIZE,
  signal?: AbortSignal,
  api: IHackerNewsAPI = hnApi
): Promise<FeedPageResult> {
  try {
    const offset = page * pageSize;
    const limit = pageSize;

    // 1. Fetch story IDs from HN API (only on first page)
    let storyIds: number[] = [];
    if (page === 0) {
      console.log(`[useFeedFactory] Fetching ${feedType} stories from API...`);
      storyIds = await api.getStoriesByFeed(feedType, signal);

      // Cache all story IDs for this feed (for future pages)
      const topIds = storyIds.slice(0, Math.min(storyIds.length, pageSize * 10)); // Cache up to 10 pages worth

      // 2. Check database for cached articles
      const cached = await articleRepository.getByIds(topIds);
      const cachedIds = new Set(cached.map(a => a.id));

      // 3. Fetch missing articles from API
      const missingIds = topIds.filter(id => !cachedIds.has(id));
      console.log(
        `[useFeedFactory] Found ${cached.length} cached, fetching ${missingIds.length} new articles`
      );

      let freshArticles: HNArticle[] = [];
      if (missingIds.length > 0) {
        freshArticles = await api.getItemsBatched(missingIds, 20, 5, signal);
      }

      // 4. Save fresh articles to database
      if (freshArticles.length > 0) {
        await articleRepository.bulkInsert(freshArticles, feedType);
      }
    }

    // 5. Fetch articles for this page from database (with user interaction data)
    const articles = await articleRepository.getByFeed(feedType, limit, offset);

    // Check if there are more articles
    const totalCached = await articleRepository.getCountByFeed(feedType);
    const hasMore = offset + articles.length < totalCached;

    console.log(`[useFeedFactory] Returning page ${page}: ${articles.length} ${feedType} articles`);
    return {
      articles,
      hasMore,
      nextPage: hasMore ? page + 1 : page,
    };
  } catch (error) {
    console.error(`[useFeedFactory] Error fetching ${feedType} stories:`, error);

    // Fallback to cached data on error
    console.log(`[useFeedFactory] Falling back to cached ${feedType} articles`);
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

/**
 * Factory function to create feed hooks
 * Reduces code duplication across feed hooks
 */
export function createFeedHook(feedType: FeedType) {
  return function useFeed(
    api?: IHackerNewsAPI
  ): UseInfiniteQueryResult<FeedPageResult, Error> {
    const { setLastSync } = useArticleStore();
    const queryKey = QUERY_KEYS[`${feedType}Stories` as keyof typeof QUERY_KEYS]();

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
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
      retry: 1,
    });
  };
}
