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

export interface HNUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

export interface Article extends HNArticle {
  isRead: boolean;
  isSaved: boolean;
  isFavorite: boolean;

  fetchedAt: number;
  readAt?: number;
  savedAt?: number;
  favoritedAt?: number;

  feeds: FeedType[];
}

export type FeedType = 'top' | 'new' | 'best' | 'ask';

export interface ArticleActions {
  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  saveArticle: (id: number) => Promise<void>;
  unsaveArticle: (id: number) => Promise<void>;
  favoriteArticle: (id: number) => Promise<void>;
  unfavoriteArticle: (id: number) => Promise<void>;
  deleteArticle: (id: number) => Promise<void>;
}

export interface NotificationConfig {
  newTopStories: boolean;
  readLaterReminders: boolean;
  dailyDigest: boolean;
  trendingAlerts: boolean;

  dailyDigestTime: string; 
  readLaterReminderHours: number; 
}

export type NotificationType = 'new_top' | 'read_later' | 'daily_digest' | 'trending';

export interface ArticleNotification {
  id: string;
  type: NotificationType;
  articleIds: number[];
  scheduledFor: number;
  sent: boolean;
  createdAt: number;
}

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
  kids: string | null; 
  is_read: number; 
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
  article_ids: string;
  scheduled_for: number;
  sent: number; 
  created_at: number;
}

export interface HNStoriesResponse {
  ids: number[];
  feed: FeedType;
}

export interface UserPreferences {
  notificationConfig: NotificationConfig;
  themeMode: 'light' | 'dark' | 'auto';
  articlesPerPage: number;
  hasCompletedOnboarding: boolean;
  notificationPermissionAsked: boolean;
}

export interface CacheMetadata {
  lastSyncTop: number | null;
  lastSyncNew: number | null;
  lastSyncBest: number | null;
  lastSyncAsk: number | null;
  lastCacheCleanup: number | null;
  cacheVersion: number;
}

export type SwipeAction = 'read' | 'unread' | 'save' | 'unsave' | 'favorite' | 'unfavorite' | 'delete';

export type ArticleFilter = 'all' | 'unread' | 'saved' | 'favorites';
export type ArticleSort = 'time' | 'score' | 'title';
export type SortDirection = 'asc' | 'desc';
