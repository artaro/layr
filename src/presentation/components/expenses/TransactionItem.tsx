'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '@/domain/entities';
import { AccountType } from '@/domain/enums';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useCategories, useAccounts } from '@/presentation/hooks';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
  showActions = true,
}: TransactionItemProps) {
  const { data: categories = [] } = useCategories();
  const { data: accounts = [] } = useAccounts();

  const category = categories.find((c) => c.id === transaction.categoryId);
  const account = accounts.find((a) => a.id === transaction.accountId);

  const accountIcon = account?.type === AccountType.CREDIT_CARD ? '💳' : '🏦';

  return (
    <div
      className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Category Icon */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm flex-shrink-0"
          style={{ backgroundColor: category ? `${category.color}15` : '#F3F4F6' }}
        >
          {category?.icon || '📦'}
        </div>

        {/* Main Info */}
        <div className="min-w-0 flex-1">
          {/* Description - truncated */}
          <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1 truncate">
            {transaction.description || 'No description'}
          </h3>

          {/* Chips Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Category Chip */}
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border"
              style={{
                backgroundColor: category ? `${category.color}10` : '#F3F4F6',
                color: category?.color || '#6B7280',
                borderColor: category ? `${category.color}30` : '#E5E7EB',
              }}
            >
              {category?.icon && <span className="text-xs">{category.icon}</span>}
              {category?.name || 'Uncategorized'}
            </span>

            {/* Account Chip */}
            {account && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                <span className="text-xs">{accountIcon}</span>
                {account.name}
              </span>
            )}

            {/* Date */}
            <span className="text-[11px] text-gray-400 font-medium">
              {formatDate(transaction.transactionDate)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0 ml-3">
        {/* Amount */}
        <span
          className={`font-bold text-sm md:text-base whitespace-nowrap ${
            transaction.type === 'expense' ? 'text-red-500' : 'text-teal-500'
          }`}
        >
          {transaction.type === 'expense' ? '-' : '+'}
          {formatCurrency(transaction.amount)}
        </span>

        {/* Actions */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit2 size={16} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
