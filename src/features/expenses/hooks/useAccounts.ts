'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountRepository } from '@/features/expenses/api';
import { queryKeys } from '@/config/query';
import { CreateAccountInput, UpdateAccountInput } from '@/features/expenses/types';
import { useAuthStore } from '@/shared/stores';

export function useAccounts() {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: queryKeys.accounts.all,
    queryFn: () => accountRepository.getAll(userId!),
    enabled: !!userId,
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: () => accountRepository.getById(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id);

  return useMutation({
    mutationFn: (input: CreateAccountInput) =>
      accountRepository.create(userId!, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAccountInput }) =>
      accountRepository.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => accountRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts.all });
    },
  });
}
