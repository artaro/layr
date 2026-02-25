import { formatCurrency, formatNumber, formatDate, formatRelativeTime, truncate, getRandomColor } from '@/shared/lib/formatters';

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format as THB by default', () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain('1,234.56');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0.00');
    });

    it('should handle large numbers', () => {
      const result = formatCurrency(1000000);
      expect(result).toContain('1,000,000.00');
    });
  });

  describe('formatNumber', () => {
    it('should format with comma separators', () => {
      expect(formatNumber(1234567.89)).toBe('1,234,567.89');
    });

    it('should respect decimal parameter', () => {
      expect(formatNumber(1234.5, 0)).toBe('1,235');
    });
  });

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2026-02-17');
      // Result depends on locale but should contain year
      expect(result).toContain('2026');
    });
  });

  describe('formatRelativeTime', () => {
    it('should return "just now" for recent times', () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe('just now');
    });
  });

  describe('truncate', () => {
    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should truncate long strings with ellipsis', () => {
      const result = truncate('This is a very long string', 10);
      expect(result).toBe('This is a …');
      expect(result.length).toBe(11);
    });
  });

  describe('getRandomColor', () => {
    it('should return a valid hex color', () => {
      const color = getRandomColor();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});
