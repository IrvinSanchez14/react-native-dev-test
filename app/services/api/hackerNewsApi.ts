import axios, { AxiosInstance, AxiosError } from 'axios';
import { HN_ENDPOINTS } from './endpoints';
import { HNArticle, FeedType, HNUser } from '../../types/article';
import { RetryHandler } from '../../utils/retryHandler';
import { API_CONFIG } from '../../config/env';

// Configuration
const TIMEOUT = API_CONFIG.TIMEOUT;

/**
 * Interface for HackerNews API
 * Allows for dependency injection and easier testing
 */
export interface IHackerNewsAPI {
  getTopStories(signal?: AbortSignal): Promise<number[]>;
  getNewStories(signal?: AbortSignal): Promise<number[]>;
  getBestStories(signal?: AbortSignal): Promise<number[]>;
  getAskStories(signal?: AbortSignal): Promise<number[]>;
  getStoriesByFeed(feedType: FeedType, signal?: AbortSignal): Promise<number[]>;
  getItem(id: number, signal?: AbortSignal): Promise<HNArticle | null>;
  getItems(ids: number[], signal?: AbortSignal): Promise<HNArticle[]>;
  getItemsBatched(
    ids: number[],
    batchSize?: number,
    maxConcurrent?: number,
    signal?: AbortSignal
  ): Promise<HNArticle[]>;
  getUser(username: string, signal?: AbortSignal): Promise<HNUser>;
  getMaxItemId(signal?: AbortSignal): Promise<number>;
  ping(signal?: AbortSignal): Promise<boolean>;
  getErrorMessage(error: unknown): string;
}

class HackerNewsAPI implements IHackerNewsAPI {
  private client: AxiosInstance;

  constructor(client?: AxiosInstance) {
    this.client =
      client ||
      axios.create({
        timeout: API_CONFIG.TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
        },
      });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      config => {
        console.log(`[HN API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('[HN API] Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch story IDs for Top Stories feed
   */
  async getTopStories(signal?: AbortSignal): Promise<number[]> {
    return RetryHandler.retryWithBackoff(
      async () => {
        const response = await this.client.get<number[]>(HN_ENDPOINTS.TOP_STORIES, {
          signal,
        });
        return response.data;
      },
      { signal }
    );
  }

  /**
   * Fetch story IDs for New Stories feed
   */
  async getNewStories(signal?: AbortSignal): Promise<number[]> {
    return RetryHandler.retryWithBackoff(
      async () => {
        const response = await this.client.get<number[]>(HN_ENDPOINTS.NEW_STORIES, {
          signal,
        });
        return response.data;
      },
      { signal }
    );
  }

  /**
   * Fetch story IDs for Best Stories feed
   */
  async getBestStories(signal?: AbortSignal): Promise<number[]> {
    return RetryHandler.retryWithBackoff(
      async () => {
        const response = await this.client.get<number[]>(HN_ENDPOINTS.BEST_STORIES, {
          signal,
        });
        return response.data;
      },
      { signal }
    );
  }

  /**
   * Fetch story IDs for Ask HN feed
   */
  async getAskStories(signal?: AbortSignal): Promise<number[]> {
    return RetryHandler.retryWithBackoff(
      async () => {
        const response = await this.client.get<number[]>(HN_ENDPOINTS.ASK_STORIES, {
          signal,
        });
        return response.data;
      },
      { signal }
    );
  }

  /**
   * Fetch story IDs by feed type
   */
  async getStoriesByFeed(feedType: FeedType, signal?: AbortSignal): Promise<number[]> {
    switch (feedType) {
      case 'top':
        return this.getTopStories(signal);
      case 'new':
        return this.getNewStories(signal);
      case 'best':
        return this.getBestStories(signal);
      case 'ask':
        return this.getAskStories(signal);
      default:
        throw new Error(`Unknown feed type: ${feedType}`);
    }
  }

  /**
   * Fetch a single item by ID
   */
  async getItem(id: number, signal?: AbortSignal): Promise<HNArticle | null> {
    return RetryHandler.retryWithBackoff(
      async () => {
        const response = await this.client.get<HNArticle | null>(HN_ENDPOINTS.ITEM(id), {
          signal,
        });
        return response.data;
      },
      { signal }
    );
  }

  /**
   * Fetch multiple items by IDs
   */
  async getItems(ids: number[], signal?: AbortSignal): Promise<HNArticle[]> {
    if (ids.length === 0) {
      return [];
    }

    // Fetch items in parallel with limited concurrency
    const results = await Promise.allSettled(ids.map(id => this.getItem(id, signal)));

    // Filter successful results and remove null values
    return results
      .filter(
        (result): result is PromiseFulfilledResult<HNArticle> =>
          result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  }

  /**
   * Fetch items in batches with concurrency limit
   */
  async getItemsBatched(
    ids: number[],
    batchSize: number = API_CONFIG.BATCH_SIZE,
    maxConcurrent: number = API_CONFIG.MAX_CONCURRENT,
    signal?: AbortSignal
  ): Promise<HNArticle[]> {
    if (ids.length === 0) {
      return [];
    }

    const articles: HNArticle[] = [];

    // Process in batches
    for (let i = 0; i < ids.length; i += batchSize) {
      // Check if request was cancelled
      if (signal?.aborted) {
        throw new Error('Request cancelled');
      }

      const batch = ids.slice(i, i + batchSize);
      console.log(`[HN API] Fetching batch ${i / batchSize + 1} (${batch.length} items)`);

      // Split batch into smaller chunks for concurrent requests
      const chunks: number[][] = [];
      for (let j = 0; j < batch.length; j += maxConcurrent) {
        chunks.push(batch.slice(j, j + maxConcurrent));
      }

      // Fetch each chunk concurrently
      for (const chunk of chunks) {
        if (signal?.aborted) {
          throw new Error('Request cancelled');
        }
        const chunkArticles = await this.getItems(chunk, signal);
        articles.push(...chunkArticles);
      }
    }

    return articles;
  }

  /**
   * Fetch user data by username
   */
  async getUser(username: string, signal?: AbortSignal): Promise<HNUser> {
    return RetryHandler.retryWithBackoff(
      async () => {
        const response = await this.client.get<HNUser>(HN_ENDPOINTS.USER(username), {
          signal,
        });
        return response.data;
      },
      { signal }
    );
  }

  /**
   * Fetch max item ID
   */
  async getMaxItemId(signal?: AbortSignal): Promise<number> {
    return RetryHandler.retryWithBackoff(
      async () => {
        const response = await this.client.get<number>(HN_ENDPOINTS.MAX_ITEM, {
          signal,
        });
        return response.data;
      },
      { signal }
    );
  }

  /**
   * Check if API is reachable
   */
  async ping(signal?: AbortSignal): Promise<boolean> {
    try {
      await this.client.get(HN_ENDPOINTS.MAX_ITEM, { timeout: 5000, signal });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
        return false;
      }
      return false;
    }
  }

  /**
   * Get error message from axios error
   */
  getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.code === 'ECONNABORTED') {
        return 'Request timeout. Please check your internet connection.';
      }

      if (axiosError.code === 'ERR_NETWORK') {
        return 'Network error. Please check your internet connection.';
      }

      if (axiosError.response) {
        return `Server error: ${axiosError.response.status}`;
      }

      return axiosError.message;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return 'Unknown error occurred';
  }
}

// Export singleton instance
export const hnApi = new HackerNewsAPI();
