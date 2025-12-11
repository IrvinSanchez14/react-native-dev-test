import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


jest.mock('../algoliaApi', () => {
  const mockClient = {
    get: jest.fn(),
  };

  return {
    algoliaApi: {
      fetchMobileArticles: jest.fn(),
      ping: jest.fn(),
    },
  };
});

import { algoliaApi } from '../algoliaApi';

describe('AlgoliaApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchMobileArticles', () => {
    it('should fetch articles successfully', async () => {
      const mockResponse = {
        hits: [
          {
            objectID: '1',
            title: 'Test Article',
            url: 'https://example.com',
            author: 'testuser',
            points: 100,
            num_comments: 50,
            created_at: '2023-01-01T00:00:00Z',
            created_at_i: 1672531200,
          },
        ],
        page: 0,
        nbHits: 1,
        nbPages: 1,
        hitsPerPage: 30,
      };

      (algoliaApi.fetchMobileArticles as jest.Mock).mockResolvedValue(mockResponse);

      const result = await algoliaApi.fetchMobileArticles(0);

      expect(result.hits).toHaveLength(1);
      expect(result.hits[0].title).toBe('Test Article');
      expect(result.hits[0].objectID).toBe('1');
      expect(algoliaApi.fetchMobileArticles).toHaveBeenCalledWith(0);
    });

    it('should handle API errors gracefully', async () => {
      (algoliaApi.fetchMobileArticles as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      await expect(algoliaApi.fetchMobileArticles(0)).rejects.toThrow('Network error');
    });

    it('should fetch articles for specific page', async () => {
      const mockResponse = {
        hits: [],
        page: 2,
        nbHits: 0,
        nbPages: 3,
        hitsPerPage: 30,
      };

      (algoliaApi.fetchMobileArticles as jest.Mock).mockResolvedValue(mockResponse);

      const result = await algoliaApi.fetchMobileArticles(2);

      expect(result.page).toBe(2);
      expect(algoliaApi.fetchMobileArticles).toHaveBeenCalledWith(2);
    });
  });
});
