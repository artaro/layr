'use client';

import React from 'react';
import { Box, Typography, Button, SxProps, Theme } from '@mui/material';

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  sx?: SxProps<Theme>;
}

export default function EmptyState({
  emoji = '🤷‍♂️',
  title,
  description,
  actionLabel,
  onAction,
  sx,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 3,
        textAlign: 'center',
        ...sx,
      }}
    >
      <Typography sx={{ fontSize: '4rem', mb: 2, lineHeight: 1 }}>
        {emoji}
      </Typography>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ mb: 3, color: 'text.secondary', maxWidth: 320 }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} size="large">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
