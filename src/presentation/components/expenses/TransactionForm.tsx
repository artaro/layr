'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  InputAdornment,
} from '@mui/material';
import { TransactionType } from '@/domain/enums';
import { CreateTransactionInput, UpdateTransactionInput, Category, Account } from '@/domain/entities';

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionInput | UpdateTransactionInput) => void;
  accounts: Account[];
  categories: Category[];
  initialData?: {
    accountId?: string;
    categoryId?: string;
    type?: TransactionType;
    amount?: number;
    description?: string;
    transactionDate?: string;
  };
  loading?: boolean;
  isEdit?: boolean;
}

export default function TransactionForm({
  open,
  onClose,
  onSubmit,
  accounts,
  categories,
  initialData,
  loading = false,
  isEdit = false,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    accountId: initialData?.accountId || '',
    categoryId: initialData?.categoryId || '',
    type: initialData?.type || TransactionType.EXPENSE,
    amount: initialData?.amount || 0,
    description: initialData?.description || '',
    transactionDate: initialData?.transactionDate || new Date().toISOString().split('T')[0],
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  const isValid =
    formData.accountId &&
    formData.amount > 0 &&
    formData.transactionDate;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
        {isEdit ? 'Edit Transaction ✏️' : 'New Transaction 💸'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
          {/* Type selector */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[TransactionType.EXPENSE, TransactionType.INCOME].map((type) => (
              <Button
                key={type}
                variant={formData.type === type ? 'contained' : 'outlined'}
                onClick={() => handleChange('type', type)}
                sx={{
                  flex: 1,
                  py: 1.2,
                  ...(type === TransactionType.EXPENSE
                    ? {
                        ...(formData.type === type
                          ? { background: 'linear-gradient(135deg, #FF7675, #D63031)' }
                          : {}),
                      }
                    : {
                        ...(formData.type === type
                          ? { background: 'linear-gradient(135deg, #00CEC9, #00A8A4)' }
                          : {}),
                      }),
                }}
              >
                {type === TransactionType.EXPENSE ? '💸 Expense' : '💰 Income'}
              </Button>
            ))}
          </Box>

          {/* Amount */}
          <TextField
            label="Amount"
            type="number"
            value={formData.amount || ''}
            onChange={(e) => handleChange('amount', e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">฿</InputAdornment>,
            }}
            inputProps={{ min: 0, step: 0.01 }}
          />

          {/* Description */}
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            fullWidth
            placeholder="e.g. Lunch at CentralWorld 🍜"
          />

          {/* Date */}
          <TextField
            label="Date"
            type="date"
            value={formData.transactionDate}
            onChange={(e) => handleChange('transactionDate', e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          {/* Account */}
          <FormControl fullWidth>
            <InputLabel>Account</InputLabel>
            <Select
              value={formData.accountId}
              onChange={(e) => handleChange('accountId', e.target.value)}
              label="Account"
            >
              {accounts.map((acc) => (
                <MenuItem key={acc.id} value={acc.id}>
                  {acc.type === 'bank' ? '🏦' : '💳'} {acc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Category */}
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.categoryId}
              onChange={(e) => handleChange('categoryId', e.target.value)}
              label="Category"
            >
              <MenuItem value="">
                <em>No category</em>
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid || loading}
        >
          {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
