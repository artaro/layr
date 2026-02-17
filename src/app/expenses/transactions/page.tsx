'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Card,
  LinearProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {
  TransactionRow,
  TransactionForm,
} from '@/presentation/components/expenses';
import { ConfirmDialog, EmptyState } from '@/presentation/components/common';
import { TransactionType, StatementSource } from '@/domain/enums';
import { Transaction } from '@/domain/entities';
import {
  useTransactions,
  useAccounts,
  useCategories,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/presentation/hooks';

export default function TransactionsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | ''>('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  // Data fetching
  const {
    data: transactionData,
    isLoading,
    isError,
  } = useTransactions({
    search: searchQuery,
    type: filterType || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();

  // Mutations
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const handleCreate = async (data: any) => {
    try {
      await createMutation.mutateAsync({
        accountId: data.accountId,
        categoryId: data.categoryId,
        type: data.type,
        amount: data.amount,
        description: data.description,
        transactionDate: data.transactionDate,
        source: StatementSource.MANUAL,
      });
      setFormOpen(false);
    } catch (error) {
      console.error('Failed to create transaction', error);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editTarget) return;
    try {
      await updateMutation.mutateAsync({
        id: editTarget.id,
        input: {
          accountId: data.accountId,
          categoryId: data.categoryId,
          type: data.type,
          amount: data.amount,
          description: data.description,
          transactionDate: data.transactionDate,
        },
      });
      setFormOpen(false);
      setEditTarget(null);
    } catch (error) {
      console.error('Failed to update transaction', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Failed to delete transaction', error);
    }
  };

  const openEdit = (tx: Transaction) => {
    setEditTarget(tx);
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setEditTarget(null);
  };

  const transactions = transactionData?.data || [];
  const totalPages = Math.ceil((transactionData?.count || 0) / PAGE_SIZE);

  return (
    <Box className="animate-fade-in">
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Transactions 💸
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All your income and expenses in one place
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ py: 1.2 }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Filters */}
      <Card
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          borderRadius: 4, // consistent 16px
        }}
      >
        <TextField
          size="small"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // Reset to first page on search
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            minWidth: 200,
            '& .MuiOutlinedInput-root': { borderRadius: 3 },
          }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as TransactionType | '');
              setPage(1);
            }}
            label="Type"
            sx={{ borderRadius: 3 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={TransactionType.INCOME}>💰 Income</MenuItem>
            <MenuItem value={TransactionType.EXPENSE}>💸 Expense</MenuItem>
          </Select>
        </FormControl>
      </Card>

      {/* Loading & Error States */}
      {isLoading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}
      {isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          Failed to load transactions
        </Alert>
      )}

      {/* Transaction list */}
      {!isLoading && !isError && (
        <>
          {transactions.length > 0 ? (
            <>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}
              >
                {transactions.map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    transaction={tx}
                    onEdit={() => openEdit(tx)}
                    onDelete={() => setDeleteTarget(tx)}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  shape="rounded"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2, // 8px
                    },
                    '& .Mui-selected': {
                      background:
                        'linear-gradient(135deg, #6C5CE7, #A29BFE) !important',
                      color: '#fff',
                    },
                  }}
                />
              </Box>
            </>
          ) : (
            <EmptyState
              emoji="🔍"
              title="No transactions found"
              description="Try adjusting your filters or add a new transaction"
              actionLabel="Add Transaction"
              onAction={() => setFormOpen(true)}
            />
          )}
        </>
      )}

      {/* Transaction form */}
      <TransactionForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={editTarget ? handleUpdate : handleCreate}
        accounts={accounts}
        categories={categories}
        initialData={
          editTarget
            ? {
                accountId: editTarget.accountId,
                categoryId: editTarget.categoryId || '',
                type: editTarget.type,
                amount: editTarget.amount,
                description: editTarget.description || '',
                transactionDate: editTarget.transactionDate.split('T')[0],
              }
            : undefined
        }
        loading={createMutation.isPending || updateMutation.isPending}
        isEdit={!!editTarget}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Transaction? 🗑️"
        message={`Are you sure you want to delete "${
          deleteTarget?.description || 'this transaction'
        }"? This can't be undone.`}
        confirmLabel={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
