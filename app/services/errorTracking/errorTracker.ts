/**
 * Error tracking service interface
 * Allows for easy integration with services like Sentry, Bugsnag, etc.
 */
export interface ErrorTracker {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, level?: 'error' | 'warning' | 'info'): void;
  setUser(userId: string, email?: string, username?: string): void;
  setContext(key: string, context: Record<string, unknown>): void;
  clearContext(): void;
}

/**
 * Console-based error tracker (for development)
 * In production, replace with actual error tracking service
 */
class ConsoleErrorTracker implements ErrorTracker {
  captureException(error: Error, context?: Record<string, unknown>): void {
    console.error('[ErrorTracker] Exception:', error);
    if (context) {
      console.error('[ErrorTracker] Context:', context);
    }
    console.error('[ErrorTracker] Stack:', error.stack);
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'error'): void {
    const logMethod = level === 'error' ? console.error : level === 'warning' ? console.warn : console.info;
    logMethod(`[ErrorTracker] ${level.toUpperCase()}:`, message);
  }

  setUser(userId: string, email?: string, username?: string): void {
    console.log('[ErrorTracker] User:', { userId, email, username });
  }

  setContext(key: string, context: Record<string, unknown>): void {
    console.log(`[ErrorTracker] Context [${key}]:`, context);
  }

  clearContext(): void {
    console.log('[ErrorTracker] Context cleared');
  }
}

/**
 * Sentry error tracker implementation
 * Uncomment and configure when Sentry is installed
 */
/*
import * as Sentry from '@sentry/react-native';

class SentryErrorTracker implements ErrorTracker {
  captureException(error: Error, context?: Record<string, unknown>): void {
    if (context) {
      Sentry.setContext('additional', context);
    }
    Sentry.captureException(error);
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'error'): void {
    const sentryLevel: Sentry.SeverityLevel =
      level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'info';
    Sentry.captureMessage(message, sentryLevel);
  }

  setUser(userId: string, email?: string, username?: string): void {
    Sentry.setUser({ id: userId, email, username });
  }

  setContext(key: string, context: Record<string, unknown>): void {
    Sentry.setContext(key, context);
  }

  clearContext(): void {
    Sentry.setContexts({});
  }
}
*/

// Export singleton instance
// In production, replace with: export const errorTracker = new SentryErrorTracker();
export const errorTracker: ErrorTracker = new ConsoleErrorTracker();

/**
 * Initialize error tracking
 * Call this in App.tsx or index.ts
 */
export function initializeErrorTracking(dsn?: string): void {
  if (__DEV__) {
    console.log('[ErrorTracker] Initialized in development mode');
    return;
  }

  // Initialize Sentry here when ready
  /*
  if (dsn) {
    Sentry.init({
      dsn,
      enableInExpoDevelopment: false,
      debug: false,
    });
  }
  */
}
