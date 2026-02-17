'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Skeleton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
} from '@/presentation/hooks';
import { Account, CreateAccountInput, UpdateAccountInput } from '@/domain/entities';
import { AccountType } from '@/domain/enums/accountType';
import { formatCurrency } from '@/lib/formatters';
import { useUIStore } from '@/presentation/stores';
import AccountForm from '@/presentation/components/expenses/AccountForm';

export default function AccountsPage() {
  const { data: accounts = [], isLoading, error } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  const showSnackbar = useUIStore((s) => s.showSnackbar);

  const [formOpen, setFormOpen] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuAccount, setMenuAccount] = useState<Account | null>(null);

  const handleCreate = async (data: CreateAccountInput | UpdateAccountInput) => {
    try {
      await createAccount.mutateAsync(data as CreateAccountInput);
      setFormOpen(false);
      showSnackbar('Account created! 🏦', 'success');
    } catch {
      showSnackbar('Failed to create account', 'error');
    }
  };

  const handleEdit = async (data: CreateAccountInput | UpdateAccountInput) => {
    if (!editAccount) return;
    try {
      await updateAccount.mutateAsync({ id: editAccount.id, input: data as UpdateAccountInput });
      setEditAccount(null);
      showSnackbar('Account updated! ✅', 'success');
    } catch {
      showSnackbar('Failed to update account', 'error');
    }
  };

  const handleDelete = async () => {
    if (!menuAccount) return;
    try {
      await deleteAccount.mutateAsync(menuAccount.id);
      setMenuAnchor(null);
      setMenuAccount(null);
      showSnackbar('Account deleted', 'success');
    } catch {
      showSnackbar('Failed to delete account', 'error');
    }
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, account: Account) => {
    setMenuAnchor(e.currentTarget);
    setMenuAccount(account);
  };

  const totalBalance = accounts.reduce((sum, acc) => {
    if (acc.type === AccountType.CREDIT_CARD) return sum - Number(acc.balance);
    return sum + Number(acc.balance);
  }, 0);

  const bankAccounts = accounts.filter((a) => a.type === AccountType.BANK);
  const creditCards = accounts.filter((a) => a.type === AccountType.CREDIT_CARD);

  return (
    <Box sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Accounts 🏦
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your bank accounts and credit cards
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setFormOpen(true)}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
        >
          Add Account
        </Button>
      </Box>

      {/* Net Worth Card */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
          color: 'white',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5 }}>
            Net Balance
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 800 }}>
            {isLoading ? '...' : formatCurrency(totalBalance)}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
            Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}
          </Typography>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          {error instanceof Error ? error.message : 'Failed to load accounts'}
        </Alert>
      )}

      {/* Loading */}
      {isLoading && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 4 }} />
          ))}
        </Box>
      )}

      {/* Bank Accounts */}
      {bankAccounts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            🏦 Bank Accounts
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {bankAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onMenuOpen={handleMenuOpen}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Credit Cards */}
      {creditCards.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            💳 Credit Cards
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            {creditCards.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onMenuOpen={handleMenuOpen}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Empty State */}
      {!isLoading && accounts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>🏦</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            No accounts yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add your bank accounts and credit cards to start tracking
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setFormOpen(true)}
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
          >
            Add Your First Account
          </Button>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 160 } } }}
      >
        <MenuItem
          onClick={() => {
            setEditAccount(menuAccount);
            setMenuAnchor(null);
          }}
        >
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>

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
    </Box>
  );
}

/* ---- Account Card Component ---- */
interface AccountCardProps {
  account: Account;
  onMenuOpen: (e: React.MouseEvent<HTMLElement>, account: Account) => void;
}

function AccountCard({ account, onMenuOpen }: AccountCardProps) {
  const isBank = account.type === AccountType.BANK;

  return (
    <Card
      sx={{
        borderRadius: 4,
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0px 4px 20px rgba(108, 92, 231, 0.1)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isBank
                  ? 'linear-gradient(135deg, #00CEC9, #55EFC4)'
                  : 'linear-gradient(135deg, #FD79A8, #FDCB6E)',
              }}
            >
              {isBank ? (
                <AccountBalanceIcon sx={{ color: 'white', fontSize: 22 }} />
              ) : (
                <CreditCardIcon sx={{ color: 'white', fontSize: 22 }} />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {account.name}
              </Typography>
              {account.bankName && (
                <Typography variant="caption" color="text.secondary">
                  {account.bankName}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton size="small" onClick={(e) => onMenuOpen(e, account)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {isBank ? 'Balance' : 'Outstanding'}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: isBank ? 'text.primary' : 'error.main',
              }}
            >
              {formatCurrency(Number(account.balance))}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Chip
              label={isBank ? 'Bank' : 'Credit'}
              size="small"
              sx={{
                fontSize: '0.7rem',
                height: 22,
                backgroundColor: isBank
                  ? 'rgba(0, 206, 201, 0.1)'
                  : 'rgba(253, 121, 168, 0.1)',
                color: isBank ? '#00A8A4' : '#D63031',
              }}
            />
            {account.accountNumberLast4 && (
              <Typography variant="caption" color="text.secondary">
                •••• {account.accountNumberLast4}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
