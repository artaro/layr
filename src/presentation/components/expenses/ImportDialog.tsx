'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FileUploadZone } from '@/presentation/components/common';
import { useStatementImport } from '@/presentation/hooks/useStatementImport';
import { useAccounts, useCategories } from '@/presentation/hooks';
import ImportPreviewTable from './ImportPreviewTable';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ImportDialog({ open, onClose }: ImportDialogProps) {
  const {
    status,
    file,
    transactions,
    setTransactions,
    error,
    pdfPassword,
    setPdfPassword,
    handleFileSelect,
    parseWithLLM,
    importTransactions,
    loadDemoData,
    reset,
  } = useStatementImport();

  const { data: accounts = [] } = useAccounts();
  const { data: categories = [] } = useCategories();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Auto-parse when file is selected
  useEffect(() => {
    if (file && status === 'idle') {
      parseWithLLM();
    }
  }, [file, status, parseWithLLM]);

  const handleClose = () => {
    reset();
    setSelectedAccount('');
    setShowPassword(false);
    onClose();
  };

  const handleImport = () => {
    if (selectedAccount) {
      importTransactions(selectedAccount);
    }
  };

  const incomeCount = transactions.filter((t) => t.type === 'income').length;
  const expenseCount = transactions.filter((t) => t.type === 'expense').length;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, maxHeight: '90vh' },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
          Import Statement 📄
        </Typography>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }} onClose={() => {}}>
            {error}
          </Alert>
        )}

        {/* Step 1: Upload file */}
        {(status === 'idle' || status === 'error') && !file && (
          <Box>
            <FileUploadZone
              accept=".csv,.pdf"
              onFileSelect={handleFileSelect}
              selectedFile={file}
              label="Drop your statement here"
              description="Supports CSV and PDF files from your bank or credit card"
            />
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="text"
                size="small"
                onClick={loadDemoData}
                sx={{ borderRadius: 2 }}
              >
                Use Demo Data (Try it out!)
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 1b: Password required */}
        {status === 'needs_password' && (
          <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 2.5, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '3rem' }}>🔒</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Password-Protected PDF
            </Typography>
            <TextField
              label="PDF Password"
              type={showPassword ? 'text' : 'password'}
              value={pdfPassword}
              onChange={(e) => setPdfPassword(e.target.value)}
              fullWidth
              autoFocus
              sx={{ maxWidth: 360 }}
              placeholder="Enter your statement password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && pdfPassword) parseWithLLM();
              }}
            />
            <Button
              variant="contained"
              onClick={parseWithLLM}
              disabled={!pdfPassword}
              sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
            >
              Unlock & Parse
            </Button>
          </Box>
        )}

        {/* Step 2: Processing */}
        {(status === 'reading' || status === 'parsing') && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress
              size={56}
              sx={{ color: 'primary.main', mb: 3 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {status === 'reading' ? 'Reading file...' : 'AI is extracting transactions... 🤖'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {status === 'parsing'
                ? 'This may take a few seconds depending on the file size'
                : 'Extracting text content'}
            </Typography>
          </Box>
        )}

        {/* Step 3: Preview */}
        {status === 'ready' && transactions.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Review & Import
                </Typography>
                <Chip label={`💰 ${incomeCount}`} size="small" sx={{ backgroundColor: 'rgba(0,206,201,0.1)' }} />
                <Chip label={`💸 ${expenseCount}`} size="small" sx={{ backgroundColor: 'rgba(255,118,117,0.1)' }} />
              </Box>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Target Account</InputLabel>
              <Select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                label="Select Target Account"
              >
                {accounts.map((acc) => (
                  <MenuItem key={acc.id} value={acc.id}>
                    {acc.type === 'bank' ? '🏦' : '💳'} {acc.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <ImportPreviewTable
              transactions={transactions}
              onTransactionsChange={setTransactions}
              categories={categories}
            />
          </Box>
        )}

        {/* Step 4: Importing */}
        {status === 'importing' && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CircularProgress size={56} sx={{ color: 'primary.main', mb: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Importing transactions... 💾
            </Typography>
          </Box>
        )}

        {/* Step 5: Done */}
        {status === 'done' && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CloudDoneIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Import Complete! 🎉
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {transactions.length} transactions have been imported successfully.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        {status === 'done' ? (
          <Button variant="contained" onClick={handleClose}>
            Done
          </Button>
        ) : status === 'ready' ? (
          <>
            <Button variant="outlined" onClick={() => { reset(); }}>
              Start Over
            </Button>
            <Button
              variant="contained"
              onClick={handleImport}
              disabled={!selectedAccount}
            >
              Import {transactions.length} Transactions
            </Button>
          </>
        ) : (
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
