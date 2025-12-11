import axios, { AxiosInstance } from 'axios';
import { ALGOLIA_API_CONFIG, API_CONFIG } from '../../config/env';

const BASE_URL = ALGOLIA_API_CONFIG.BASE_URL;
const MOBILE_QUERY = ALGOLIA_API_CONFIG.MOBILE_QUERY;

export interface AlgoliaArticle {
  objectID: string;
  created_at: string;
  created_at_i: number;
  title: string;
  url: string;
  author: string;
  points: number;
  story_text: string | null;
  comment_text: string | null;
  num_comments: number;
  story_id: number | null;
  story_title: string | null;
  story_url: string | null;
  parent_id: number | null;
  _tags: string[];
}

export interface AlgoliaResponse {
  hits: AlgoliaArticle[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
  exhaustiveNbHits: boolean;
  query: string;
  params: string;
  processingTimeMS: number;
}

class AlgoliaAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });
  }

  /**
   * Fetch mobile-related articles sorted by date
   */
  async fetchMobileArticles(page: number = 0, signal?: AbortSignal): Promise<AlgoliaResponse> {
    try {
      const response = await this.client.get<AlgoliaResponse>('/search_by_date', {
        params: {
          query: MOBILE_QUERY,
          page,
          hitsPerPage: ALGOLIA_API_CONFIG.HITS_PER_PAGE,
          tags: 'story', // Only get stories, not comments
        },
        signal,
      });

      console.log(`[Algolia] Fetched ${response.data.hits.length} mobile articles`);
      return response.data;
    } catch (error) {
      console.error('[Algolia] Error fetching articles:', error);
      throw error;
    }
  }

  /**
   * Check if API is reachable
   */
  async ping(signal?: AbortSignal): Promise<boolean> {
    try {
      await this.client.get('/search_by_date', {
        params: { query: 'test', hitsPerPage: 1 },
        timeout: 5000,
        signal,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const algoliaApi = new AlgoliaAPI();
