import { database } from './database';
import { MobileArticle, MobileArticleRow } from '../../types/mobile-article';
import { AlgoliaArticle } from '../api/algoliaApi';

// SQL for mobile articles table
export const CREATE_MOBILE_ARTICLES_TABLE = `
  CREATE TABLE IF NOT EXISTS mobile_articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    author TEXT NOT NULL,
    points INTEGER NOT NULL,
    num_comments INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    created_at_string TEXT NOT NULL,
    fetched_at INTEGER NOT NULL,
    is_deleted INTEGER DEFAULT 0,
    deleted_at INTEGER,
    is_favorite INTEGER DEFAULT 0,
    favorited_at INTEGER
  );
`;

export const CREATE_MOBILE_ARTICLES_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_mobile_articles_date
  ON mobile_articles(created_at DESC, is_deleted);
`;

// Additional indexes for mobile articles
export const CREATE_MOBILE_ARTICLES_FAVORITE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_mobile_articles_favorite
  ON mobile_articles(is_favorite, favorited_at DESC)
  WHERE is_favorite = 1;
`;

export const CREATE_MOBILE_ARTICLES_DELETED_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_mobile_articles_deleted
  ON mobile_articles(is_deleted, deleted_at DESC)
  WHERE is_deleted = 1;
`;

class MobileArticleRepository {
  /**
   * Initialize table (call this once on app start)
   */
  async initialize(): Promise<void> {
    try {
      await database.exec(CREATE_MOBILE_ARTICLES_TABLE);
      await database.exec(CREATE_MOBILE_ARTICLES_INDEX);
      await database.exec(CREATE_MOBILE_ARTICLES_FAVORITE_INDEX);
      await database.exec(CREATE_MOBILE_ARTICLES_DELETED_INDEX);
      console.log('[MobileArticleRepo] Tables and indexes initialized');
    } catch (error) {
      console.error('[MobileArticleRepo] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Convert database row to MobileArticle
   */
  private rowToArticle(row: MobileArticleRow): MobileArticle {
    return {
      id: row.id,
      title: row.title,
      url: row.url,
      author: row.author,
      points: row.points,
      numComments: row.num_comments,
      createdAt: row.created_at,
      createdAtString: row.created_at_string,
      fetchedAt: row.fetched_at,
      isDeleted: row.is_deleted === 1,
      deletedAt: row.deleted_at || undefined,
      isFavorite: row.is_favorite === 1,
      favoritedAt: row.favorited_at || undefined,
    };
  }

  /**
   * Convert Algolia article to MobileArticle format
   */
  private algoliaToMobileArticle(algolia: AlgoliaArticle): MobileArticle {
    return {
      id: algolia.objectID,
      title: algolia.title || algolia.story_title || 'No title',
      url: algolia.url || algolia.story_url || '',
      author: algolia.author,
      points: algolia.points || 0,
      numComments: algolia.num_comments || 0,
      createdAt: algolia.created_at_i,
      createdAtString: algolia.created_at,
      fetchedAt: Date.now(),
      isDeleted: false,
      isFavorite: false,
    };
  }

  /**
   * Insert or update articles from Algolia API
   */
  async upsertArticles(algoliaArticles: AlgoliaArticle[]): Promise<void> {
    const statements = algoliaArticles
      .filter(a => a.title && a.url) // Only insert valid articles with title and URL
      .map(article => {
        const mobile = this.algoliaToMobileArticle(article);
        return {
          sql: `INSERT OR REPLACE INTO mobile_articles
                (id, title, url, author, points, num_comments, created_at, created_at_string, fetched_at,
                 is_deleted, deleted_at, is_favorite, favorited_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,
                  COALESCE((SELECT is_deleted FROM mobile_articles WHERE id = ?), 0),
                  (SELECT deleted_at FROM mobile_articles WHERE id = ?),
                  COALESCE((SELECT is_favorite FROM mobile_articles WHERE id = ?), 0),
                  (SELECT favorited_at FROM mobile_articles WHERE id = ?))`,
          params: [
            mobile.id,
            mobile.title,
            mobile.url,
            mobile.author,
            mobile.points,
            mobile.numComments,
            mobile.createdAt,
            mobile.createdAtString,
            mobile.fetchedAt,
            mobile.id, // For COALESCE to preserve deletion status
            mobile.id,
            mobile.id, // For COALESCE to preserve favorite status
            mobile.id,
          ],
        };
      });

    if (statements.length > 0) {
      await database.transaction(statements);
      console.log(`[MobileArticleRepo] Upserted ${statements.length} articles`);
    }
  }

  /**
   * Get all non-deleted articles sorted by date
   */
  async getArticles(limit?: number): Promise<MobileArticle[]> {
    const sql = `
      SELECT * FROM mobile_articles
      WHERE is_deleted = 0
      ORDER BY created_at DESC
      ${limit ? 'LIMIT ?' : ''}
    `;
    const params = limit ? [limit] : [];

    const rows = await database.getAll<MobileArticleRow>(sql, params);
    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Get article by ID
   */
  async getById(id: string): Promise<MobileArticle | null> {
    const row = await database.getFirst<MobileArticleRow>(
      'SELECT * FROM mobile_articles WHERE id = ?',
      [id]
    );

    return row ? this.rowToArticle(row) : null;
  }

  /**
   * Mark article as deleted
   */
  async deleteArticle(id: string): Promise<void> {
    const now = Date.now();
    await database.run(
      'UPDATE mobile_articles SET is_deleted = 1, deleted_at = ? WHERE id = ?',
      [now, id]
    );
    console.log(`[MobileArticleRepo] Deleted article ${id}`);
  }

  /**
   * Restore deleted article
   */
  async restoreArticle(id: string): Promise<void> {
    await database.run(
      'UPDATE mobile_articles SET is_deleted = 0, deleted_at = NULL WHERE id = ?',
      [id]
    );
    console.log(`[MobileArticleRepo] Restored article ${id}`);
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(id: string): Promise<void> {
    const article = await this.getById(id);
    if (!article) return;

    const now = Date.now();
    const newStatus = article.isFavorite ? 0 : 1;
    const favoritedAt = newStatus === 1 ? now : null;

    await database.run(
      'UPDATE mobile_articles SET is_favorite = ?, favorited_at = ? WHERE id = ?',
      [newStatus, favoritedAt, id]
    );
    console.log(`[MobileArticleRepo] Toggled favorite for ${id} to ${newStatus}`);
  }

  /**
   * Get favorite articles
   */
  async getFavoriteArticles(): Promise<MobileArticle[]> {
    const rows = await database.getAll<MobileArticleRow>(
      `SELECT * FROM mobile_articles
       WHERE is_favorite = 1
       ORDER BY favorited_at DESC`
    );
    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Get deleted articles
   */
  async getDeletedArticles(): Promise<MobileArticle[]> {
    const rows = await database.getAll<MobileArticleRow>(
      `SELECT * FROM mobile_articles
       WHERE is_deleted = 1
       ORDER BY deleted_at DESC`
    );
    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Check if article exists (including deleted ones)
   */
  async exists(id: string): Promise<boolean> {
    const result = await database.getFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM mobile_articles WHERE id = ?',
      [id]
    );
    return (result?.count || 0) > 0;
  }

  /**
   * Get total count of non-deleted articles
   */
  async getCount(): Promise<number> {
    const result = await database.getFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM mobile_articles WHERE is_deleted = 0'
    );
    return result?.count || 0;
  }

  /**
   * Clean up old articles (keep deleted article IDs for 30 days)
   */
  async cleanup(daysToKeep: number = 30): Promise<number> {
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

    const result = await database.run(
      'DELETE FROM mobile_articles WHERE is_deleted = 1 AND deleted_at < ?',
      [cutoffTime]
    );

    console.log(`[MobileArticleRepo] Cleaned up ${result.changes} old deleted articles`);
    return result.changes;
  }

  /**
   * Clear all data (for testing)
   */
  async clearAll(): Promise<void> {
    await database.run('DELETE FROM mobile_articles');
    console.log('[MobileArticleRepo] Cleared all articles');
  }
}

export const mobileArticleRepository = new MobileArticleRepository();
