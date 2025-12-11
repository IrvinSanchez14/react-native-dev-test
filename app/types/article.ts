// Core HN API response types
export interface HNArticle {
  id: number;
  title: string;
  url?: string;
  text?: string;
  by: string;
  time: number;
  score: number;
  descendants?: number;
  type: 'story' | 'ask' | 'job' | 'poll';
  kids?: number[];
}

// HN User type
export interface HNUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

// Enhanced article with user interaction data
export interface Article extends HNArticle {
  // User interaction flags
  isRead: boolean;
  isSaved: boolean;
  isFavorite: boolean;

  // Metadata timestamps
  fetchedAt: number;
  readAt?: number;
  savedAt?: number;
  favoritedAt?: number;

  // Feed classification
  feeds: FeedType[];
}

// Feed types
export type FeedType = 'top' | 'new' | 'best' | 'ask';

// Article action handlers
export interface ArticleActions {
  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  saveArticle: (id: number) => Promise<void>;
  unsaveArticle: (id: number) => Promise<void>;
  favoriteArticle: (id: number) => Promise<void>;
  unfavoriteArticle: (id: number) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;
}

// Notification configuration
export interface NotificationConfig {
  newTopStories: boolean;
  readLaterReminders: boolean;
  dailyDigest: boolean;
  trendingAlerts: boolean;

  // Timing settings
  dailyDigestTime: string; // Format: "09:00"
  readLaterReminderHours: number; // Default: 24
}

// Notification types
export type NotificationType = 'new_top' | 'read_later' | 'daily_digest' | 'trending';

export interface ArticleNotification {
  id: string;
  type: NotificationType;
  articleIds: number[];
  scheduledFor: number;
  sent: boolean;
  createdAt: number;
}

// Database row types (for SQLite queries)
export interface ArticleRow {
  id: number;
  title: string;
  url: string | null;
  text: string | null;
  by: string;
  time: number;
  score: number;
  descendants: number | null;
  type: string;
  kids: string | null; // JSON array
  is_read: number; // SQLite boolean (0 or 1)
  is_saved: number;
  is_favorite: number;
  fetched_at: number;
  read_at: number | null;
  saved_at: number | null;
  favorited_at: number | null;
}

export interface ArticleFeedRow {
  article_id: number;
  feed_type: FeedType;
  position: number;
  fetched_at: number;
}

export interface NotificationQueueRow {
  id: string;
  type: NotificationType;
  article_ids: string; // JSON array
  scheduled_for: number;
  sent: number; // SQLite boolean (0 or 1)
  created_at: number;
}

// API response types
export interface HNStoriesResponse {
  ids: number[];
  feed: FeedType;
}

// User preferences
export interface UserPreferences {
  notificationConfig: NotificationConfig;
  themeMode: 'light' | 'dark' | 'auto';
  articlesPerPage: number;
  hasCompletedOnboarding: boolean;
  notificationPermissionAsked: boolean;
}

// Cache metadata
export interface CacheMetadata {
  lastSyncTop: number | null;
  lastSyncNew: number | null;
  lastSyncBest: number | null;
  lastSyncAsk: number | null;
  lastCacheCleanup: number | null;
  cacheVersion: number;
}

// Swipe action types
export type SwipeAction = 'read' | 'unread' | 'save' | 'unsave' | 'favorite' | 'unfavorite' | 'delete';

// Filter and sort options
export type ArticleFilter = 'all' | 'unread' | 'saved' | 'favorites';
export type ArticleSort = 'time' | 'score' | 'title';
export type SortDirection = 'asc' | 'desc';
