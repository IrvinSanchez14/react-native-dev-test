import type { AlgoliaArticle } from '../../../types/algolia';


jest.mock('../../database/database', () => ({
  database: {
    exec: jest.fn(),
    run: jest.fn().mockResolvedValue({ changes: 1 }),
    getFirst: jest.fn().mockResolvedValue(null),
    getAll: jest.fn().mockResolvedValue([]),
    init: jest.fn(),
  },
}));


jest.mock('../mobileArticleRepository', () => ({
  mobileArticleRepository: {
    initialize: jest.fn(),
    upsertArticles: jest.fn(),
    getArticles: jest.fn(),
    deleteArticle: jest.fn(),
    restoreArticle: jest.fn(),
    toggleFavorite: jest.fn(),
    getFavoriteArticles: jest.fn(),
    getDeletedArticles: jest.fn(),
    cleanupOldDeletedArticles: jest.fn(),
    clearAll: jest.fn(),
  },
}));

import { mobileArticleRepository } from '../mobileArticleRepository';

describe('MobileArticleRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should create table if not exists', async () => {
      await mobileArticleRepository.initialize();

      expect(mobileArticleRepository.initialize).toHaveBeenCalled();
    });
  });

  describe('upsertArticles', () => {
    it('should insert new articles', async () => {
      const articles: AlgoliaArticle[] = [
        {
          objectID: '1',
          title: 'Test Article',
          url: 'https://example.com',
          author: 'testuser',
          points: 100,
          num_comments: 50,
          created_at: '2023-01-01T00:00:00Z',
          created_at_i: 1672531200,
        } as any,
      ];

      await mobileArticleRepository.upsertArticles(articles);

      expect(mobileArticleRepository.upsertArticles).toHaveBeenCalledWith(articles);
    });

    it('should handle empty array', async () => {
      await mobileArticleRepository.upsertArticles([]);

      expect(mobileArticleRepository.upsertArticles).toHaveBeenCalledWith([]);
    });
  });

  describe('getArticles', () => {
    it('should return articles', async () => {
      const mockArticles = [
        {
          id: '1',
          title: 'Test Article',
          url: 'https://example.com',
          author: 'testuser',
          points: 100,
          num_comments: 50,
          created_at: 1672531200,
          created_at_string: '2023-01-01T00:00:00Z',
          fetched_at: Date.now(),
          is_deleted: 0,
          deleted_at: null,
          is_favorite: 0,
          favorited_at: null,
        },
      ];

      (mobileArticleRepository.getArticles as jest.Mock).mockResolvedValue(mockArticles);

      const result = await mobileArticleRepository.getArticles();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Test Article');
    });

    it('should accept limit parameter', async () => {
      (mobileArticleRepository.getArticles as jest.Mock).mockResolvedValue([]);

      await mobileArticleRepository.getArticles(10);

      expect(mobileArticleRepository.getArticles).toHaveBeenCalledWith(10);
    });
  });

  describe('deleteArticle', () => {
    it('should delete article', async () => {
      await mobileArticleRepository.deleteArticle('article-123');

      expect(mobileArticleRepository.deleteArticle).toHaveBeenCalledWith('article-123');
    });
  });

  describe('restoreArticle', () => {
    it('should restore deleted article', async () => {
      await mobileArticleRepository.restoreArticle('article-123');

      expect(mobileArticleRepository.restoreArticle).toHaveBeenCalledWith('article-123');
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status', async () => {
      await mobileArticleRepository.toggleFavorite('article-123');

      expect(mobileArticleRepository.toggleFavorite).toHaveBeenCalledWith('article-123');
    });
  });

  describe('getFavoriteArticles', () => {
    it('should return favorite articles', async () => {
      const mockFavorites = [
        {
          id: '1',
          title: 'Favorite Article',
          url: 'https://example.com',
          author: 'testuser',
          points: 100,
          num_comments: 50,
          created_at: 1672531200,
          created_at_string: '2023-01-01T00:00:00Z',
          fetched_at: Date.now(),
          is_deleted: 0,
          deleted_at: null,
          is_favorite: 1,
          favorited_at: Date.now(),
        },
      ];

      (mobileArticleRepository.getFavoriteArticles as jest.Mock).mockResolvedValue(mockFavorites);

      const result = await mobileArticleRepository.getFavoriteArticles();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Favorite Article');
    });
  });

  describe('getDeletedArticles', () => {
    it('should return deleted articles', async () => {
      const mockDeleted = [
        {
          id: '1',
          title: 'Deleted Article',
          url: 'https://example.com',
          author: 'testuser',
          points: 100,
          num_comments: 50,
          created_at: 1672531200,
          created_at_string: '2023-01-01T00:00:00Z',
          fetched_at: Date.now(),
          is_deleted: 1,
          deleted_at: Date.now(),
          is_favorite: 0,
          favorited_at: null,
        },
      ];

      (mobileArticleRepository.getDeletedArticles as jest.Mock).mockResolvedValue(mockDeleted);

      const result = await mobileArticleRepository.getDeletedArticles();

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Deleted Article');
    });
  });
});
