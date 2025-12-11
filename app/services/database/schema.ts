

export const SCHEMA_VERSION = 1;


export const CREATE_ARTICLES_TABLE = `
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    text TEXT,
    by TEXT NOT NULL,
    time INTEGER NOT NULL,
    score INTEGER NOT NULL,
    descendants INTEGER,
    type TEXT NOT NULL,
    kids TEXT,

    is_read INTEGER DEFAULT 0,
    is_saved INTEGER DEFAULT 0,
    is_favorite INTEGER DEFAULT 0,

    fetched_at INTEGER NOT NULL,
    read_at INTEGER,
    saved_at INTEGER,
    favorited_at INTEGER
  );
`;


export const CREATE_ARTICLE_FEEDS_TABLE = `
  CREATE TABLE IF NOT EXISTS article_feeds (
    article_id INTEGER NOT NULL,
    feed_type TEXT NOT NULL,
    position INTEGER NOT NULL,
    fetched_at INTEGER NOT NULL,

    PRIMARY KEY (article_id, feed_type),
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
  );
`;


export const CREATE_NOTIFICATION_QUEUE_TABLE = `
  CREATE TABLE IF NOT EXISTS notification_queue (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    article_ids TEXT NOT NULL,
    scheduled_for INTEGER NOT NULL,
    sent INTEGER DEFAULT 0,
    created_at INTEGER NOT NULL
  );
`;


export const CREATE_ARTICLES_SAVED_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_articles_saved
  ON articles(is_saved, saved_at DESC)
  WHERE is_saved = 1;
`;

export const CREATE_ARTICLES_FAVORITE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_articles_favorite
  ON articles(is_favorite, favorited_at DESC)
  WHERE is_favorite = 1;
`;

export const CREATE_ARTICLES_UNREAD_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_articles_unread
  ON articles(is_read, fetched_at DESC)
  WHERE is_read = 0;
`;

export const CREATE_ARTICLE_FEEDS_TYPE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_article_feeds_type
  ON article_feeds(feed_type, position);
`;


export const CREATE_ARTICLE_FEEDS_TYPE_POSITION_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_article_feeds_type_position
  ON article_feeds(feed_type, position ASC);
`;


export const CREATE_ARTICLES_TIME_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_articles_time
  ON articles(time DESC);
`;


export const CREATE_ARTICLES_FETCHED_AT_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_articles_fetched_at
  ON articles(fetched_at DESC);
`;


export const CREATE_ARTICLES_FEED_READ_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_articles_feed_read
  ON articles(id, is_read, fetched_at DESC);
`;

export const CREATE_NOTIFICATION_QUEUE_PENDING_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_notification_queue_pending
  ON notification_queue(sent, scheduled_for)
  WHERE sent = 0;
`;


export const CREATE_TABLES = [
  CREATE_ARTICLES_TABLE,
  CREATE_ARTICLE_FEEDS_TABLE,
  CREATE_NOTIFICATION_QUEUE_TABLE,
];


export const CREATE_INDEXES = [
  CREATE_ARTICLES_SAVED_INDEX,
  CREATE_ARTICLES_FAVORITE_INDEX,
  CREATE_ARTICLES_UNREAD_INDEX,
  CREATE_ARTICLE_FEEDS_TYPE_INDEX,
  CREATE_ARTICLE_FEEDS_TYPE_POSITION_INDEX,
  CREATE_ARTICLES_TIME_INDEX,
  CREATE_ARTICLES_FETCHED_AT_INDEX,
  CREATE_ARTICLES_FEED_READ_INDEX,
  CREATE_NOTIFICATION_QUEUE_PENDING_INDEX,
];


export const DROP_TABLES = [
  'DROP TABLE IF EXISTS notification_queue;',
  'DROP TABLE IF EXISTS article_feeds;',
  'DROP TABLE IF EXISTS articles;',
];


export interface Migration {
  version: number;
  up: string[];
  down: string[];
}

export const MIGRATIONS: Migration[] = [

  {
    version: 1,
    up: [...CREATE_TABLES, ...CREATE_INDEXES],
    down: DROP_TABLES,
  },







];
