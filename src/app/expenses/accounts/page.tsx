'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Landmark, 
  CreditCard 
} from 'lucide-react';
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '@/features/expenses';
import { Account, CreateAccountInput, UpdateAccountInput } from '@/features/expenses/types';
import { AccountType } from '@/features/expenses/types';
import { formatCurrency } from '@/shared/lib/formatters';
import { useUIStore } from '@/shared/stores';
import AccountForm from '@/features/expenses/components/AccountForm';
import { useTranslation } from '@/shared/lib/i18n';

export default function AccountsPage() {
  const { t } = useTranslation();
  const { data: accounts = [], isLoading, error } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const showSnackbar = useUIStore((s) => s.showSnackbar);

  const [formOpen, setFormOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleCreate = async (data: CreateAccountInput | UpdateAccountInput) => {
    try {
      await createAccount.mutateAsync(data as CreateAccountInput);
      setFormOpen(false);
      showSnackbar('Account created! 🏦', 'success');
    } catch {
      showSnackbar(t('common.error'), 'error');
    }
  };

  const handleEdit = async (data: CreateAccountInput | UpdateAccountInput) => {
    if (!editAccount) return;
    try {
      await updateAccount.mutateAsync({ id: editAccount.id, input: data as UpdateAccountInput });
      setEditAccount(null);
      showSnackbar('Account updated! ✅', 'success');
    } catch {
      showSnackbar(t('common.error'), 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAccount.mutateAsync(id);
      setActiveMenuId(null);
    } catch {
      showSnackbar(t('common.error'), 'error');
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => {
    if (acc.type === AccountType.CREDIT_CARD) return sum - Number(acc.balance);
    return sum + Number(acc.balance);
  }, 0);

  const bankAccounts = accounts.filter((a) => a.type === AccountType.BANK);
  const creditCards = accounts.filter((a) => a.type === AccountType.CREDIT_CARD);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId) {
        document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenuId]);

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-1 font-[var(--font-brand)] uppercase tracking-wider">
            {t('accounts.title')}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {t('accounts.subtitle')}
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="brutal-btn flex items-center gap-2 px-4 py-2 text-sm"
        >
          <Plus size={18} /> <span className="hidden sm:inline">{t('accounts.addAccount')}</span>
        </button>
      </div>

      {/* Net Worth Card */}
      <div className="bg-[var(--color-primary)] border-2 border-[var(--color-primary)] p-6 text-[var(--color-text-inverse)] shadow-[6px_6px_0px_0px_var(--color-border)]">
          <p className="text-[var(--color-text-inverse)]/70 font-bold text-sm mb-1 uppercase tracking-wider">{t('accounts.netBalance')}</p>
          <h2 className="text-4xl font-extrabold mb-2">
            {isLoading ? '...' : formatCurrency(totalBalance)}
          </h2>
          <p className="text-[var(--color-text-inverse)]/60 text-sm">
            {t('accounts.across', { count: accounts.length })}
          </p>
      </div>

      {error && (
        <div className="bg-[var(--color-accent)]/10 border-2 border-[var(--color-accent)] text-[var(--color-accent)] p-4">
          {error instanceof Error ? error.message : t('common.failedToLoad')}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[var(--color-surface)] border-2 border-[var(--color-border)] animate-pulse" />
          ))}
        </div>
      )}

      {/* Bank Accounts */}
      {bankAccounts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-wider font-[var(--font-brand)]">{t('accounts.bankAccounts')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bankAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                activeMenuId={activeMenuId}
                onToggleMenu={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === account.id ? null : account.id); }}
                onEdit={() => setEditAccount(account)}
                onDelete={() => handleDelete(account.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Credit Cards */}
      {creditCards.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] uppercase tracking-wider font-[var(--font-brand)]">{t('accounts.creditCards')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {creditCards.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                activeMenuId={activeMenuId}
                onToggleMenu={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === account.id ? null : account.id); }}
                onEdit={() => setEditAccount(account)}
                onDelete={() => handleDelete(account.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && accounts.length === 0 && (
        <div className="text-center py-16 flex flex-col items-center">
          <div className="text-6xl mb-4">🏦</div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 uppercase tracking-wider font-[var(--font-brand)]">{t('empty.noAccounts')}</h3>
          <p className="text-[var(--color-text-secondary)] mb-6 font-medium">{t('empty.noAccountsDesc')}</p>
          <button
            onClick={() => setFormOpen(true)}
            className="brutal-btn flex items-center gap-2 px-6 py-3 text-sm"
          >
            <Plus size={20} /> {t('empty.addFirstAccount')}
          </button>
        </div>
      )}

      {/* Create Form */}
      <AccountForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        loading={createAccount.isPending}
      />

      {/* Edit Form */}
      <AccountForm
        open={!!editAccount}
        onClose={() => setEditAccount(null)}
        onSubmit={handleEdit}
        initialData={editAccount}
        loading={updateAccount.isPending}
      />
    </div>
  );
}

/* ---- Account Card Component ---- */
interface AccountCardProps {
  account: Account;
  activeMenuId: string | null;
  onToggleMenu: (e: React.MouseEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function AccountCard({ account, activeMenuId, onToggleMenu, onEdit, onDelete }: AccountCardProps) {
  const { t } = useTranslation();
  const isBank = account.type === AccountType.BANK;
  const showMenu = activeMenuId === account.id;

  return (
    <div className="group relative bg-[var(--color-surface)] border-2 border-[var(--color-border)] p-5 shadow-[3px_3px_0px_0px_var(--color-primary)] brutal-hover transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <div 
            className={`w-12 h-12 flex items-center justify-center text-white border-2 border-[var(--color-border)] ${
                isBank 
                ? 'bg-[var(--color-income)]' 
                : 'bg-[var(--color-expense)]'
            }`}
          >
            {isBank ? <Landmark size={22} /> : <CreditCard size={22} />}
          </div>
          <div>
            <h4 className="font-bold text-[var(--color-text-primary)]">{account.name}</h4>
            {account.bankName && <p className="text-xs text-[var(--color-text-secondary)] font-medium">{account.bankName}</p>}
          </div>
        </div>
        
        <div className="relative">
            <button 
                onClick={onToggleMenu}
                className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
                <MoreVertical size={20} />
            </button>
            
            {showMenu && (
                <div className="absolute right-0 top-8 z-20 w-32 bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[3px_3px_0px_0px_var(--color-primary)] p-1 flex flex-col animate-fade-in">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary)] text-left"
                    >
                        <Edit2 size={14} /> {t('common.edit')}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 text-left"
                    >
                        <Trash2 size={14} /> {t('common.delete')}
                    </button>
                </div>
            )}
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
           <p className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider mb-0.5">
               {isBank ? t('accounts.balance') : t('accounts.outstanding')}
           </p>
           <p className={`text-xl font-extrabold ${isBank ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-accent)]'}`}>
               {formatCurrency(Number(account.balance))}
           </p>
        </div>
        
        <div className="flex items-center gap-2">
           <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide border-2 ${
               isBank 
               ? 'text-[var(--color-income)] border-[var(--color-income)] bg-[var(--color-income)]/10' 
               : 'text-[var(--color-accent)] border-[var(--color-accent)] bg-[var(--color-accent)]/10'
           }`}>
               {isBank ? t('accounts.bank') : t('accounts.credit')}
           </span>
           {account.accountNumberLast4 && (
               <span className="text-xs text-[var(--color-text-muted)] font-medium">•••• {account.accountNumberLast4}</span>
           )}
        </div>
      </div>
    </div>
  );
}
