

function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}


function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export const HN_API_CONFIG = {
  BASE_URL: getEnv('EXPO_PUBLIC_HN_API_BASE_URL', 'https://hacker-news.firebaseio.com/v0'),
} as const;

export const ALGOLIA_API_CONFIG = {
  BASE_URL: getEnv('EXPO_PUBLIC_ALGOLIA_API_BASE_URL', 'https://hn.algolia.com/api/v1'),
  MOBILE_QUERY: getEnv('EXPO_PUBLIC_ALGOLIA_MOBILE_QUERY', 'mobile'),
  HITS_PER_PAGE: getEnvNumber('EXPO_PUBLIC_ALGOLIA_HITS_PER_PAGE', 30),
} as const;

export const API_CONFIG = {
  TIMEOUT: getEnvNumber('EXPO_PUBLIC_API_TIMEOUT', 10000),
  MAX_RETRIES: getEnvNumber('EXPO_PUBLIC_API_MAX_RETRIES', 3),
  RETRY_DELAY: getEnvNumber('EXPO_PUBLIC_API_RETRY_DELAY', 1000),
  BATCH_SIZE: getEnvNumber('EXPO_PUBLIC_API_BATCH_SIZE', 20),
  MAX_CONCURRENT: getEnvNumber('EXPO_PUBLIC_API_MAX_CONCURRENT', 5),
} as const;

export const ERROR_TRACKING_CONFIG = {
  SENTRY_DSN: getEnv('EXPO_PUBLIC_SENTRY_DSN', ''),
} as const;
