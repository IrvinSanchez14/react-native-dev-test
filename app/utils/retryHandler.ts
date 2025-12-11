import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/env';

export const DEFAULT_MAX_RETRIES = API_CONFIG.MAX_RETRIES;
export const DEFAULT_RETRY_DELAY = API_CONFIG.RETRY_DELAY;

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
  onRetry?: (attempt: number, error: Error) => void;
}

export class RetryHandler {
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

        if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
          throw error;
        }

        if (signal?.aborted) {
          throw new Error('Request cancelled');
        }

        if (retries === 0) {
          break;
        }

        const attempt = maxRetries - retries + 1;
        const delay = retryDelay * attempt;

        if (onRetry && error instanceof Error) {
          onRetry(attempt, error);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        retries--;
      }
    }

    throw lastError;
  }

  static shouldRetry(error: unknown): boolean {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.code === 'ERR_CANCELED') {
        return false;
      }

      if (axiosError.response) {
        const status = axiosError.response.status;
        return status === 408 || status === 429 || status >= 500;
      }

      return axiosError.code === 'ERR_NETWORK' || axiosError.code === 'ECONNABORTED';
    }

    return true;
  }
}
