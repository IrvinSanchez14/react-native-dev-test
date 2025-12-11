
import { API_CONFIG } from '../config/env';

export const COLORS = {
  HN_ORANGE: '#FF6600',
  HN_ORANGE_DARK: '#F0652F',
  HN_ORANGE_LIGHT: '#FF7733',
};

export const CACHE_SETTINGS = {
  DAYS_TO_KEEP: 30,
  CLEANUP_INTERVAL_DAYS: 7,
};

export const FEED_SETTINGS = {
  DEFAULT_LIMIT: 30,
  MAX_LIMIT: 100,
  MIN_LIMIT: 10,
};

export const NOTIFICATION_SETTINGS = {
  BACKGROUND_FETCH_INTERVAL: 30 * 60, 
  TRENDING_CHECK_INTERVAL: 2 * 60 * 60, 
  DEFAULT_DAILY_DIGEST_TIME: '09:00',
  DEFAULT_READ_LATER_HOURS: 24,
};

export const API_SETTINGS = {
  TIMEOUT: API_CONFIG.TIMEOUT,
  MAX_RETRIES: API_CONFIG.MAX_RETRIES,
  RETRY_DELAY: API_CONFIG.RETRY_DELAY,
  BATCH_SIZE: API_CONFIG.BATCH_SIZE,
  MAX_CONCURRENT: API_CONFIG.MAX_CONCURRENT,
};

export const UI_SETTINGS = {
  ARTICLE_CARD_HEIGHT: 100,
  REFRESH_THRESHOLD: 80,
  ANIMATION_DURATION: 200,
};

export const SWIPE_SETTINGS = {
  ACTIVATION_THRESHOLD: 80,
  LEFT_ACTION_COLOR: '#4CAF50', 
  RIGHT_ACTION_COLOR: '#F44336', 
};

export const TIME_FORMATS = {
  RELATIVE: 'relative', 
  ABSOLUTE: 'absolute', 
  FULL: 'full', 
};

export const FEED_NAMES = {
  top: 'Top Stories',
  new: 'New',
  best: 'Best',
  ask: 'Ask HN',
} as const;

export const FEED_ICONS = {
  top: 'fire',
  new: 'new-box',
  best: 'star',
  ask: 'help-circle',
  saved: 'bookmark',
} as const;
