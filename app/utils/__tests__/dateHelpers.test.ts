import { formatRelativeTime, msToUnix, getCurrentTimestamp } from '../dateHelpers';

describe('dateHelpers', () => {
  describe('formatRelativeTime', () => {
    const now = getCurrentTimestamp(); // Unix timestamp in seconds
    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    it('should format recent timestamps', () => {
      const timestamp = now - 30; // 30 seconds ago
      const result = formatRelativeTime(timestamp);
      expect(result).toContain('minute');
      expect(result).toContain('ago');
    });

    it('should format minutes ago', () => {
      const timestamp = now - 5 * minute;
      const result = formatRelativeTime(timestamp);
      expect(result).toContain('minute');
      expect(result).toContain('ago');
    });

    it('should format hours ago', () => {
      const timestamp = now - 3 * hour;
      const result = formatRelativeTime(timestamp);
      expect(result).toContain('hour');
      expect(result).toContain('ago');
    });

    it('should format days ago', () => {
      const timestamp = now - 5 * day;
      const result = formatRelativeTime(timestamp);
      expect(result).toContain('day');
      expect(result).toContain('ago');
    });

    it('should format weeks ago', () => {
      const timestamp = now - 2 * week;
      const result = formatRelativeTime(timestamp);
      expect(result).toContain('day');
      expect(result).toContain('ago');
    });

    it('should format months ago', () => {
      const timestamp = now - 3 * month;
      const result = formatRelativeTime(timestamp);
      expect(result).toContain('month');
      expect(result).toContain('ago');
    });

    it('should format years ago', () => {
      const timestamp = now - 2 * year;
      const result = formatRelativeTime(timestamp);
      expect(result).toContain('year');
      expect(result).toContain('ago');
    });

    it('should handle invalid timestamps', () => {
      expect(formatRelativeTime(0)).toBeTruthy();
      expect(formatRelativeTime(-1)).toBeTruthy();
    });

    it('should handle future timestamps', () => {
      const futureTimestamp = now + 60; // 1 minute in future
      const result = formatRelativeTime(futureTimestamp);
      expect(result).toContain('in');
    });
  });
});
