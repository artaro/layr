export const APP_NAME = 'Layr';

export const DEFAULT_CURRENCY = 'THB';
export const DEFAULT_LOCALE = 'th-TH';
export const DEFAULT_PAGE_SIZE = 20;

export const SIDEBAR_WIDTH = 260;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

export const DEFAULT_CATEGORIES = [
  { name: 'Food & Drinks', icon: '🍔', color: '#FF7675' },
  { name: 'Transport', icon: '🚗', color: '#74B9FF' },
  { name: 'Shopping', icon: '🛍️', color: '#FD79A8' },
  { name: 'Entertainment', icon: '🎮', color: '#6C5CE7' },
  { name: 'Bills & Utilities', icon: '💡', color: '#FDCB6E' },
  { name: 'Health', icon: '💊', color: '#55EFC4' },
  { name: 'Education', icon: '📚', color: '#0984E3' },
  { name: 'Salary', icon: '💰', color: '#00B894' },
  { name: 'Transfer', icon: '🔄', color: '#A29BFE' },
  { name: 'Other', icon: '📦', color: '#636E72' },
] as const;

export const EXPENSE_COLORS = {
  income: '#00CEC9',
  expense: '#FF7675',
  balance: '#6C5CE7',
} as const;
