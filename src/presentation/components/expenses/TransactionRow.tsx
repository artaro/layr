'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Transaction } from '@/domain/entities';
import { TransactionType } from '@/domain/enums';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { EXPENSE_COLORS } from '@/lib/constants';
import CategoryChip from './CategoryChip';

interface TransactionRowProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
}

export default function TransactionRow({
  transaction,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const isExpense = transaction.type === TransactionType.EXPENSE;
  const amountColor = isExpense ? EXPENSE_COLORS.expense : EXPENSE_COLORS.income;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderRadius: 4,
        backgroundColor: 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(108, 92, 231, 0.03)',
          transform: 'translateX(4px)',
        },
      }}
    >
      {/* Category icon */}
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 3,
          backgroundColor: transaction.category
            ? `${transaction.category.color}15`
            : 'rgba(108, 92, 231, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          flexShrink: 0,
        }}
      >
        {transaction.category?.icon || '📦'}
      </Box>

      {/* Description & category */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: 'text.primary' }}
          noWrap
        >
          {transaction.description || 'No description'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          {transaction.category && (
            <CategoryChip
              name={transaction.category.name}
              icon={transaction.category.icon}
              color={transaction.category.color}
              size="small"
            />
          )}
          <Typography variant="caption" color="text.secondary">
            {formatDate(transaction.transactionDate)}
          </Typography>
        </Box>
      </Box>

      {/* Amount */}
      <Typography
        variant="body1"
        sx={{
          fontWeight: 700,
          color: amountColor,
          whiteSpace: 'nowrap',
        }}
      >
        {isExpense ? '-' : '+'}
        {formatCurrency(transaction.amount)}
      </Typography>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        {onEdit && (
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onEdit(transaction)}
              sx={{
                opacity: 0.5,
                '&:hover': { opacity: 1, color: 'primary.main' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onDelete(transaction)}
              sx={{
                opacity: 0.5,
                '&:hover': { opacity: 1, color: 'error.main' },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
