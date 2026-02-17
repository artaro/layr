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
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CreateAccountInput, UpdateAccountInput, Account } from '@/domain/entities';
import { AccountType } from '@/domain/enums/accountType';

interface AccountFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAccountInput | UpdateAccountInput) => void;
  initialData?: Account | null;
  loading?: boolean;
}

export default function AccountForm({
  open,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}: AccountFormProps) {
  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState<AccountType>(initialData?.type || AccountType.BANK);
  const [balance, setBalance] = useState(String(initialData?.balance ?? 0));
  const [bankName, setBankName] = useState(initialData?.bankName || '');
  const [last4, setLast4] = useState(initialData?.accountNumberLast4 || '');

  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (open) {
      setName(initialData?.name || '');
      setType(initialData?.type || AccountType.BANK);
      setBalance(String(initialData?.balance ?? 0));
      setBankName(initialData?.bankName || '');
      setLast4(initialData?.accountNumberLast4 || '');
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      type,
      balance: parseFloat(balance) || 0,
      bankName: bankName || undefined,
      accountNumberLast4: last4 || undefined,
    };
    onSubmit(data);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          {isEdit ? 'Edit Account ✏️' : 'Add Account 🏦'}
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            label="Account Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            placeholder="e.g. KBank Savings"
          />

          <FormControl fullWidth>
            <InputLabel>Account Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value as AccountType)}
              label="Account Type"
            >
              <MenuItem value={AccountType.BANK}>🏦 Bank Account</MenuItem>
              <MenuItem value={AccountType.CREDIT_CARD}>💳 Credit Card</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Current Balance"
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            fullWidth
            inputProps={{ step: '0.01' }}
          />

          <TextField
            label="Bank Name (optional)"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            placeholder="e.g. Kasikorn Bank"
          />

          <TextField
            label="Last 4 digits (optional)"
            value={last4}
            onChange={(e) => setLast4(e.target.value.replace(/\D/g, '').slice(0, 4))}
            fullWidth
            placeholder="1234"
            inputProps={{ maxLength: 4 }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !name.trim()}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
