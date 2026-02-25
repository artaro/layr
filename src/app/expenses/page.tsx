'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';
import { 
  StatCard, 
  EmptyState
} from '@/shared/components';
import {
  TransactionItem,
  ExpensePieChart,
  OverviewChart,
  CalendarPanel,
  TransactionForm,
  AccountBalanceList,
} from '@/features/expenses/components';
import { formatCurrency } from '@/shared/lib/formatters';
import { StatementSource } from '@/features/expenses/types';
import { useTranslation } from '@/shared/lib/i18n';
import {
  useTransactions,
  useTransactionSummary,
  useAccounts,
  useCategories,
  useCreateTransaction,
} from '@/features/expenses';

export default function ExpenseDashboardPage() {
  const { t } = useTranslation();

  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useTransactionSummary();

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    isError: isTransactionsError,
  } = useTransactions({ pageSize: 500 });

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();

  const [formOpen, setFormOpen] = useState(false);

  const transactions = transactionsData?.data || [];
  const isLoading = isSummaryLoading || isTransactionsLoading;
  const isError = isSummaryError || isTransactionsError;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1 font-[var(--font-brand)] uppercase tracking-wider">
          {t('dashboard.title')}
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="w-full h-1 bg-[var(--color-surface-2)] overflow-hidden">
          <div className="h-full bg-[var(--color-primary)] animate-progress origin-left" />
        </div>
      )}
      
      {isError && (
        <div className="bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] text-[var(--color-accent)] p-4 flex items-center gap-3">
          <AlertCircle size={20} />
          <span className="font-medium">{t('dashboard.failedToLoad')}</span>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <StatCard
              title={t('dashboard.totalIncome')}
              value={formatCurrency(summary?.totalIncome || 0)}
              icon={<TrendingUp className="text-white w-6 h-6" />}
              gradient="linear-gradient(135deg, #00FFAB 0%, #00CC88 100%)"
              trend={{ value: t('common.allTime'), positive: true }}
            />
            <StatCard
              title={t('dashboard.totalExpenses')}
              value={formatCurrency(summary?.totalExpense || 0)}
              icon={<TrendingDown className="text-white w-6 h-6" />}
              gradient="linear-gradient(135deg, #FF6B6B 0%, #D63031 100%)"
              trend={{ value: t('common.allTime'), positive: false }}
            />
            <StatCard
              title={t('dashboard.balance')}
              value={formatCurrency(summary?.balance || 0)}
              icon={<Wallet className="text-white w-6 h-6" />}
              gradient="linear-gradient(135deg, #FFF01F 0%, #FFD93D 100%)"
              trend={{
                value: t('common.netWorth'),
                positive: (summary?.balance || 0) >= 0,
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <CalendarPanel transactions={transactions} />
            </div>
            <div className="lg:col-span-4 h-full">
              <AccountBalanceList accounts={accounts} />
            </div>
            <div className="lg:col-span-5">
              <ExpensePieChart transactions={transactions} />
            </div>
            <div className="lg:col-span-7">
              <OverviewChart transactions={transactions} />
            </div>
          </div>

          {/* Recent transactions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--color-text-primary)] font-[var(--font-brand)] uppercase tracking-wider">
                {t('dashboard.recentTransactions')}
              </h2>
              <Link 
                href="/expenses/transactions" 
                className="text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 px-3 py-1.5 transition-colors border-2 border-[var(--color-primary)] uppercase tracking-wider"
              >
                {t('common.viewAll')}
              </Link>
            </div>

            {transactions.length > 0 ? (
              <div className="flex flex-col gap-2">
                {transactions.slice(0, 5).map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    showActions={false}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                emoji="🤷‍♂️"
                title={t('empty.noTransactions')}
                description={t('empty.noTransactionsDesc')}
                actionLabel={t('empty.addTransaction')}
                onAction={() => setFormOpen(true)}
              />
            )}
          </div>
        </>
      )}

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        accounts={accounts}
        categories={categories}
        loading={createMutation.isPending}
      />
    </div>
  );
}
