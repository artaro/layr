'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryRepository } from '@/features/expenses/api';
import { queryKeys } from '@/config/query';
import { CreateCategoryInput, UpdateCategoryInput } from '@/features/expenses/types';
import { useAuthStore } from '@/shared/stores';

export function useCategories() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryRepository.getAll(userId!),
    enabled: !!userId,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoryRepository.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: (input: CreateCategoryInput) =>
      categoryRepository.create(userId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryInput }) =>
      categoryRepository.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useTogglePinCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      categoryRepository.togglePin(id, isPinned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useIncrementCategoryUseCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryRepository.incrementUseCount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}
