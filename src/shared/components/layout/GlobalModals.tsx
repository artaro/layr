'use client';

import React from 'react';
import { useUIStore } from '@/shared/stores';
import { TransactionForm } from '@/features/expenses/components';
import ImportDialog from '@/features/expenses/components/ImportDialog';
import { useAccounts, useCategories, useCreateTransaction } from '@/features/expenses';
import { CreateTransactionInput } from '@/features/expenses/types';

export default function GlobalModals() {
  const { modals, closeTransactionModal, closeImportModal, showSnackbar } = useUIStore();
  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();

  const handleTransactionSubmit = async (data: CreateTransactionInput) => {
    try {
      await createMutation.mutateAsync(data);
      showSnackbar('Transaction saved successfully', 'success');
      closeTransactionModal();
    } catch (error) {
      // Error handling is usually done in the mutation hook or here
      console.error('Failed to create transaction', error);
      showSnackbar('Failed to create transaction', 'error');
    }
  };

  return (
    <>
      <TransactionForm
        open={modals.transaction}
        onClose={closeTransactionModal}
        onSubmit={handleTransactionSubmit}
        accounts={accounts}
        categories={categories}
        loading={createMutation.isPending}
      />

      <ImportDialog
        open={modals.import}
        onClose={closeImportModal}
        accounts={accounts}
        categories={categories}
      />
    </>
  );
}
