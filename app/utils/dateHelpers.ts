import { formatDistanceToNow, format, fromUnixTime, isToday, isYesterday } from 'date-fns';

export function formatRelativeTime(unixTimestamp: number): string {
  try {
    const date = fromUnixTime(unixTimestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
}

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

export function formatFullDate(unixTimestamp: number): string {
  try {
    const date = fromUnixTime(unixTimestamp);
    return format(date, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting full date:', error);
    return 'Unknown date';
  }
}

export function formatDateTime(unixTimestamp: number): string {
  try {
    const date = fromUnixTime(unixTimestamp);
    return format(date, "MMM d 'at' h:mm a");
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Unknown date';
  }
}

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function msToUnix(ms: number): number {
  return Math.floor(ms / 1000);
}

export function unixToMs(unix: number): number {
  return unix * 1000;
}

export function isOlderThan(unixTimestamp: number, days: number): boolean {
  const now = Date.now();
  const age = now - unixToMs(unixTimestamp);
  const daysInMs = days * 24 * 60 * 60 * 1000;
  return age > daysInMs;
}

export function parseTimeString(timeString: string): { hours: number; minutes: number } {
  const [hours, minutes] = timeString.split(':').map(Number);
  return { hours, minutes };
}

export function formatTimeString(hours: number, minutes: number): string {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
