'use client';

import React from 'react';
import { Box, Typography, Grid, LinearProgress, Alert, Button } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { StatCard } from '@/presentation/components/common';
import {
  TransactionRow,
  ExpensePieChart,
  OverviewChart,
  CalendarPanel,
  TransactionForm,
} from '@/presentation/components/expenses';
import { EmptyState } from '@/presentation/components/common';
import { formatCurrency } from '@/lib/formatters';
import { StatementSource } from '@/domain/enums';
import {
  useTransactions,
  useTransactionSummary,
  useAccounts,
  useCategories,
  useCreateTransaction,
} from '@/presentation/hooks';

export default function ExpenseDashboardPage() {
  // Fetch summary for all time
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useTransactionSummary();

  // Fetch recent transactions (grabbing more to populate charts)
  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useTransactions({ pageSize: 500 }); // Increased for better chart data

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();

  const [formOpen, setFormOpen] = React.useState(false);

  const transactions = transactionsData?.data || [];
  const isLoading = isSummaryLoading || isTransactionsLoading;
  const isError = isSummaryError || isTransactionsError;

  const handleCreate = async (data: any, resetForm: () => void) => {
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
      resetForm();
      setFormOpen(false);
    } catch (error) {
      console.error('Failed to create transaction', error);
    }
  };

  return (
    <Box className="animate-fade-in">
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Dashboard 📊
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Here&apos;s what&apos;s happening with your money
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ py: 1.2, borderRadius: 2 }}
        >
          Add Transaction
        </Button>
      </Box>

      {/* Loading & Error States */}
      {isLoading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}
      {isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          Failed to load dashboard data
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          {/* Stat cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Total Income"
                value={formatCurrency(summary?.totalIncome || 0)}
                icon={<TrendingUpIcon sx={{ color: '#fff' }} />}
                gradient="linear-gradient(135deg, #00CEC9 0%, #00B894 100%)"
                trend={{ value: 'All time', positive: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Total Expenses"
                value={formatCurrency(summary?.totalExpense || 0)}
                icon={<TrendingDownIcon sx={{ color: '#fff' }} />}
                gradient="linear-gradient(135deg, #FF7675 0%, #D63031 100%)"
                trend={{ value: 'All time', positive: false }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <StatCard
                title="Balance"
                value={formatCurrency(summary?.balance || 0)}
                icon={<AccountBalanceWalletIcon sx={{ color: '#fff' }} />}
                gradient="linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)"
                trend={{
                  value: 'Net Worth',
                  positive: (summary?.balance || 0) >= 0,
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Calendar Panel - Full width on small, 7/12 on large */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <CalendarPanel transactions={transactions} />
            </Grid>

            {/* Pie Chart - 5/12 on large */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <ExpensePieChart transactions={transactions} />
            </Grid>

            {/* Overview Chart - Full width */}
            <Grid size={{ xs: 12 }}>
              <OverviewChart transactions={transactions} />
            </Grid>
          </Grid>

          {/* Recent transactions */}
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Transactions 💸
              </Typography>
              <Link href="/expenses/transactions" passHref>
                <Button variant="text" size="small">
                  View All
                </Button>
              </Link>
            </Box>

            {transactions.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {transactions.slice(0, 5).map((tx) => (
                  <TransactionRow
                    key={tx.id}
                    transaction={tx}
                    onEdit={() => {}} // Read-only view in dashboard
                    onDelete={() => {}} // Read-only view in dashboard
                  />
                ))}
              </Box>
            ) : (
              <EmptyState
                emoji="🤷‍♂️"
                title="No transactions yet"
                description="Start by adding your first transaction or uploading a bank statement!"
                actionLabel="Add Transaction"
                onAction={() => setFormOpen(true)}
              />
            )}
          </Box>
        </>
      )}

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => handleCreate(data, () => {})}
        accounts={accounts}
        categories={categories}
        loading={createMutation.isPending}
      />
    </Box>
  );
}
