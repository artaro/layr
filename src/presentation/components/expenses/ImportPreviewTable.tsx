'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Toolbar,
  alpha,
  InputAdornment,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ParsedLLMTransaction } from '@/presentation/hooks/useStatementImport';
import { Category } from '@/domain/entities';
import { formatCurrency } from '@/lib/formatters';

interface ImportPreviewTableProps {
  transactions: ParsedLLMTransaction[];
  onTransactionsChange: (transactions: ParsedLLMTransaction[]) => void;
  categories: Category[];
}

export default function ImportPreviewTable({
  transactions,
  onTransactionsChange,
  categories,
}: ImportPreviewTableProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [batchCategory, setBatchCategory] = useState<string>('');

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = new Set(transactions.map((_, index) => index));
      setSelectedIndices(newSelected);
    } else {
      setSelectedIndices(new Set());
    }
  };

  const handleSelectOne = (index: number) => {
    const newSelected = new Set(selectedIndices);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedIndices(newSelected);
  };

  const updateTransaction = (index: number, field: keyof ParsedLLMTransaction, value: any) => {
    const newTransactions = [...transactions];
    newTransactions[index] = { ...newTransactions[index], [field]: value };
    onTransactionsChange(newTransactions);
  };

  const handleBatchCategoryChange = (categoryId: string) => {
    if (!categoryId) return;
    const newTransactions = [...transactions];
    selectedIndices.forEach((index) => {
      newTransactions[index] = { ...newTransactions[index], category: categoryId };
    });
    onTransactionsChange(newTransactions);
    setBatchCategory(''); // Reset selection
    // Optional: Clear selection after batch update? Maybe keep it.
  };

  const handleBatchDescriptionEdit = () => {
    const newDescription = prompt('Enter description for selected items:');
    if (newDescription !== null) {
      const newTransactions = [...transactions];
      selectedIndices.forEach((index) => {
        newTransactions[index] = { ...newTransactions[index], description: newDescription };
      });
      onTransactionsChange(newTransactions);
    }
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedIndices.size} selected transactions?`)) {
      const newTransactions = transactions.filter((_, index) => !selectedIndices.has(index));
      onTransactionsChange(newTransactions);
      setSelectedIndices(new Set());
    }
  };

  const selectedCount = selectedIndices.size;

  return (
    <Box>
      {/* Batch Actions Toolbar */}
      {selectedCount > 0 && (
        <Toolbar
          sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            borderRadius: 2,
            mb: 2,
            display: 'flex',
            gap: 2,
          }}
        >
          <Typography color="inherit" variant="subtitle1" component="div" sx={{ flex: '0 0 auto' }}>
            {selectedCount} selected
          </Typography>

          <Box sx={{ flex: '1 1 auto', display: 'flex', gap: 2, alignItems: 'center' }}>
            <Select
              size="small"
              displayEmpty
              value={batchCategory}
              onChange={(e) => handleBatchCategoryChange(e.target.value)}
              sx={{ minWidth: 150, bgcolor: 'background.paper' }}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography color="text.secondary">Set Category...</Typography>;
                }
                const cat = categories.find((c) => c.id === selected);
                return (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {cat?.icon} {cat?.name}
                  </Box>
                );
              }}
            >
              <MenuItem value="" disabled>
                Set Category...
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={handleBatchDescriptionEdit}
              sx={{ bgcolor: 'background.paper' }}
            >
              Edit Description
            </Button>
          </Box>

          <Tooltip title="Delete">
            <IconButton onClick={handleDeleteSelected}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      )}

      <TableContainer sx={{ maxHeight: 400, borderRadius: 2 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedCount > 0 && selectedCount < transactions.length}
                  checked={transactions.length > 0 && selectedCount === transactions.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date/Time</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600, minWidth: 200 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx, index) => {
               const isSelected = selectedIndices.has(index);
               return (
                <TableRow
                  key={index}
                  hover
                  selected={isSelected}
                  sx={{ '&.Mui-selected': { bgcolor: alpha('#6C5CE7', 0.08) } }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isSelected}
                      onChange={() => handleSelectOne(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{tx.date}</Typography>
                    {tx.time && (
                      <Typography variant="caption" color="text.secondary">
                        {tx.time}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={tx.category || ''}
                      onChange={(e) => updateTransaction(index, 'category', e.target.value)}
                      displayEmpty
                      size="small"
                      sx={{
                        minWidth: 140,
                        '& .MuiSelect-select': { py: 1, display: 'flex', alignItems: 'center', gap: 1 },
                      }}
                      renderValue={(selected) => {
                        if (!selected) return <Typography variant="caption" color="text.secondary">Select...</Typography>;
                        const cat = categories.find(c => c.id === selected);
                        return <><span style={{fontSize: '1.2em'}}>{cat?.icon}</span> {cat?.name}</>;
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={tx.description}
                      onChange={(e) => updateTransaction(index, 'description', e.target.value)}
                      fullWidth
                      variant="standard"
                      InputProps={{ disableUnderline: true }}
                      sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.type === 'income' ? 'Income' : 'Expense'}
                      size="small"
                      sx={{
                        height: 24,
                        bgcolor:
                          tx.type === 'income'
                            ? alpha('#00CEC9', 0.1)
                            : alpha('#FF7675', 0.1),
                        color: tx.type === 'income' ? '#00A8A4' : '#D63031',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {formatCurrency(tx.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
