// App-wide constants
import { API_CONFIG } from '../config/env';

// Hacker News branding
export const COLORS = {
  HN_ORANGE: '#FF6600',
  HN_ORANGE_DARK: '#F0652F',
  HN_ORANGE_LIGHT: '#FF7733',
};

// Cache settings
export const CACHE_SETTINGS = {
  DAYS_TO_KEEP: 30,
  CLEANUP_INTERVAL_DAYS: 7,
};

// Feed settings
export const FEED_SETTINGS = {
  DEFAULT_LIMIT: 30,
  MAX_LIMIT: 100,
  MIN_LIMIT: 10,
};

// Notification settings
export const NOTIFICATION_SETTINGS = {
  BACKGROUND_FETCH_INTERVAL: 30 * 60, // 30 minutes in seconds
  TRENDING_CHECK_INTERVAL: 2 * 60 * 60, // 2 hours in seconds
  DEFAULT_DAILY_DIGEST_TIME: '09:00',
  DEFAULT_READ_LATER_HOURS: 24,
};

// API settings
export const API_SETTINGS = {
  TIMEOUT: API_CONFIG.TIMEOUT,
  MAX_RETRIES: API_CONFIG.MAX_RETRIES,
  RETRY_DELAY: API_CONFIG.RETRY_DELAY,
  BATCH_SIZE: API_CONFIG.BATCH_SIZE,
  MAX_CONCURRENT: API_CONFIG.MAX_CONCURRENT,
};

// UI settings
export const UI_SETTINGS = {
  ARTICLE_CARD_HEIGHT: 100,
  REFRESH_THRESHOLD: 80,
  ANIMATION_DURATION: 200,
};

// Swipe action thresholds
export const SWIPE_SETTINGS = {
  ACTIVATION_THRESHOLD: 80,
  LEFT_ACTION_COLOR: '#4CAF50', // Green for save/favorite
  RIGHT_ACTION_COLOR: '#F44336', // Red for delete
};

// Time formats
export const TIME_FORMATS = {
  RELATIVE: 'relative', // "2 hours ago"
  ABSOLUTE: 'absolute', // "Dec 9, 2024"
  FULL: 'full', // "December 9, 2024 at 10:30 AM"
};

// Feed display names
export const FEED_NAMES = {
  top: 'Top Stories',
  new: 'New',
  best: 'Best',
  ask: 'Ask HN',
} as const;

// Feed icons (Material Community Icons)
export const FEED_ICONS = {
  top: 'fire',
  new: 'new-box',
  best: 'star',
  ask: 'help-circle',
  saved: 'bookmark',
} as const;
