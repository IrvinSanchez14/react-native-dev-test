
export const STORAGE_KEYS = {

  NOTIFICATION_CONFIG: '@hn_app/notification_config',
  THEME_MODE: '@hn_app/theme_mode',
  ARTICLES_PER_PAGE: '@hn_app/articles_per_page',


  LAST_SYNC_TOP: '@hn_app/last_sync_top',
  LAST_SYNC_NEW: '@hn_app/last_sync_new',
  LAST_SYNC_BEST: '@hn_app/last_sync_best',
  LAST_SYNC_ASK: '@hn_app/last_sync_ask',


  CACHE_VERSION: '@hn_app/cache_version',
  LAST_CACHE_CLEANUP: '@hn_app/last_cache_cleanup',
  LAST_NOTIFIED_STORY_ID: '@hn_app/last_notified_story_id',


  HAS_COMPLETED_ONBOARDING: '@hn_app/onboarding_complete',
  NOTIFICATION_PERMISSION_ASKED: '@hn_app/notification_permission_asked',


  REACT_QUERY_OFFLINE_CACHE: '@hn_app/react_query_cache',
} as const;


export const DEFAULT_VALUES = {
  NOTIFICATION_PREFERENCES: {
    enabled: false,
    topics: 'both' as const,
    lastCheckedTimestamp: null,
  },
  THEME_MODE: 'auto' as const,
  ARTICLES_PER_PAGE: 30,
  CACHE_VERSION: 1,
  HAS_COMPLETED_ONBOARDING: false,
  NOTIFICATION_PERMISSION_ASKED: false,
} as const;
