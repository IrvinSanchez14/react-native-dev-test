export interface MobileArticle {
  id: string; 
  title: string;
  url: string;
  author: string;
  points: number;
  numComments: number;
  createdAt: number; 
  createdAtString: string; 
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
  is_deleted: number; 
  deleted_at: number | null;
  is_favorite: number; 
  favorited_at: number | null;
}

export type NotificationTopic = 'android' | 'ios' | 'both';

export interface NotificationPreferences {
  enabled: boolean;
  topics: NotificationTopic;
  lastCheckedTimestamp: number | null;
}
