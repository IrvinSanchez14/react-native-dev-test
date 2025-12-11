// Simplified article type for mobile articles from Algolia API

export interface MobileArticle {
  id: string; // objectID from Algolia
  title: string;
  url: string;
  author: string;
  points: number;
  numComments: number;
  createdAt: number; // Unix timestamp
  createdAtString: string; // ISO string from API

  // Local metadata
  fetchedAt: number;
  isDeleted: boolean;
  deletedAt?: number;
  isFavorite: boolean;
  favoritedAt?: number;
}

export interface MobileArticleRow {
  id: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: number;
  created_at_string: string;
  fetched_at: number;
  is_deleted: number; // SQLite boolean (0 or 1)
  deleted_at: number | null;
  is_favorite: number; // SQLite boolean (0 or 1)
  favorited_at: number | null;
}

// Notification preferences
export type NotificationTopic = 'android' | 'ios' | 'both';

export interface NotificationPreferences {
  enabled: boolean;
  topics: NotificationTopic;
  lastCheckedTimestamp: number | null;
}
