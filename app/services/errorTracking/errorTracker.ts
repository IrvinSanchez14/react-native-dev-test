export interface ErrorTracker {
  captureException(error: Error, context?: Record<string, unknown>): void;
  captureMessage(message: string, level?: 'error' | 'warning' | 'info'): void;
  setUser(userId: string, email?: string, username?: string): void;
  setContext(key: string, context: Record<string, unknown>): void;
  clearContext(): void;
}

class ConsoleErrorTracker implements ErrorTracker {
  captureException(error: Error, context?: Record<string, unknown>): void {
  }

  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'error'): void {
  }

  setUser(userId: string, email?: string, username?: string): void {
  }

  setContext(key: string, context: Record<string, unknown>): void {
  }

  clearContext(): void {
  }
}

export const errorTracker: ErrorTracker = new ConsoleErrorTracker();

export function initializeErrorTracking(dsn?: string): void {
  if (__DEV__) {
    return;
  }
}
