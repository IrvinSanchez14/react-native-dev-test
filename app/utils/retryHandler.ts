import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/env';

// Retry configuration
export const DEFAULT_MAX_RETRIES = API_CONFIG.MAX_RETRIES;
export const DEFAULT_RETRY_DELAY = API_CONFIG.RETRY_DELAY;

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry a function with exponential backoff
 * Handles AbortSignal cancellation and doesn't retry cancelled requests
 */
export class RetryHandler {
  /**
   * Retry a function with exponential backoff
   */
  static async retryWithBackoff<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const {
      maxRetries = DEFAULT_MAX_RETRIES,
      retryDelay = DEFAULT_RETRY_DELAY,
      signal,
      onRetry,
    } = options;

    let lastError: Error | unknown;
    let retries = maxRetries;

    while (retries >= 0) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Don't retry if request was cancelled
        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
          throw error;
        }

        if (signal?.aborted) {
          throw new Error('Request cancelled');
        }

        // Don't retry if we're out of retries
        if (retries === 0) {
          break;
        }

        const attempt = maxRetries - retries + 1;
        const delay = retryDelay * attempt;

        if (onRetry && error instanceof Error) {
          onRetry(attempt, error);
        } else {
          console.log(
            `[RetryHandler] Retrying in ${delay}ms... (${retries} retries left)`
          );
        }

        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
        retries--;
      }
    }

    throw lastError;
  }

  /**
   * Check if an error should be retried
   */
  static shouldRetry(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Don't retry cancelled requests
      if (axiosError.code === 'ERR_CANCELED') {
        return false;
      }

      // Don't retry client errors (4xx) except for specific cases
      if (axiosError.response) {
        const status = axiosError.response.status;
        // Retry on 408 (Request Timeout), 429 (Too Many Requests), 5xx errors
        return status === 408 || status === 429 || status >= 500;
      }

      // Retry on network errors
      return axiosError.code === 'ERR_NETWORK' || axiosError.code === 'ECONNABORTED';
    }

    // Retry on generic errors
    return true;
  }
}
