/**
 * Format a number as currency.
 * Defaults to THB (Thai Baht).
 */
export function formatCurrency(
  amount: number,
  currency: string = 'THB',
  locale: string = 'th-TH'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with comma separators.
 */
export function formatNumber(
  value: number,
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

import { parseISO, format as fnsFormat } from 'date-fns';

/**
 * Parse a date string into a local Date, handling timezone correctly.
 * - Strings with timezone info (e.g. "2026-02-25T17:00:00+00:00") are converted to local time.
 * - Date-only strings (e.g. "2026-02-26") are treated as local dates (midnight local).
 */
function toLocalDate(dateStr: string): Date {
  // Date-only string (no "T"): treat as local midnight, NOT UTC
  if (!dateStr.includes('T')) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  // Full datetime: parseISO handles timezone offsets correctly
  return parseISO(dateStr);
}

/**
 * Extract the local YYYY-MM-DD string from a date/datetime string.
 * Unlike `.split("T")[0]`, this correctly handles timezone conversion.
 */
export function toLocalDateString(dateStr: string): string {
  const d = toLocalDate(dateStr);
  return fnsFormat(d, 'yyyy-MM-dd');
}

/**
 * Format a date string to a user-friendly format.
 */
export function formatDate(
  dateStr: string | Date,
  locale: string = 'en-GB',
  options?: Intl.DateTimeFormatOptions
): string {
  const date = typeof dateStr === 'string' ? toLocalDate(dateStr) : dateStr;
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  });
}

/**
 * Format a date as relative time (e.g., "2 hours ago").
 */
export function formatRelativeTime(dateStr: string): string {
  const date = typeof dateStr === 'string' ? toLocalDate(dateStr) : dateStr;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(dateStr);
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text: string, maxLength: number = 30): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}

/**
 * Generate a random color from a predefined palette.
 */
export function getRandomColor(): string {
  const colors = [
    '#6C5CE7', '#FD79A8', '#00CEC9', '#FDCB6E',
    '#FF7675', '#74B9FF', '#55EFC4', '#A29BFE',
    '#E17055', '#00B894', '#0984E3', '#E84393',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
