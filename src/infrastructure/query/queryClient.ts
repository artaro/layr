import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Query key factory for type-safe, consistent keys
export const queryKeys = {
  transactions: {
    all: ['transactions'] as const,
    list: (filters: Record<string, unknown>) =>
      ['transactions', 'list', filters] as const,
    detail: (id: string) => ['transactions', 'detail', id] as const,
    summary: (filters: Record<string, unknown>) =>
      ['transactions', 'summary', filters] as const,
  },
  accounts: {
    all: ['accounts'] as const,
    detail: (id: string) => ['accounts', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },
  budgetGoals: {
    all: ['budgetGoals'] as const,
    detail: (id: string) => ['budgetGoals', 'detail', id] as const,
  },
  profile: {
    current: ['profile', 'current'] as const,
  },
} as const;
