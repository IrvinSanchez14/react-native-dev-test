import { database } from './database';
import { Article, HNArticle, FeedType, ArticleRow, ArticleFeedRow } from '../../types/article';

class ArticleRepository {
  /**
   * Convert database row to Article object
   */
  private rowToArticle(row: ArticleRow): Article {
    return {
      id: row.id,
      title: row.title,
      url: row.url || undefined,
      text: row.text || undefined,
      by: row.by,
      time: row.time,
      score: row.score,
      descendants: row.descendants || undefined,
      type: row.type as 'story' | 'ask' | 'job' | 'poll',
      kids: row.kids ? JSON.parse(row.kids) : undefined,
      isRead: row.is_read === 1,
      isSaved: row.is_saved === 1,
      isFavorite: row.is_favorite === 1,
      fetchedAt: row.fetched_at,
      readAt: row.read_at || undefined,
      savedAt: row.saved_at || undefined,
      favoritedAt: row.favorited_at || undefined,
      feeds: [], // Will be populated separately if needed
    };
  }

  /**
   * Insert a single article
   */
  async insert(article: HNArticle, feed: FeedType, position: number = 0): Promise<void> {
    const now = Date.now();
    const kids = article.kids ? JSON.stringify(article.kids) : null;

    await database.run(
      `INSERT OR REPLACE INTO articles
       (id, title, url, text, by, time, score, descendants, type, kids, fetched_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        article.id,
        article.title,
        article.url || null,
        article.text || null,
        article.by,
        article.time,
        article.score,
        article.descendants || null,
        article.type,
        kids,
        now,
      ]
    );

    // Insert feed mapping
    await database.run(
      `INSERT OR REPLACE INTO article_feeds
       (article_id, feed_type, position, fetched_at)
       VALUES (?, ?, ?, ?)`,
      [article.id, feed, position, now]
    );
  }

  /**
   * Bulk insert articles
   */
  async bulkInsert(articles: HNArticle[], feed: FeedType): Promise<void> {
    const now = Date.now();
    const statements = [];

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const kids = article.kids ? JSON.stringify(article.kids) : null;

      statements.push({
        sql: `INSERT OR REPLACE INTO articles
              (id, title, url, text, by, time, score, descendants, type, kids, fetched_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        params: [
          article.id,
          article.title,
          article.url || null,
          article.text || null,
          article.by,
          article.time,
          article.score,
          article.descendants || null,
          article.type,
          kids,
          now,
        ],
      });

      statements.push({
        sql: `INSERT OR REPLACE INTO article_feeds
              (article_id, feed_type, position, fetched_at)
              VALUES (?, ?, ?, ?)`,
        params: [article.id, feed, i, now],
      });
    }

    await database.transaction(statements);
  }

  /**
   * Get article by ID
   */
  async getById(id: number): Promise<Article | null> {
    const row = await database.getFirst<ArticleRow>(
      'SELECT * FROM articles WHERE id = ?',
      [id]
    );

    if (!row) {
      return null;
    }

    return this.rowToArticle(row);
  }

  /**
   * Get multiple articles by IDs
   */
  async getByIds(ids: number[]): Promise<Article[]> {
    if (ids.length === 0) {
      return [];
    }

    const placeholders = ids.map(() => '?').join(',');
    const rows = await database.getAll<ArticleRow>(
      `SELECT * FROM articles WHERE id IN (${placeholders})`,
      ids
    );

    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Get articles for a specific feed
   * Optimized query using index on (feed_type, position)
   */
  async getByFeed(feed: FeedType, limit: number = 30, offset: number = 0): Promise<Article[]> {
    // Use indexed query for better performance
    const rows = await database.getAll<ArticleRow>(
      `SELECT a.* 
       FROM articles a
       INNER JOIN article_feeds af ON a.id = af.article_id
       WHERE af.feed_type = ?
       ORDER BY af.position ASC
       LIMIT ? OFFSET ?`,
      [feed, limit, offset]
    );

    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Get saved articles
   */
  async getSavedArticles(limit?: number): Promise<Article[]> {
    const sql = `SELECT * FROM articles
                 WHERE is_saved = 1
                 ORDER BY saved_at DESC
                 ${limit ? 'LIMIT ?' : ''}`;
    const params = limit ? [limit] : [];

    const rows = await database.getAll<ArticleRow>(sql, params);
    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Get favorite articles
   */
  async getFavoriteArticles(limit?: number): Promise<Article[]> {
    const sql = `SELECT * FROM articles
                 WHERE is_favorite = 1
                 ORDER BY favorited_at DESC
                 ${limit ? 'LIMIT ?' : ''}`;
    const params = limit ? [limit] : [];

    const rows = await database.getAll<ArticleRow>(sql, params);
    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Get unread articles
   */
  async getUnreadArticles(limit?: number): Promise<Article[]> {
    const sql = `SELECT * FROM articles
                 WHERE is_read = 0
                 ORDER BY fetched_at DESC
                 ${limit ? 'LIMIT ?' : ''}`;
    const params = limit ? [limit] : [];

    const rows = await database.getAll<ArticleRow>(sql, params);
    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Mark article as read
   */
  async markAsRead(id: number): Promise<void> {
    const now = Date.now();
    await database.run(
      'UPDATE articles SET is_read = 1, read_at = ? WHERE id = ?',
      [now, id]
    );
  }

  /**
   * Mark article as unread
   */
  async markAsUnread(id: number): Promise<void> {
    await database.run(
      'UPDATE articles SET is_read = 0, read_at = NULL WHERE id = ?',
      [id]
    );
  }

  /**
   * Save article (bookmark)
   */
  async saveArticle(id: number): Promise<void> {
    const now = Date.now();
    await database.run(
      'UPDATE articles SET is_saved = 1, saved_at = ? WHERE id = ?',
      [now, id]
    );
  }

  /**
   * Unsave article (remove bookmark)
   */
  async unsaveArticle(id: number): Promise<void> {
    await database.run(
      'UPDATE articles SET is_saved = 0, saved_at = NULL WHERE id = ?',
      [id]
    );
  }

  /**
   * Favorite article
   */
  async favoriteArticle(id: number): Promise<void> {
    const now = Date.now();
    await database.run(
      'UPDATE articles SET is_favorite = 1, favorited_at = ? WHERE id = ?',
      [now, id]
    );
  }

  /**
   * Unfavorite article
   */
  async unfavoriteArticle(id: number): Promise<void> {
    await database.run(
      'UPDATE articles SET is_favorite = 0, favorited_at = NULL WHERE id = ?',
      [id]
    );
  }

  /**
   * Delete article completely
   */
  async deleteArticle(id: number): Promise<void> {
    // Foreign key constraint will auto-delete from article_feeds
    await database.run('DELETE FROM articles WHERE id = ?', [id]);
  }

  /**
   * Check if article exists
   */
  async exists(id: number): Promise<boolean> {
    const result = await database.getFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM articles WHERE id = ?',
      [id]
    );

    return (result?.count || 0) > 0;
  }

  /**
   * Get total article count
   */
  async getCount(): Promise<number> {
    const result = await database.getFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM articles'
    );

    return result?.count || 0;
  }

  /**
   * Get count by filter
   */
  async getCountByFilter(filter: 'saved' | 'favorite' | 'unread'): Promise<number> {
    const conditions = {
      saved: 'is_saved = 1',
      favorite: 'is_favorite = 1',
      unread: 'is_read = 0',
    };

    const result = await database.getFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM articles WHERE ${conditions[filter]}`
    );

    return result?.count || 0;
  }

  /**
   * Get count of articles for a specific feed
   */
  async getCountByFeed(feed: FeedType): Promise<number> {
    const result = await database.getFirst<{ count: number }>(
      `SELECT COUNT(*) as count FROM articles a
       INNER JOIN article_feeds af ON a.id = af.article_id
       WHERE af.feed_type = ?`,
      [feed]
    );

    return result?.count || 0;
  }

  /**
   * Clean up old articles (keep saved/favorited)
   */
  async cleanupOldArticles(daysToKeep: number = 30): Promise<number> {
    const cutoffTime = Date.now() - daysToKeep * 24 * 60 * 60 * 1000;

    const result = await database.run(
      `DELETE FROM articles
       WHERE fetched_at < ?
       AND is_saved = 0
       AND is_favorite = 0`,
      [cutoffTime]
    );

    return result.changes;
  }

  /**
   * Clear all feed mappings for a specific feed
   */
  async clearFeed(feed: FeedType): Promise<void> {
    await database.run('DELETE FROM article_feeds WHERE feed_type = ?', [feed]);
  }

  /**
   * Get articles that were recently updated (for sync)
   * Optimized to use fetched_at index
   */
  async getRecentArticles(since: number, feed?: FeedType): Promise<Article[]> {
    let sql = `SELECT a.* FROM articles a`;
    const params: unknown[] = [since];

    if (feed) {
      // Use indexed join for better performance
      sql += ` INNER JOIN article_feeds af ON a.id = af.article_id
               WHERE af.feed_type = ? AND a.fetched_at > ?
               ORDER BY a.fetched_at DESC`;
      params.unshift(feed);
    } else {
      // Use fetched_at index for ordering
      sql += ` WHERE a.fetched_at > ?
               ORDER BY a.fetched_at DESC`;
    }

    const rows = await database.getAll<ArticleRow>(sql, params);
    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Search articles by title
   * Uses FTS (Full-Text Search) if available, otherwise falls back to LIKE
   * For better performance, consider creating an FTS virtual table
   */
  async search(query: string, limit: number = 50): Promise<Article[]> {
    // Use indexed time column for ordering
    const rows = await database.getAll<ArticleRow>(
      `SELECT * FROM articles
       WHERE title LIKE ? OR text LIKE ?
       ORDER BY time DESC
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, limit]
    );

    return rows.map(row => this.rowToArticle(row));
  }

  /**
   * Get article statistics
   */
  async getStatistics(): Promise<{
    total: number;
    saved: number;
    favorite: number;
    unread: number;
    read: number;
  }> {
    const [total, saved, favorite, unread, read] = await Promise.all([
      this.getCount(),
      this.getCountByFilter('saved'),
      this.getCountByFilter('favorite'),
      this.getCountByFilter('unread'),
      database
        .getFirst<{ count: number }>('SELECT COUNT(*) as count FROM articles WHERE is_read = 1')
        .then(r => r?.count || 0),
    ]);

    return { total, saved, favorite, unread, read };
  }
}

// Export singleton instance
export const articleRepository = new ArticleRepository();
