import { formatDistanceToNow, format, fromUnixTime, isToday, isYesterday } from 'date-fns';

/**
 * Format Unix timestamp to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(unixTimestamp: number): string {
  try {
    const date = fromUnixTime(unixTimestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

/**
 * Format Unix timestamp to short date (e.g., "Dec 9")
 */
export function formatShortDate(unixTimestamp: number): string {
  try {
    const date = fromUnixTime(unixTimestamp);

    if (isToday(date)) {
      return 'Today';
    }

    if (isYesterday(date)) {
      return 'Yesterday';
    }

    return format(date, 'MMM d');
  } catch (error) {
    console.error('Error formatting short date:', error);
    return 'Unknown date';
  }
}

/**
 * Format Unix timestamp to full date (e.g., "December 9, 2024")
 */
export function formatFullDate(unixTimestamp: number): string {
  try {
    const date = fromUnixTime(unixTimestamp);
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting full date:', error);
    return 'Unknown date';
  }
}

/**
 * Format Unix timestamp to date and time (e.g., "Dec 9 at 10:30 AM")
 */
export function formatDateTime(unixTimestamp: number): string {
  try {
    const date = fromUnixTime(unixTimestamp);
    return format(date, "MMM d 'at' h:mm a");
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Unknown date';
  }
}

/**
 * Get current Unix timestamp
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Convert milliseconds to Unix timestamp
 */
export function msToUnix(ms: number): number {
  return Math.floor(ms / 1000);
}

/**
 * Convert Unix timestamp to milliseconds
 */
export function unixToMs(unix: number): number {
  return unix * 1000;
}

/**
 * Check if a timestamp is older than X days
 */
export function isOlderThan(unixTimestamp: number, days: number): boolean {
  const now = Date.now();
  const age = now - unixToMs(unixTimestamp);
  const daysInMs = days * 24 * 60 * 60 * 1000;
  return age > daysInMs;
}

/**
 * Parse time string (HH:mm) to hours and minutes
 */
export function parseTimeString(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

/**
 * Format hours and minutes to time string (HH:mm)
 */
export function formatTimeString(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
