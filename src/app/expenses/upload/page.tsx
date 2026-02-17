'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  LinearProgress,
} from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { FileUploadZone } from '@/presentation/components/common';
import {
  CsvColumnMapping,
  CsvParseResult,
  parseCsvFile,
} from '@/infrastructure/parsers/csvParser';
import { TransactionType, StatementSource } from '@/domain/enums';
import { formatCurrency } from '@/lib/formatters';
import { useAccounts, useCreateTransactionsBulk } from '@/presentation/hooks';
import { CreateTransactionInput } from '@/domain/entities';

export default function UploadPage() {
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const bulkCreateMutation = useCreateTransactionsBulk();

  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CsvParseResult | null>(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [mapping, setMapping] = useState<CsvColumnMapping>({
    dateColumn: '',
    descriptionColumn: '',
    amountColumn: '',
  });
  const [step, setStep] = useState<'upload' | 'map' | 'preview' | 'done'>(
    'upload'
  );
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);

    // Read file to get headers
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const firstLine = text.split('\n')[0];
      const headers = firstLine
        .split(',')
        .map((h) => h.trim().replace(/"/g, ''));

      // Auto-map if headers match common patterns
      const autoMapping: CsvColumnMapping = {
        dateColumn: headers.find((h) => /date/i.test(h)) || headers[0] || '',
        descriptionColumn:
          headers.find((h) => /desc|detail|memo|narration/i.test(h)) ||
          headers[1] ||
          '',
        amountColumn:
          headers.find((h) => /amount|value|sum/i.test(h)) ||
          headers[2] ||
          '',
      };
      setMapping(autoMapping);
      setStep('map');
    };
    reader.readAsText(selectedFile);
  };

  const handleParse = async () => {
    if (!file) return;

    try {
      const text = await file.text();
      const result = parseCsvFile(text, mapping);

      if (result.transactions.length === 0) {
        setError('No valid transactions found. Check your column mapping.');
        return;
      }

      setParseResult(result);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    }
  };

  const handleImport = async () => {
    if (!selectedAccount || !parseResult) return;

    try {
      const inputs: CreateTransactionInput[] = parseResult.transactions.map(
        (tx) => ({
          accountId: selectedAccount,
          amount: tx.amount,
          type: tx.type as TransactionType,
          description: tx.description,
          transactionDate: tx.date,
          source: StatementSource.CSV_IMPORT,
        })
      );

      await bulkCreateMutation.mutateAsync(inputs);
      setStep('done');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to import transactions'
      );
    }
  };

  const handleReset = () => {
    setFile(null);
    setParseResult(null);
    setSelectedAccount('');
    setMapping({ dateColumn: '', descriptionColumn: '', amountColumn: '' });
    setStep('upload');
    setError(null);
  };

  return (
    <Box className="animate-fade-in">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Upload Statement 📄
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Import transactions from your bank or credit card CSV
        </Typography>
      </Box>

      {/* Steps indicator */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {['Upload', 'Map Columns', 'Preview', 'Done'].map((label, index) => {
          const steps = ['upload', 'map', 'preview', 'done'];
          const isActive = steps.indexOf(step) >= index;
          return (
            <Chip
              key={label}
              label={`${index + 1}. ${label}`}
              size="small"
              sx={{
                backgroundColor: isActive
                  ? 'primary.main'
                  : 'rgba(108,92,231,0.08)',
                color: isActive ? '#fff' : 'text.secondary',
                fontWeight: 500,
                borderRadius: 2, // 8px
              }}
            />
          );
        })}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {/* Step 1: Upload */}
      {step === 'upload' && (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <FileUploadZone
              accept=".csv"
              onFileSelect={handleFileSelect}
              selectedFile={file}
              onClear={() => {
                setFile(null);
                setStep('upload');
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Step 2: Map columns */}
      {step === 'map' && (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Map CSV Columns 🗺️
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControl fullWidth disabled={accountsLoading}>
                <InputLabel>Select Account</InputLabel>
                <Select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  label="Select Account"
                  sx={{ borderRadius: 3 }}
                >
                  {accounts.map((acc) => (
                    <MenuItem key={acc.id} value={acc.id}>
                      {acc.type === 'bank' ? '🏦' : '💳'} {acc.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {file && (
                <>
                  <Typography variant="body2" color="text.secondary">
                    Detected file: <strong>{file.name}</strong> — Map your
                    columns below:
                  </Typography>
                  {/* Show simple input fields for column names */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' },
                      gap: 2,
                    }}
                  >
                    <FormControl fullWidth size="small">
                      <InputLabel>Date Column</InputLabel>
                      <Select
                        value={mapping.dateColumn}
                        onChange={(e) =>
                          setMapping({
                            ...mapping,
                            dateColumn: e.target.value,
                          })
                        }
                        label="Date Column"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={mapping.dateColumn}>
                          {mapping.dateColumn || 'Auto-detected'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel>Description Column</InputLabel>
                      <Select
                        value={mapping.descriptionColumn}
                        onChange={(e) =>
                          setMapping({
                            ...mapping,
                            descriptionColumn: e.target.value,
                          })
                        }
                        label="Description Column"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={mapping.descriptionColumn}>
                          {mapping.descriptionColumn || 'Auto-detected'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel>Amount Column</InputLabel>
                      <Select
                        value={mapping.amountColumn}
                        onChange={(e) =>
                          setMapping({
                            ...mapping,
                            amountColumn: e.target.value,
                          })
                        }
                        label="Amount Column"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={mapping.amountColumn}>
                          {mapping.amountColumn || 'Auto-detected'}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </>
              )}

              <Box
                sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}
              >
                <Button variant="outlined" onClick={handleReset}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleParse}
                  disabled={!selectedAccount || !mapping.dateColumn}
                >
                  Parse & Preview
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && parseResult && (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Preview ({parseResult.transactions.length} transactions) 👀
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`${parseResult.totalRows} rows`} size="small" />
                {parseResult.skippedRows > 0 && (
                  <Chip
                    label={`${parseResult.skippedRows} skipped`}
                    size="small"
                    color="warning"
                  />
                )}
              </Box>
            </Box>

            <TableContainer sx={{ maxHeight: 400, borderRadius: 3 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parseResult.transactions.slice(0, 20).map((tx, idx) => (
                    <TableRow key={idx} hover>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            tx.type === TransactionType.INCOME
                              ? '💰 Income'
                              : '💸 Expense'
                          }
                          size="small"
                          sx={{
                            backgroundColor:
                              tx.type === TransactionType.INCOME
                                ? 'rgba(0, 206, 201, 0.1)'
                                : 'rgba(255, 118, 117, 0.1)',
                            color:
                              tx.type === TransactionType.INCOME
                                ? '#00A8A4'
                                : '#D63031',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatCurrency(tx.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {parseResult.transactions.length > 20 && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: 'block' }}
              >
                Showing 20 of {parseResult.transactions.length} transactions...
              </Typography>
            )}

            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
                mt: 3,
                alignItems: 'center',
              }}
            >
              {bulkCreateMutation.isPending && <LinearProgress sx={{ flex: 1, mr: 2, borderRadius: 1 }} />}
              <Button
                variant="outlined"
                onClick={() => setStep('map')}
                disabled={bulkCreateMutation.isPending}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleImport}
                disabled={bulkCreateMutation.isPending}
              >
                {bulkCreateMutation.isPending
                  ? 'Importing...'
                  : `Import ${parseResult.transactions.length} Transactions`}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Done */}
      {step === 'done' && (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <CloudDoneIcon
              sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Import Complete! 🎉
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {parseResult?.transactions.length} transactions have been imported
              successfully.
            </Typography>
            <Button variant="contained" onClick={handleReset}>
              Upload Another Statement
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
