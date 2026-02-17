'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDialog } from '@/presentation/components/common';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/presentation/hooks';
import { Category } from '@/domain/entities';

const EMOJI_OPTIONS = [
  '🍔',
  '🚗',
  '🛍️',
  '🎮',
  '💡',
  '💊',
  '📚',
  '💰',
  '🔄',
  '📦',
  '☕',
  '✈️',
  '🏠',
  '💻',
  '👕',
  '🎬',
  '🏋️',
  '🎵',
];
const COLOR_OPTIONS = [
  '#FF7675',
  '#74B9FF',
  '#FD79A8',
  '#6C5CE7',
  '#FDCB6E',
  '#55EFC4',
  '#00B894',
  '#0984E3',
  '#E17055',
  '#A29BFE',
  '#E84393',
  '#636E72',
];

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError } = useCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    color: '#6C5CE7',
  });

  const openAddForm = () => {
    setFormData({ name: '', icon: '📦', color: '#6C5CE7' });
    setEditTarget(null);
    setFormOpen(true);
  };

  const openEditForm = (cat: Category) => {
    setFormData({ name: cat.name, icon: cat.icon, color: cat.color });
    setEditTarget(cat);
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editTarget) {
        await updateMutation.mutateAsync({
          id: editTarget.id,
          input: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setFormOpen(false);
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteMutation.mutateAsync(deleteTarget.id);
        setDeleteTarget(null);
      } catch (error) {
        console.error('Failed to delete category', error);
      }
    }
  };

  const loading = createMutation.isPending || updateMutation.isPending;

  return (
    <Box className="animate-fade-in">
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Categories 🏷️
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Organize your transactions with custom categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddForm}
          sx={{ py: 1.2 }}
        >
          Add Category
        </Button>
      </Box>

      {/* Loading & Error States */}
      {isLoading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}
      {isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          Failed to load categories
        </Alert>
      )}

      {/* Category grid */}
      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid size={{ xs: 6, sm: 4, md: 3 }} key={cat.id}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                borderRadius: 4, // 16px
                '&:hover .category-actions': { opacity: 1 },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                {/* Gradient background circle */}
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '18px',
                    background: `${cat.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5,
                    fontSize: '1.8rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat.icon}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {cat.name}
                </Typography>
                {/* 
                <Typography variant="caption" color="text.secondary">
                  {cat.transactionCount} transactions
                </Typography>
                */}

                {/* Hover actions */}
                <Box
                  className="category-actions"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    gap: 0.5,
                  }}
                >
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(cat);
                      }}
                      sx={{
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { color: 'primary.main' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(cat);
                      }}
                      sx={{
                        backgroundColor: 'background.paper',
                        boxShadow: 1,
                        '&:hover': { color: 'error.main' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Color bar */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    backgroundColor: cat.color,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit category dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
            {editTarget ? 'Edit Category ✏️' : 'New Category 🏷️'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}
          >
            <TextField
              label="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
              placeholder="e.g. Groceries"
            />

            {/* Icon picker */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Icon
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {EMOJI_OPTIONS.map((emoji) => (
                  <Box
                    key={emoji}
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2, // 8px
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.3rem',
                      border:
                        formData.icon === emoji ? '2px solid' : '1px solid',
                      borderColor:
                        formData.icon === emoji ? 'primary.main' : 'divider',
                      backgroundColor:
                        formData.icon === emoji
                          ? 'rgba(108,92,231,0.08)'
                          : 'transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': { borderColor: 'primary.light' },
                    }}
                  >
                    {emoji}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Color picker */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Color
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {COLOR_OPTIONS.map((color) => (
                  <Box
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '10px', // slightly rounded
                      backgroundColor: color,
                      cursor: 'pointer',
                      border:
                        formData.color === color
                          ? '3px solid'
                          : '2px solid transparent',
                      borderColor:
                        formData.color === color ? '#2D3436' : 'transparent',
                      transition: 'all 0.15s ease',
                      '&:hover': { transform: 'scale(1.15)' },
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            onClick={() => setFormOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name.trim() || loading}
          >
            {loading
              ? 'Saving...'
              : editTarget
              ? 'Save Changes'
              : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category? 🗑️"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Transactions in this category won't be deleted, just uncategorized.`}
        confirmLabel={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
