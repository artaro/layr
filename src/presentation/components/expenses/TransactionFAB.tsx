'use client';

import React, { useState } from 'react';
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import { TransactionForm } from '@/presentation/components/expenses';
import ImportDialog from './ImportDialog';
import { useAccounts, useCategories, useCreateTransaction } from '@/presentation/hooks';
import { CreateTransactionInput, UpdateTransactionInput } from '@/domain/entities';
import { useUIStore } from '@/presentation/stores';

export default function TransactionFAB() {
  const [formOpen, setFormOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const createTx = useCreateTransaction();
  const showSnackbar = useUIStore((s) => s.showSnackbar);

  const handleManualSubmit = async (data: CreateTransactionInput | UpdateTransactionInput) => {
    try {
      await createTx.mutateAsync(data as CreateTransactionInput);
      setFormOpen(false);
      showSnackbar('Transaction added! 🎉', 'success');
    } catch {
      showSnackbar('Failed to add transaction', 'error');
    }
  };

  const actions = [
    {
      icon: <EditIcon />,
      name: 'Add Manually',
      onClick: () => setFormOpen(true),
    },
    {
      icon: <UploadFileIcon />,
      name: 'Import Statement',
      onClick: () => setImportOpen(true),
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="Transaction actions"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          '& .MuiFab-primary': {
            background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
            boxShadow: '0px 4px 20px rgba(108, 92, 231, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5A4BD1, #8F86F0)',
            },
          },
        }}
        icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
            sx={{
              '& .MuiSpeedDialAction-staticTooltipLabel': {
                whiteSpace: 'nowrap',
                fontFamily: 'Outfit',
                fontWeight: 500,
              },
            }}
          />
        ))}
      </SpeedDial>

      {/* Manual Transaction Form */}
      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleManualSubmit}
        accounts={accounts}
        categories={categories}
        loading={createTx.isPending}
      />

      {/* Import Dialog */}
      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </>
  );
}
