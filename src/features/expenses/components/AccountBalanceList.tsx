'use client';

import React from 'react';
import { Account } from '@/features/expenses/types';
import { formatCurrency } from '@/shared/lib/formatters';
import { Wallet, CreditCard, Landmark } from 'lucide-react';
import { AccountType } from '@/features/expenses/types';

interface AccountBalanceListProps {
  accounts: Account[];
}

export default function AccountBalanceList({ accounts }: AccountBalanceListProps) {
  const getIcon = (type: AccountType) => {
    switch (type) {
      case AccountType.BANK:
        return <Landmark size={18} />;
      case AccountType.CREDIT_CARD:
        return <CreditCard size={18} />;
      default:
        return <Wallet size={18} />;
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => b.balance - a.balance);
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.type === AccountType.CREDIT_CARD ? -acc.balance : acc.balance), 0);

  return (
    <div className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] shadow-[4px_4px_0px_0px_var(--color-primary)] p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] font-[var(--font-brand)] uppercase tracking-wider">
          Accounts 💳
        </h3>
        <span className="text-xs font-bold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-1 border border-[var(--color-primary)] uppercase tracking-wider">
           Total: {formatCurrency(totalBalance)}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[300px] scrollbar-hide">
        {sortedAccounts.length > 0 ? (
          sortedAccounts.map((account) => (
            <div 
              key={account.id} 
              className="group flex items-center justify-between p-3 border-2 border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 flex items-center justify-center text-white border-2 border-[var(--color-border)] ${
                    account.type === AccountType.CREDIT_CARD 
                    ? 'bg-[var(--color-expense)]' 
                    : 'bg-[var(--color-income)]'
                }`}>
                  {getIcon(account.type)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)] leading-tight">{account.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)] font-medium">{account.bankName || 'General'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${account.type === AccountType.CREDIT_CARD ? 'text-[var(--color-expense)]' : 'text-[var(--color-text-primary)]'}`}>
                  {formatCurrency(account.balance)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-[var(--color-text-muted)]">
             <Wallet className="w-8 h-8 mb-2 opacity-50" />
             <p className="text-xs">No accounts added</p>
          </div>
        )}
      </div>
    </div>
  );
}
